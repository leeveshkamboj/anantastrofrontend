'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMyKundlisQuery, useCreateKundliMutation, useUpdateKundliMutation, useCreateKundliGenerationMutation, useLazyGetGeocodeQuery, useLazyGetGeocodeSuggestionsQuery } from '@/store/api/kundliApi';
import type { PlaceSuggestion } from '@/store/api/kundliApi';
import { useAuth } from '@/store/hooks/useAuth';
import { selectKundliFormData, clearKundliFormData } from '@/store/slices/kundliFormSlice';
import { geocodePlace } from '@/lib/geocode';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import {
  BookOpen,
  Plus,
  User,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KundliGeneratePage() {
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

  const kundlis = kundlisData?.data ?? [];
  const hasProfiles = kundlis.length > 0;

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
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

  // Preselect profile from URL when profiles are loaded
  useEffect(() => {
    if (!hasProfiles || isLoading) return;
    if (profileIdNum != null && !Number.isNaN(profileIdNum) && kundlis.some((k) => k.id === profileIdNum)) {
      setSelectedId(profileIdNum);
    }
  }, [hasProfiles, isLoading, profileIdNum, kundlis]);

  // When no profiles: prefill form from hero kundli form data. Do not overwrite when user is in "someone else" form.
  useEffect(() => {
    if (!kundliForm.name?.trim()) return;
    if (showSomeoneElseForm) return;
    setName(kundliForm.name);
    setDateOfBirth(kundliForm.dateOfBirth || undefined);
    setTimeOfBirth(kundliForm.timeOfBirth || '');
    setPlaceOfBirth(kundliForm.placeOfBirth || '');
    if (!hasProfiles) setShowAddForm(true);
  }, [kundliForm.name, kundliForm.dateOfBirth, kundliForm.timeOfBirth, kundliForm.placeOfBirth, hasProfiles, showSomeoneElseForm]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  // Auto-scroll to "Get your Kundli" section when coming from hero
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
      const newPath = `/kundli/generate${newSearch ? `?${newSearch}` : ''}`;
      router.replace(newPath, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [fromHero, router, searchParams]);

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
          setShowAddForm(false);
          setShowSomeoneElseForm(false);
          setEditingProfileId(null);
          setName('');
          setDateOfBirth(undefined);
          setTimeOfBirth('');
          setPlaceOfBirth('');
          await refetch();
          if (dateOfBirth && timeOfBirth?.trim() && placeOfBirth?.trim()) {
            await startGenerationAndRedirect(dateOfBirth, timeOfBirth, placeOfBirth, undefined, name?.trim() || undefined);
            return;
          }
          toast.success('Kundli profile saved. The new profile is selected.');
        }
      }
    } catch {
      toast.error('Failed to save profile');
    }
  };

  const startGenerationAndRedirect = async (
    dob: string,
    time: string,
    place: string,
    existingLatLng?: { latitude: number; longitude: number } | null,
    name?: string,
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
    try {
      const res = await createKundliGeneration({
        dob,
        time: time.trim(),
        latitude: lat,
        longitude: lng,
        timezoneOffsetHours: 5.5,
        ...(name?.trim() && { name: name.trim() }),
        ...(trimmedPlace && { placeOfBirth: trimmedPlace }),
      }).unwrap();
      const id = res?.data?.id;
      if (id) router.push(`/kundli/result/${id}`);
      else toast.error('Something went wrong. Please try again.');
    } catch {
      toast.error('Failed to start kundli generation. Please try again.');
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
      await startGenerationAndRedirect(dob, time, place, latLng, profile.name?.trim() || undefined);
      return;
    }
    await startGenerationAndRedirect(dateOfBirth ?? '', timeOfBirth, placeOfBirth, undefined, name?.trim() || undefined);
  };

  if (!isAuthenticated) {
    return null;
  }

  const howItWorksSteps = [
    { step: 1, title: 'Enter birth details', desc: 'Provide name, date, time, and place of birth for accurate chart calculation.' },
    { step: 2, title: 'Create your profile', desc: 'Your kundli profile is saved so you can access it anytime.' },
    { step: 3, title: 'Get your kundli', desc: 'View your birth chart and personalized astrological insights.' },
    { step: 4, title: 'Explore insights', desc: 'Discover personality, career, relationships, and life path guidance.' },
  ];

  const whyDetailsMatter = [
    { icon: Calendar, title: 'Date of birth', desc: 'Determines your sun sign and the position of planets at birth.' },
    { icon: Clock, title: 'Time of birth', desc: 'Essential for accurate moon sign, ascendant, and house divisions.' },
    { icon: MapPin, title: 'Place of birth', desc: 'Used to calculate the exact longitude and latitude for your chart.' },
  ];

  const whatYouGet = [
    'Birth chart (Kundli) with planetary positions',
    'Rashi (Moon sign) and Nakshatra insights',
    'Lagna (Ascendant) and house analysis',
    'Personalized life and career guidance',
    'Compatibility and relationship insights',
  ];

  const faqs = [
    { q: 'Why is time of birth important?', a: 'The exact time determines your moon sign, ascendant (Lagna), and the division of houses in your chart. Even a few minutes can change the result.' },
    { q: 'Can I get kundli for family members?', a: 'Yes. Use "Get for someone else" to add birth details for family or friends and generate their kundli.' },
    { q: 'Is my data secure?', a: 'Your birth details and kundli profiles are stored securely and only accessible to you when logged in.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-primary-light text-primary-dark relative py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 flex items-center justify-center gap-4">
            <BookOpen className="h-12 w-12 md:h-14 md:w-14 text-primary" />
            Your Kundli
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-gray-700 mb-4">
            Create your birth chart and discover personalized astrological insights based on Vedic astrology.
          </p>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Enter your birth details once, save your profile, and access your kundli anytime. Get kundli for yourself or for family members.
          </p>
        </div>
      </section>

      {/* What is a Kundli */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What is a Kundli?</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                A <strong>Kundli</strong> (also called Janam Kundli or birth chart) is a map of the sky at the exact moment you were born. It shows the positions of the sun, moon, and planets in the 12 zodiac signs and 12 houses.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                In Vedic astrology, your kundli is used to understand your personality, strengths, challenges, career potential, relationships, and life path. The more accurate your birth details—especially date, time, and place—the more precise your chart and insights.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                At AnantAstro you can create and save multiple kundli profiles (for yourself and family), so you can revisit your chart and get personalized reports whenever you need.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-2xl bg-primary/10 p-8 md:p-12 border border-primary/20">
                <Sparkles className="h-24 w-24 text-primary mx-auto opacity-80" />
                <p className="text-center text-gray-600 mt-4 font-medium">Your birth chart, your insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">How it works</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Four simple steps to get your kundli and start exploring your astrological profile.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map(({ step, title, desc }) => (
              <Card key={step} className="border-2 border-gray-100 bg-white shadow-sm">
                <CardContent className="pt-6 pb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg mb-4">
                    {step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why birth details matter */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">Why birth details matter</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Accuracy of your kundli depends on the precision of the birth data you provide.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyDetailsMatter.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-0 shadow-lg bg-white">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get your Kundli - main CTA. Inlined (no inner component) so form inputs are not unmounted on every render. */}
      <section id="get-kundli" className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">Get your Kundli</h2>
            <p className="text-lg text-gray-600 text-center mb-10">
              Enter birth details or choose a saved profile below.
            </p>
            {!hasProfiles && !isLoading ? (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Create your first kundli profile</h3>
                  <p className="text-gray-600 mb-6">Enter birth details below. You can add more profiles later.</p>
                  <form onSubmit={handleAddProfile} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="bg-gray-50" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of birth</Label>
                      <DatePicker value={dateOfBirth} onChange={setDateOfBirth} placeholder="Select date" className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time of birth</Label>
                      <Input id="time" type="time" value={timeOfBirth} onChange={(e) => setTimeOfBirth(e.target.value)} className="bg-gray-50" />
                    </div>
                    <div ref={placeInputContainerRef} className="relative space-y-2">
                      <Label htmlFor="place">Place of birth</Label>
                      <Input
                        id="place"
                        value={placeOfBirth}
                        onChange={(e) => setPlaceOfBirth(e.target.value)}
                        placeholder="Search city or place"
                        className="bg-gray-50"
                        autoComplete="off"
                      />
                      {placeSearchLoading && placeOfBirth.trim() && (
                        <p className="text-sm text-gray-500">Searching…</p>
                      )}
                      {placeSuggestions.length > 0 && (
                        <ul className="absolute z-10 mt-0.5 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg max-h-56 overflow-auto">
                          {placeSuggestions.map((s, i) => (
                            <li key={i}>
                              <button
                                type="button"
                                onClick={() => onSelectPlace(s)}
                                className="w-full text-left px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                              >
                                {s.formattedAddress}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Button type="submit" disabled={isCreating} className="w-full bg-primary hover:bg-primary/90 text-lg py-6" size="lg">
                      <BookOpen className="h-5 w-5 mr-2" />
                      {isCreating ? 'Saving...' : 'Get Free Kundli'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : hasProfiles && showSomeoneElseForm ? (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Get kundli for someone else</h3>
                  <p className="text-gray-600 mb-6">Enter their birth details to create a new profile and get their kundli.</p>
                  <form onSubmit={handleAddProfile} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="someone-name">Name</Label>
                      <Input id="someone-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="bg-gray-50" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of birth</Label>
                      <DatePicker value={dateOfBirth} onChange={setDateOfBirth} placeholder="Select date" className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="someone-time">Time of birth</Label>
                      <Input id="someone-time" type="time" value={timeOfBirth} onChange={(e) => setTimeOfBirth(e.target.value)} className="bg-gray-50" />
                    </div>
                    <div ref={placeInputContainerRef} className="relative space-y-2">
                      <Label htmlFor="someone-place">Place of birth</Label>
                      <Input
                        id="someone-place"
                        value={placeOfBirth}
                        onChange={(e) => setPlaceOfBirth(e.target.value)}
                        placeholder="Search city or place"
                        className="bg-gray-50"
                        autoComplete="off"
                      />
                      {placeSearchLoading && placeOfBirth.trim() && (
                        <p className="text-sm text-gray-500">Searching…</p>
                      )}
                      {placeSuggestions.length > 0 && (
                        <ul className="absolute z-10 mt-0.5 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg max-h-56 overflow-auto">
                          {placeSuggestions.map((s, i) => (
                            <li key={i}>
                              <button
                                type="button"
                                onClick={() => onSelectPlace(s)}
                                className="w-full text-left px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                              >
                                {s.formattedAddress}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Button type="submit" disabled={isCreating || isUpdating} className="w-full bg-primary hover:bg-primary/90 text-lg py-6" size="lg">
                      <BookOpen className="h-5 w-5 mr-2" />
                      {isCreating || isUpdating ? 'Saving...' : 'Get free kundli'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full mt-2 text-gray-600 hover:text-gray-900"
                      onClick={() => {
                        setShowSomeoneElseForm(false);
                        setEditingProfileId(null);
                        setName('');
                        setDateOfBirth(undefined);
                        setTimeOfBirth('');
                        setPlaceOfBirth('');
                      }}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to profiles
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Select a profile</h3>
                  <p className="text-gray-600 -mt-2">Choose a saved profile or add someone else, then get your kundli.</p>
                  {isLoading ? (
                    <p className="text-gray-500 text-sm">Loading profiles...</p>
                  ) : (
                    <ul className="space-y-2">
                      {kundlis.map((k) => (
                        <li key={k.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedId(k.id)}
                            className={cn(
                              'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                              selectedId === k.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 bg-white'
                            )}
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{k.name}</p>
                              <p className="text-sm text-gray-500">
                                {k.dateOfBirth && `DOB: ${k.dateOfBirth}`}
                                {k.timeOfBirth && ` • ${k.timeOfBirth}`}
                                {k.placeOfBirth && ` • ${k.placeOfBirth}`}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <Label className="text-base font-medium">Get kundli for someone else</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowSomeoneElseForm(true);
                        setEditingProfileId(null);
                        setName(kundliForm.name || '');
                        setDateOfBirth(kundliForm.dateOfBirth || undefined);
                        setTimeOfBirth(kundliForm.timeOfBirth || '');
                        setPlaceOfBirth(kundliForm.placeOfBirth || '');
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Someone else
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <Button onClick={handleGetKundli} disabled={!selectedId || isStartingGeneration} className="w-full bg-primary hover:bg-primary/90 text-lg py-6" size="lg">
                      <BookOpen className="h-5 w-5 mr-2" />
                      {isStartingGeneration ? 'Starting…' : 'Get Kundli'}
                    </Button>
                    {!selectedId && (
                      <p className="text-sm text-gray-500 mt-2 text-center">Select a profile above or get kundli for someone else to continue.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">What you get</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Your kundli unlocks a range of astrological insights and reports.
          </p>
          <ul className="max-w-2xl mx-auto space-y-4">
            {whatYouGet.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-700 text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="h-9 w-9 text-primary" />
            Frequently asked questions
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Common questions about kundli and birth details.
          </p>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map(({ q, a }, i) => (
              <Card key={i} className="border border-gray-200 bg-white">
                <CardContent className="pt-6 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{q}</h3>
                  <p className="text-gray-600 leading-relaxed">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-primary/5 border-t border-primary/10">
        <div className="max-w-3xl mx-auto text-center">
          <Star className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to explore your chart?</h2>
          <p className="text-gray-600 mb-6">
            Scroll up to enter birth details or select a profile and get your kundli. Your first kundli is free.
          </p>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            size="lg"
          >
            <a href="#get-kundli">Go to Get your Kundli</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
