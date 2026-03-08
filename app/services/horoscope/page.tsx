'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetMyKundlisQuery,
  useCreateHoroscopeReportMutation,
  useLazyGetGeocodeQuery,
  useLazyGetGeocodeSuggestionsQuery,
  useLazyGetGeocodeTimezoneQuery,
} from '@/store/api/kundliApi';
import type { PlaceSuggestion, Kundli } from '@/store/api/kundliApi';
import { useAuth } from '@/store/hooks/useAuth';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { User, Sparkles, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Period = 'daily' | 'weekly' | 'monthly';

interface BirthForm {
  name: string;
  dob: string;
  time: string;
  placeOfBirth: string;
  placeId: string | null;
  selectedPlace: PlaceSuggestion | null;
  latitude: number | null;
  longitude: number | null;
  timezoneOffsetHours: number | null;
}

const initialForm: BirthForm = {
  name: '',
  dob: '',
  time: '',
  placeOfBirth: '',
  placeId: null,
  selectedPlace: null,
  latitude: null,
  longitude: null,
  timezoneOffsetHours: null,
};

function ManualBirthForm({
  form,
  setForm,
  period,
  setPeriod,
  suggestions,
  setSuggestions,
  isSubmitting,
  submitLabel,
}: {
  form: BirthForm;
  setForm: React.Dispatch<React.SetStateAction<BirthForm>>;
  period: Period;
  setPeriod: (p: Period) => void;
  suggestions: PlaceSuggestion[];
  setSuggestions: (s: PlaceSuggestion[]) => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="horoscope-name">Name</Label>
          <Input
            id="horoscope-name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horoscope-period-manual">Period</Label>
          <select
            id="horoscope-period-manual"
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Date of birth</Label>
        <DatePicker
          value={form.dob || undefined}
          onChange={(v) => setForm((f) => ({ ...f, dob: v ?? '' }))}
          placeholder="Select date"
          className="rounded-xl border-gray-200 bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="horoscope-time">Time of birth</Label>
        <Input
          id="horoscope-time"
          type="time"
          value={form.time}
          onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          className="rounded-xl border-gray-200 bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label>Place of birth</Label>
        <div className="relative">
          <Input
            value={form.placeOfBirth}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                placeOfBirth: e.target.value,
                selectedPlace: null,
                placeId: null,
              }))
            }
            placeholder="City, country"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg max-h-48 overflow-auto">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setSuggestions([]);
                    setForm((f) => ({
                      ...f,
                      placeOfBirth: (s.formattedAddress ?? '').trim(),
                      selectedPlace: s,
                      placeId: s.placeId,
                    }));
                  }}
                >
                  {s.formattedAddress}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </div>
  );
}

export default function HoroscopePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: kundlisData, isLoading: loadingKundlis } = useGetMyKundlisQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createHoroscopeReport, { isLoading: isSubmitting }] = useCreateHoroscopeReportMutation();
  const [getGeocode] = useLazyGetGeocodeQuery();
  const [getGeocodeSuggestions] = useLazyGetGeocodeSuggestionsQuery();
  const [getGeocodeTimezone] = useLazyGetGeocodeTimezoneQuery();

  const kundlis = kundlisData?.data ?? [];
  const hasProfiles = kundlis.length > 0;
  const [form, setForm] = useState<BirthForm>(initialForm);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [period, setPeriod] = useState<Period>('weekly');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  const [debouncedPlace, setDebouncedPlace] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedPlace(form.placeOfBirth?.trim() ?? ''), 400);
    return () => clearTimeout(t);
  }, [form.placeOfBirth]);

  useEffect(() => {
    const selectedAddress = (form.selectedPlace?.formattedAddress ?? '').trim();
    if (debouncedPlace && selectedAddress && debouncedPlace === selectedAddress) {
      setSuggestions([]);
      setPlaceLoading(false);
      return;
    }
    if (!debouncedPlace) {
      setSuggestions([]);
      setPlaceLoading(false);
      return;
    }
    let cancelled = false;
    setPlaceLoading(true);
    getGeocodeSuggestions({ place: debouncedPlace, limit: 8 })
      .unwrap()
      .then((res) => {
        if (!cancelled && res?.data) {
          const normalized = res.data.map(
            (item: {
              placeId?: string;
              place_id?: string;
              formattedAddress?: string;
              formatted_address?: string;
            }) => ({
              placeId: (item.placeId ?? item.place_id ?? '').trim(),
              formattedAddress: (item.formattedAddress ?? item.formatted_address ?? '').trim(),
            }),
          ).filter((item) => item.placeId && item.formattedAddress);
          setSuggestions(normalized);
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setPlaceLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedPlace, form.selectedPlace?.formattedAddress, getGeocodeSuggestions]);

  const handleBackToProfiles = () => {
    setShowManualForm(false);
    setForm(initialForm);
    setSelectedProfileId(null);
  };

  const resolveLatLngTz = async (): Promise<{ lat: number; lng: number; tz: number }> => {
    const p = form;
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
        throw new Error('Could not find location for the given place.');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const profile = selectedProfileId != null ? kundlis.find((k) => k.id === selectedProfileId) : null;
    const dob = profile?.dateOfBirth ?? form.dob;
    const time = profile?.timeOfBirth ?? form.time;
    if (!dob?.trim() || !time?.trim()) {
      toast.error('Date and time of birth are required.');
      return;
    }
    const name = (profile?.name ?? form.name)?.trim();
    if (!name) {
      toast.error('Name is required.');
      return;
    }
    if (
      !profile &&
      !form.placeOfBirth?.trim() &&
      (form.latitude == null || form.longitude == null)
    ) {
      toast.error('Place of birth or location is required.');
      return;
    }

    try {
      let lat: number;
      let lng: number;
      let tz: number;
      if (profile && profile.latitude != null && profile.longitude != null) {
        lat = profile.latitude;
        lng = profile.longitude;
        tz = profile.timezoneOffsetHours ?? 5.5;
      } else {
        const resolved = await resolveLatLngTz();
        lat = resolved.lat;
        lng = resolved.lng;
        tz = resolved.tz;
      }
      const res = await createHoroscopeReport({
        dob: dob.trim(),
        time: time.trim(),
        latitude: lat,
        longitude: lng,
        timezoneOffsetHours: tz,
        name,
        placeOfBirth: (profile?.placeOfBirth ?? form.placeOfBirth?.trim()) || undefined,
        period,
      }).unwrap();
      const uuid = res?.data?.uuid;
      if (uuid) {
        toast.success('Horoscope report started. We’ll email you when it’s ready.');
        router.push(`/services/horoscope/result/${uuid}`);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start horoscope report.';
      toast.error(message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary-light text-primary-dark relative py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 flex items-center justify-center gap-4">
            <Sparkles className="h-12 w-12 md:h-14 md:w-14 text-primary" />
            Horoscope
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-gray-700 mb-4">
            Get your personalized Vedic horoscope—daily, weekly, or monthly—based on your birth chart.
          </p>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Use a saved kundli profile or enter birth details. We’ll generate a structured report and email you when it’s ready.
          </p>
        </div>
      </section>

      <section id="get-horoscope" className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">
            Get your horoscope
          </h2>
          <p className="text-lg text-gray-600 text-center mb-10">
            Enter birth details or choose a saved profile below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loading profiles (no profiles yet) */}
            {!hasProfiles && loadingKundlis && (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="pt-8 pb-8 text-center text-gray-500">
                  Loading…
                </CardContent>
              </Card>
            )}

            {/* No profiles: manual form only (like kundli first-time) */}
            {!hasProfiles && !loadingKundlis && (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Enter your birth details
                  </h3>
                  <p className="text-gray-600 -mt-2">
                    Create your first profile and get a personalized horoscope.
                  </p>
                  <ManualBirthForm
                    form={form}
                    setForm={setForm}
                    period={period}
                    setPeriod={setPeriod}
                    suggestions={suggestions}
                    setSuggestions={setSuggestions}
                    isSubmitting={isSubmitting}
                    submitLabel="Get my horoscope"
                  />
                </CardContent>
              </Card>
            )}

            {/* Has profiles + "Enter details manually" chosen: manual form with Back */}
            {hasProfiles && showManualForm && (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Enter birth details
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleBackToProfiles}
                    >
                      Back to profiles
                    </Button>
                  </div>
                  <p className="text-gray-600 -mt-2">
                    Enter birth details to get a horoscope without using a saved profile.
                  </p>
                  <ManualBirthForm
                    form={form}
                    setForm={setForm}
                    period={period}
                    setPeriod={setPeriod}
                    suggestions={suggestions}
                    setSuggestions={setSuggestions}
                    isSubmitting={isSubmitting}
                    submitLabel={isSubmitting ? 'Creating report…' : 'Get my horoscope'}
                  />
                </CardContent>
              </Card>
            )}

            {/* Has profiles + profile select view (like GetKundliSection) */}
            {hasProfiles && !showManualForm && (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Select a profile</h3>
                  <p className="text-gray-600 -mt-2">
                    Choose a saved profile or enter birth details manually, then select period and
                    get your horoscope.
                  </p>
                  {loadingKundlis ? (
                    <p className="text-gray-500 text-sm">Loading profiles…</p>
                  ) : (
                    <ul className="space-y-2">
                      {kundlis.map((k) => (
                        <li key={k.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedProfileId(k.id)}
                            className={cn(
                              'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                              selectedProfileId === k.id
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-primary/50 bg-white',
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
                    <Label className="text-base font-medium">Enter birth details manually</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowManualForm(true);
                        setSelectedProfileId(null);
                        setForm(initialForm);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Enter details
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="horoscope-period">Horoscope period</Label>
                      <select
                        id="horoscope-period"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as Period)}
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <Button
                      type="submit"
                      disabled={!selectedProfileId || isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                      size="lg"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      {isSubmitting ? 'Creating report…' : 'Get my horoscope'}
                    </Button>
                    {!selectedProfileId && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Select a profile above or enter birth details manually to continue.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
