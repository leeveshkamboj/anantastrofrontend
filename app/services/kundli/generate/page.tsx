'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetMyKundlisQuery,
  useCreateKundliMutation,
  useUpdateKundliMutation,
  useCreateKundliGenerationMutation,
  useLazyGetGeocodeQuery,
  useLazyGetGeocodeSuggestionsQuery,
  useLazyGetGeocodeTimezoneQuery,
} from '@/store/api/kundliApi';
import type { PlaceSuggestion } from '@/store/api/kundliApi';
import { useAuth } from '@/store/hooks/useAuth';
import { selectKundliFormData, clearKundliFormData } from '@/store/slices/kundliFormSlice';
import { geocodePlace } from '@/lib/geocode';
import { toast } from 'sonner';
import {
  KundliGenerateHero,
  WhatIsKundli,
  HowItWorks,
  WhyDetailsMatter,
  WhatYouGet,
  KundliFaq,
  KundliFinalCta,
  GetKundliSection,
} from '@/components/kundli/generate';

function KundliGenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const kundliForm = useSelector(selectKundliFormData);

  const profileIdFromUrl = searchParams.get('profileId');
  const profileIdNum = profileIdFromUrl ? parseInt(profileIdFromUrl, 10) : null;
  const fromHero = searchParams.get('from') === 'hero';

  const { data: kundlisData, isLoading, refetch } = useGetMyKundlisQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createKundli, { isLoading: isCreating }] = useCreateKundliMutation();
  const [updateKundli, { isLoading: isUpdating }] = useUpdateKundliMutation();
  const [createKundliGeneration, { isLoading: isStartingGeneration }] = useCreateKundliGenerationMutation();
  const [getGeocode] = useLazyGetGeocodeQuery();
  const [getGeocodeSuggestions] = useLazyGetGeocodeSuggestionsQuery();
  const [getGeocodeTimezone] = useLazyGetGeocodeTimezoneQuery();

  const kundlis = kundlisData?.data ?? [];
  const hasProfiles = kundlis.length > 0;

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showSomeoneElseForm, setShowSomeoneElseForm] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>();
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [placeSearchLoading, setPlaceSearchLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);
  const placeInputContainerRef = useRef<HTMLDivElement>(null);
  const skipSuggestionsRef = useRef(false);

  const [debouncedPlaceSearch, setDebouncedPlaceSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => {
      const q = placeOfBirth?.trim() || undefined;
      setDebouncedPlaceSearch(q ?? '');
    }, 400);
    return () => clearTimeout(t);
  }, [placeOfBirth]);

  useEffect(() => {
    if (skipSuggestionsRef.current) {
      skipSuggestionsRef.current = false;
      setPlaceSuggestions([]);
      setPlaceSearchLoading(false);
      return;
    }
    const query = debouncedPlaceSearch;
    if (!query) {
      setPlaceSuggestions([]);
      setPlaceSearchLoading(false);
      return;
    }
    let cancelled = false;
    setPlaceSearchLoading(true);
    getGeocodeSuggestions({ place: query, limit: 8 })
      .unwrap()
      .then((res) => {
        if (!cancelled && res?.data) {
          const normalized = res.data.map((item: { placeId?: string; place_id?: string; formattedAddress?: string; formatted_address?: string }) => ({
            placeId: (item.placeId ?? item.place_id ?? '').trim(),
            formattedAddress: (item.formattedAddress ?? item.formatted_address ?? '').trim(),
          })).filter((item) => item.placeId && item.formattedAddress);
          setPlaceSuggestions(normalized);
        }
      })
      .catch(() => {
        if (!cancelled) setPlaceSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setPlaceSearchLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedPlaceSearch, getGeocodeSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (placeInputContainerRef.current && !placeInputContainerRef.current.contains(e.target as Node)) {
        setPlaceSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSelectPlace = (suggestion: PlaceSuggestion) => {
    setPlaceSuggestions([]);
    skipSuggestionsRef.current = true;
    const address = (suggestion.formattedAddress ?? (suggestion as unknown as { formatted_address?: string }).formatted_address ?? '').trim();
    setPlaceOfBirth(address);
    setSelectedPlace(suggestion);
  };

  useEffect(() => {
    if (selectedPlace && placeOfBirth.trim() !== (selectedPlace.formattedAddress ?? '').trim()) {
      setSelectedPlace(null);
    }
  }, [placeOfBirth, selectedPlace]);

  useEffect(() => {
    if (!hasProfiles || isLoading) return;
    if (profileIdNum != null && !Number.isNaN(profileIdNum) && kundlis.some((k) => k.id === profileIdNum)) {
      setSelectedId(profileIdNum);
    }
  }, [hasProfiles, isLoading, profileIdNum, kundlis]);

  useEffect(() => {
    if (!kundliForm.name?.trim()) return;
    if (showSomeoneElseForm) return;
    setName(kundliForm.name);
    setDateOfBirth(kundliForm.dateOfBirth || undefined);
    setTimeOfBirth(kundliForm.timeOfBirth || '');
    setPlaceOfBirth(kundliForm.placeOfBirth || '');
  }, [kundliForm.name, kundliForm.dateOfBirth, kundliForm.timeOfBirth, kundliForm.placeOfBirth, hasProfiles, showSomeoneElseForm]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!fromHero) return;
    const timer = setTimeout(() => {
      const el = document.getElementById('get-kundli');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      const params = new URLSearchParams(searchParams.toString());
      params.delete('from');
      const newSearch = params.toString();
      const newPath = `/services/kundli/generate${newSearch ? `?${newSearch}` : ''}`;
      router.replace(newPath, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [fromHero, router, searchParams]);

  const startGenerationAndRedirect = async (
    dob: string,
    time: string,
    place: string,
    existingLatLng?: { latitude: number; longitude: number } | null,
    name?: string,
    profileTimezoneHours?: number | null,
  ) => {
    if (!dob || !time?.trim()) {
      toast.error('Date and time of birth are required');
      return;
    }
    if (!place?.trim()) {
      toast.error('Place of birth is required to calculate your chart.');
      return;
    }
    const trimmedPlace = place.trim();
    let lat: number;
    let lng: number;
    if (existingLatLng?.latitude != null && existingLatLng?.longitude != null) {
      lat = existingLatLng.latitude;
      lng = existingLatLng.longitude;
    } else {
      try {
        const geoRes = await getGeocode(trimmedPlace).unwrap();
        const data = geoRes?.data;
        if (data?.lat != null && data?.lng != null) {
          lat = data.lat;
          lng = data.lng;
        } else {
          const fallback = await geocodePlace(trimmedPlace);
          if (!fallback) {
            toast.error('Could not find location. Please select a city from the list or enter a valid place name.');
            return;
          }
          lat = fallback.lat;
          lng = fallback.lon;
        }
      } catch {
        const fallback = await geocodePlace(trimmedPlace);
        if (!fallback) {
          toast.error('Could not find location. Please select a city from the list or enter a valid place name.');
          return;
        }
        lat = fallback.lat;
        lng = fallback.lon;
      }
    }
    let timezoneOffsetHours: number = 5.5;
    if (profileTimezoneHours != null && !Number.isNaN(profileTimezoneHours)) {
      timezoneOffsetHours = profileTimezoneHours;
    } else {
      try {
        const tzRes = await getGeocodeTimezone({ lat, lng }).unwrap();
        const tz = tzRes?.data?.timezoneOffsetHours;
        if (tz != null && !Number.isNaN(tz)) timezoneOffsetHours = tz;
      } catch {
        // keep 5.5
      }
    }
    try {
      const res = await createKundliGeneration({
        dob,
        time: time.trim(),
        latitude: lat,
        longitude: lng,
        timezoneOffsetHours,
        ...(name?.trim() && { name: name.trim() }),
        ...(trimmedPlace && { placeOfBirth: trimmedPlace }),
      }).unwrap();
      const uuid = res?.data?.uuid;
      if (uuid) {
        toast.success('Kundli generation started. We’ll email you when it’s ready.');
        router.push(`/services/kundli/result/${uuid}`);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Failed to start kundli generation. Please try again.');
    }
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      if (editingProfileId != null) {
        const result = await updateKundli({
          id: editingProfileId,
          body: {
            name: name.trim(),
            dateOfBirth: dateOfBirth || undefined,
            timeOfBirth: timeOfBirth || undefined,
            placeOfBirth: placeOfBirth || undefined,
            ...(selectedPlace && (selectedPlace.formattedAddress ?? '').trim() === (placeOfBirth ?? '').trim() && selectedPlace.placeId && {
              placeId: selectedPlace.placeId,
            }),
          },
        }).unwrap();
        dispatch(clearKundliFormData());
        if (result?.data?.id) {
          setSelectedId(result.data.id);
          setShowSomeoneElseForm(false);
          setEditingProfileId(null);
          setName('');
          setDateOfBirth(undefined);
          setTimeOfBirth('');
          setPlaceOfBirth('');
          refetch();
          toast.success('Profile updated and selected.');
        }
      } else {
        const result = await createKundli({
          name: name.trim(),
          dateOfBirth: dateOfBirth || undefined,
          timeOfBirth: timeOfBirth || undefined,
          placeOfBirth: placeOfBirth || undefined,
          ...(selectedPlace && (selectedPlace.formattedAddress ?? '').trim() === (placeOfBirth ?? '').trim() && selectedPlace.placeId && {
            placeId: selectedPlace.placeId,
          }),
        }).unwrap();
        dispatch(clearKundliFormData());
        if (result?.data?.id) {
          const newId = result.data.id;
          setSelectedId(newId);
          setShowSomeoneElseForm(false);
          setEditingProfileId(null);
          setName('');
          setDateOfBirth(undefined);
          setTimeOfBirth('');
          setPlaceOfBirth('');
          await refetch();
          if (dateOfBirth && timeOfBirth?.trim() && placeOfBirth?.trim()) {
            const latLng = result.data.latitude != null && result.data.longitude != null
              ? { latitude: result.data.latitude, longitude: result.data.longitude }
              : undefined;
            await startGenerationAndRedirect(dateOfBirth, timeOfBirth, placeOfBirth, latLng, name?.trim() || undefined, result.data.timezoneOffsetHours ?? undefined);
            return;
          }
          toast.success('Kundli profile saved. The new profile is selected.');
        }
      }
    } catch {
      toast.error('Failed to save profile');
    }
  };

  const handleGetKundli = async () => {
    if (hasProfiles && !selectedId) {
      toast.error('Please select a profile first');
      return;
    }
    if (hasProfiles && selectedId != null) {
      const profile = kundlis.find((k) => k.id === selectedId);
      if (!profile) {
        toast.error('Selected profile not found');
        return;
      }
      const dob = profile.dateOfBirth ?? '';
      const time = profile.timeOfBirth ?? '';
      const place = profile.placeOfBirth ?? '';
      const latLng =
        profile.latitude != null && profile.longitude != null
          ? { latitude: profile.latitude, longitude: profile.longitude }
          : null;
      await startGenerationAndRedirect(dob, time, place, latLng, profile.name?.trim() || undefined, profile.timezoneOffsetHours ?? undefined);
      return;
    }
    await startGenerationAndRedirect(dateOfBirth ?? '', timeOfBirth, placeOfBirth, undefined, name?.trim() || undefined);
  };

  const handleBackSomeoneElse = () => {
    setShowSomeoneElseForm(false);
    setEditingProfileId(null);
    setName('');
    setDateOfBirth(undefined);
    setTimeOfBirth('');
    setPlaceOfBirth('');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <KundliGenerateHero />
      <WhatIsKundli />
      <HowItWorks />
      <WhyDetailsMatter />
      <section id="get-kundli" className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">Get your Kundli</h2>
            <p className="text-lg text-gray-600 text-center mb-10">
              Enter birth details or choose a saved profile below.
            </p>
            <GetKundliSection
              hasProfiles={hasProfiles}
              isLoading={isLoading}
              kundlis={kundlis}
              selectedId={selectedId}
              onSelectProfile={setSelectedId}
              showSomeoneElseForm={showSomeoneElseForm}
              onShowSomeoneElseForm={setShowSomeoneElseForm}
              name={name}
              onNameChange={setName}
              dateOfBirth={dateOfBirth}
              onDateOfBirthChange={setDateOfBirth}
              timeOfBirth={timeOfBirth}
              onTimeOfBirthChange={setTimeOfBirth}
              placeOfBirth={placeOfBirth}
              onPlaceOfBirthChange={setPlaceOfBirth}
              placeSuggestions={placeSuggestions}
              placeSearchLoading={placeSearchLoading}
              onSelectPlace={onSelectPlace}
              placeInputRef={placeInputContainerRef}
              onAddProfile={handleAddProfile}
              isCreating={isCreating}
              isUpdating={isUpdating}
              onGetKundli={handleGetKundli}
              isStartingGeneration={isStartingGeneration}
              kundliFormPrefill={{
                name: kundliForm.name || '',
                dateOfBirth: kundliForm.dateOfBirth || undefined,
                timeOfBirth: kundliForm.timeOfBirth || '',
                placeOfBirth: kundliForm.placeOfBirth || '',
              }}
              onBackSomeoneElse={handleBackSomeoneElse}
            />
          </div>
        </div>
      </section>
      <WhatYouGet />
      <KundliFaq />
      <KundliFinalCta />
    </div>
  );
}

export default function KundliGeneratePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading…</div>
      </div>
    }>
      <KundliGenerateContent />
    </Suspense>
  );
}
