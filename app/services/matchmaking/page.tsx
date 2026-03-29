'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetMyKundlisQuery,
  useCreateMatchmakingReportMutation,
  useLazyGetGeocodeQuery,
  useLazyGetGeocodeSuggestionsQuery,
  useLazyGetGeocodeTimezoneQuery,
} from '@/store/api/kundliApi';
import type { PlaceSuggestion } from '@/store/api/kundliApi';
import { useAuth } from '@/store/hooks/useAuth';
import { toast } from 'sonner';
import { parseFetchBaseError } from '@/lib/api-errors';
import { ServiceCostBanner } from '@/components/coins/ServiceCostBanner';
import {
  MatchmakingHero,
  WhatIsGunMilan,
  MatchmakingHowItWorks,
  MatchmakingWhyDetailsMatter,
  MatchmakingWhatYouGet,
  MatchmakingFaq,
  MatchmakingFinalCta,
  MatchmakingFormSection,
  initialPartner,
} from '@/components/matchmaking';
import type { PartnerForm } from '@/components/matchmaking';

export default function MatchmakingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: kundlisData, isLoading: loadingKundlis } = useGetMyKundlisQuery(undefined, { skip: !isAuthenticated });
  const [createMatchmakingReport, { isLoading: isComputing }] = useCreateMatchmakingReportMutation();
  const [getGeocode] = useLazyGetGeocodeQuery();
  const [getGeocodeSuggestions] = useLazyGetGeocodeSuggestionsQuery();
  const [getGeocodeTimezone] = useLazyGetGeocodeTimezoneQuery();

  const kundlis = kundlisData?.data ?? [];
  const [partner1, setPartner1] = useState<PartnerForm>(initialPartner);
  const [partner2, setPartner2] = useState<PartnerForm>(initialPartner);
  const [useProfile1, setUseProfile1] = useState<number | null>(null);
  const [useProfile2, setUseProfile2] = useState<number | null>(null);
  const [matchStep, setMatchStep] = useState<1 | 2 | 3>(1);

  const [suggestions1, setSuggestions1] = useState<PlaceSuggestion[]>([]);
  const [suggestions2, setSuggestions2] = useState<PlaceSuggestion[]>([]);
  const [placeLoading1, setPlaceLoading1] = useState(false);
  const [placeLoading2, setPlaceLoading2] = useState(false);
  const [debouncedPlace1, setDebouncedPlace1] = useState('');
  const [debouncedPlace2, setDebouncedPlace2] = useState('');
  const container1Ref = useRef<HTMLDivElement>(null);
  const container2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  // Default Partner 1 to first profile when profiles load
  const hasDefaultedProfile1 = useRef(false);
  useEffect(() => {
    if (loadingKundlis || kundlis.length === 0 || hasDefaultedProfile1.current) return;
    hasDefaultedProfile1.current = true;
    const first = kundlis[0];
    if (first?.id == null) return;
    setPartner1({
      name: first.name ?? '',
      dob: first.dateOfBirth ?? '',
      time: first.timeOfBirth ?? '',
      placeOfBirth: first.placeOfBirth ?? '',
      placeId: null,
      selectedPlace: null,
      latitude: first.latitude ?? null,
      longitude: first.longitude ?? null,
      timezoneOffsetHours: first.timezoneOffsetHours ?? null,
    });
    setUseProfile1(first.id);
  }, [loadingKundlis, kundlis]);

  // Default Partner 2 to second profile when profiles load (if at least 2)
  const hasDefaultedProfile2 = useRef(false);
  useEffect(() => {
    if (loadingKundlis || kundlis.length < 2 || hasDefaultedProfile2.current) return;
    hasDefaultedProfile2.current = true;
    const second = kundlis[1];
    if (second?.id == null) return;
    setPartner2({
      name: second.name ?? '',
      dob: second.dateOfBirth ?? '',
      time: second.timeOfBirth ?? '',
      placeOfBirth: second.placeOfBirth ?? '',
      placeId: null,
      selectedPlace: null,
      latitude: second.latitude ?? null,
      longitude: second.longitude ?? null,
      timezoneOffsetHours: second.timezoneOffsetHours ?? null,
    });
    setUseProfile2(second.id);
  }, [loadingKundlis, kundlis]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedPlace1(partner1.placeOfBirth?.trim() ?? ''), 400);
    return () => clearTimeout(t);
  }, [partner1.placeOfBirth]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedPlace2(partner2.placeOfBirth?.trim() ?? ''), 400);
    return () => clearTimeout(t);
  }, [partner2.placeOfBirth]);

  useEffect(() => {
    const selectedAddress = (partner1.selectedPlace?.formattedAddress ?? '').trim();
    if (debouncedPlace1 && selectedAddress && debouncedPlace1 === selectedAddress) {
      setSuggestions1([]);
      setPlaceLoading1(false);
      return;
    }
    if (!debouncedPlace1) {
      setSuggestions1([]);
      setPlaceLoading1(false);
      return;
    }
    let cancelled = false;
    setPlaceLoading1(true);
    getGeocodeSuggestions({ place: debouncedPlace1, limit: 8 })
      .unwrap()
      .then((res) => {
        if (!cancelled && res?.data) {
          const normalized = res.data.map((item: { placeId?: string; place_id?: string; formattedAddress?: string; formatted_address?: string }) => ({
            placeId: (item.placeId ?? item.place_id ?? '').trim(),
            formattedAddress: (item.formattedAddress ?? item.formatted_address ?? '').trim(),
          })).filter((item) => item.placeId && item.formattedAddress);
          setSuggestions1(normalized);
        }
      })
      .catch(() => { if (!cancelled) setSuggestions1([]); })
      .finally(() => { if (!cancelled) setPlaceLoading1(false); });
    return () => { cancelled = true; };
  }, [debouncedPlace1, partner1.selectedPlace?.formattedAddress, getGeocodeSuggestions]);

  useEffect(() => {
    const selectedAddress = (partner2.selectedPlace?.formattedAddress ?? '').trim();
    if (debouncedPlace2 && selectedAddress && debouncedPlace2 === selectedAddress) {
      setSuggestions2([]);
      setPlaceLoading2(false);
      return;
    }
    if (!debouncedPlace2) {
      setSuggestions2([]);
      setPlaceLoading2(false);
      return;
    }
    let cancelled = false;
    setPlaceLoading2(true);
    getGeocodeSuggestions({ place: debouncedPlace2, limit: 8 })
      .unwrap()
      .then((res) => {
        if (!cancelled && res?.data) {
          const normalized = res.data.map((item: { placeId?: string; place_id?: string; formattedAddress?: string; formatted_address?: string }) => ({
            placeId: (item.placeId ?? item.place_id ?? '').trim(),
            formattedAddress: (item.formattedAddress ?? item.formatted_address ?? '').trim(),
          })).filter((item) => item.placeId && item.formattedAddress);
          setSuggestions2(normalized);
        }
      })
      .catch(() => { if (!cancelled) setSuggestions2([]); })
      .finally(() => { if (!cancelled) setPlaceLoading2(false); });
    return () => { cancelled = true; };
  }, [debouncedPlace2, partner2.selectedPlace?.formattedAddress, getGeocodeSuggestions]);

  const onSelectPlace = (which: 1 | 2, suggestion: PlaceSuggestion) => {
    const address = (suggestion.formattedAddress ?? '').trim();
    if (which === 1) {
      setSuggestions1([]);
      setPartner1((p) => ({ ...p, placeOfBirth: address, selectedPlace: suggestion, placeId: suggestion.placeId }));
    } else {
      setSuggestions2([]);
      setPartner2((p) => ({ ...p, placeOfBirth: address, selectedPlace: suggestion, placeId: suggestion.placeId }));
    }
  };

  const fillFromProfile = (which: 1 | 2, kundliId: number) => {
    const profile = kundlis.find((k) => k.id === kundliId);
    if (!profile) return;
    const form: PartnerForm = {
      name: profile.name ?? '',
      dob: profile.dateOfBirth ?? '',
      time: profile.timeOfBirth ?? '',
      placeOfBirth: profile.placeOfBirth ?? '',
      placeId: null,
      selectedPlace: null,
      latitude: profile.latitude ?? null,
      longitude: profile.longitude ?? null,
      timezoneOffsetHours: profile.timezoneOffsetHours ?? null,
    };
    if (which === 1) {
      setPartner1(form);
      setUseProfile1(kundliId);
    } else {
      setPartner2(form);
      setUseProfile2(kundliId);
    }
  };

  const resolveLatLngTz = async (p: PartnerForm): Promise<{ lat: number; lng: number; tz: number }> => {
    let lat: number;
    let lng: number;
    if (p.latitude != null && p.longitude != null) {
      lat = p.latitude;
      lng = p.longitude;
    } else {
      const res = await getGeocode(p.placeOfBirth.trim()).unwrap();
      const d = res?.data;
      if (d?.lat != null && d?.lng != null) {
        lat = d.lat;
        lng = d.lng;
      } else {
        throw new Error(`Could not find location for ${p.placeOfBirth}`);
      }
    }
    let tz = 5.5;
    if (p.timezoneOffsetHours != null && !Number.isNaN(p.timezoneOffsetHours)) {
      tz = p.timezoneOffsetHours;
    } else {
      try {
        const tzRes = await getGeocodeTimezone({ lat, lng }).unwrap();
        if (tzRes?.data?.timezoneOffsetHours != null) tz = tzRes.data.timezoneOffsetHours;
      } catch {
        // keep 5.5
      }
    }
    return { lat, lng, tz };
  };

  const validatePartner1 = (): { valid: boolean; message?: string } => {
    if (useProfile1 != null) return { valid: true };
    if (!partner1.name?.trim()) return { valid: false, message: 'Partner 1: Name is required.' };
    if (!partner1.dob?.trim()) return { valid: false, message: 'Partner 1: Date of birth is required.' };
    if (!partner1.time?.trim()) return { valid: false, message: 'Partner 1: Time of birth is required.' };
    if (!partner1.placeOfBirth?.trim()) return { valid: false, message: 'Partner 1: Place of birth is required.' };
    return { valid: true };
  };

  const validatePartner2 = (): { valid: boolean; message?: string } => {
    if (useProfile2 != null) return { valid: true };
    if (!partner2.name?.trim()) return { valid: false, message: 'Partner 2: Name is required.' };
    if (!partner2.dob?.trim()) return { valid: false, message: 'Partner 2: Date of birth is required.' };
    if (!partner2.time?.trim()) return { valid: false, message: 'Partner 2: Time of birth is required.' };
    if (!partner2.placeOfBirth?.trim()) return { valid: false, message: 'Partner 2: Place of birth is required.' };
    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const p1 = useProfile1 != null ? kundlis.find((k) => k.id === useProfile1) : null;
    const p2 = useProfile2 != null ? kundlis.find((k) => k.id === useProfile2) : null;

    const getPartnerPayload = async (which: 1 | 2) => {
      const form = which === 1 ? partner1 : partner2;
      const prof = which === 1 ? p1 : p2;
      const dob = prof?.dateOfBirth ?? form.dob;
      const time = prof?.timeOfBirth ?? form.time;
      if (!dob || !time?.trim()) throw new Error(`Partner ${which}: date and time of birth are required.`);
      if (!form.placeOfBirth?.trim() && (form.latitude == null || form.longitude == null) && !prof) {
        throw new Error(`Partner ${which}: place of birth or coordinates are required.`);
      }
      const formToUse = prof
        ? { ...form, dob: prof.dateOfBirth ?? '', time: prof.timeOfBirth ?? '', latitude: prof.latitude, longitude: prof.longitude, timezoneOffsetHours: prof.timezoneOffsetHours }
        : form;
      const { lat, lng, tz } = await resolveLatLngTz(formToUse);
      const place = prof?.placeOfBirth ?? formToUse.placeOfBirth?.trim();
      return {
        dob,
        time: time.trim(),
        latitude: lat,
        longitude: lng,
        timezoneOffsetHours: tz,
        name: formToUse.name?.trim() || undefined,
        placeOfBirth: place || undefined,
      };
    };

    try {
      const [payload1, payload2] = await Promise.all([getPartnerPayload(1), getPartnerPayload(2)]);
      const res = await createMatchmakingReport({ partner1: payload1, partner2: payload2 }).unwrap();
      const uuid = res?.data?.uuid;
      if (uuid) {
        toast.success('Matchmaking report started. We’ll email you when it’s ready.');
        router.push(`/services/matchmaking/result/${uuid}`);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (err) {
      const fe = parseFetchBaseError(err);
      if (fe.status === 402 || fe.code === 'INSUFFICIENT_COINS') {
        toast.error(fe.message ?? 'Not enough coins. Purchase a pack to continue.');
        router.push('/pricing');
        return;
      }
      if (fe.status === 409 || fe.code === 'DUPLICATE_CHART_DETAILS') {
        toast.error(
          fe.message ??
            'Looks like you have already generated a chart with these details. Please log in to continue.',
        );
        return;
      }
      const message = err instanceof Error ? err.message : 'Failed to start matchmaking.';
      toast.error(message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white">
      <MatchmakingHero />
      <WhatIsGunMilan />
      <MatchmakingHowItWorks />
      <MatchmakingWhyDetailsMatter />
      <div className="max-w-3xl mx-auto px-4 -mt-4 mb-6">
        <ServiceCostBanner serviceKey="matchmaking" />
      </div>
      <MatchmakingFormSection
        matchStep={matchStep}
        setMatchStep={setMatchStep}
        kundlis={kundlis}
        loadingKundlis={loadingKundlis}
        partner1={partner1}
        setPartner1={setPartner1}
        partner2={partner2}
        setPartner2={setPartner2}
        useProfile1={useProfile1}
        setUseProfile1={setUseProfile1}
        useProfile2={useProfile2}
        setUseProfile2={setUseProfile2}
        fillFromProfile={fillFromProfile}
        container1Ref={container1Ref}
        container2Ref={container2Ref}
        suggestions1={suggestions1}
        suggestions2={suggestions2}
        placeLoading1={placeLoading1}
        placeLoading2={placeLoading2}
        onSelectPlace={onSelectPlace}
        validatePartner1={validatePartner1}
        validatePartner2={validatePartner2}
        onSubmit={handleSubmit}
        isComputing={isComputing}
      />
      <MatchmakingWhatYouGet />
      <MatchmakingFaq />
      <MatchmakingFinalCta />
    </div>
  );
}
