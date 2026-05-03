'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from "@/i18n/navigation";
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
import { parseFetchBaseError } from '@/lib/api-errors';
import { ServiceCostBanner } from '@/components/coins/ServiceCostBanner';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { useServiceRunPrice } from '@/hooks/useServiceRunPrice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { User, Sparkles, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Period = 'daily' | 'weekly' | 'monthly';
type DetailLevel = 'summary' | 'detailed';

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
  detailLevel,
  setDetailLevel,
  suggestions,
  setSuggestions,
  isSubmitting,
  submitLabel,
  priceLine,
}: {
  form: BirthForm;
  setForm: React.Dispatch<React.SetStateAction<BirthForm>>;
  period: Period;
  setPeriod: (p: Period) => void;
  detailLevel: DetailLevel;
  setDetailLevel: (v: DetailLevel) => void;
  suggestions: PlaceSuggestion[];
  setSuggestions: (s: PlaceSuggestion[]) => void;
  isSubmitting: boolean;
  submitLabel: string;
  priceLine?: string | null;
}) {
  const t = useTranslations('services.horoscope.manualForm');
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="horoscope-name">{t('name')}</Label>
          <Input
            id="horoscope-name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder={t('namePlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horoscope-period-manual">{t('period')}</Label>
          <select
            id="horoscope-period-manual"
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="daily">{t('daily')}</option>
            <option value="weekly">{t('weekly')}</option>
            <option value="monthly">{t('monthly')}</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="horoscope-detail-level-manual">{t('type')}</Label>
          <select
            id="horoscope-detail-level-manual"
            value={detailLevel}
            onChange={(e) => setDetailLevel(e.target.value as DetailLevel)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="summary">{t('summary')}</option>
            <option value="detailed">{t('detailed')}</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('dateOfBirth')}</Label>
        <DatePicker
          value={form.dob || undefined}
          onChange={(v) => setForm((f) => ({ ...f, dob: v ?? '' }))}
          placeholder={t('selectDate')}
          className="rounded-xl border-gray-200 bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="horoscope-time">{t('timeOfBirth')}</Label>
        <Input
          id="horoscope-time"
          type="time"
          value={form.time}
          onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          className="rounded-xl border-gray-200 bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('placeOfBirth')}</Label>
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
            placeholder={t('placePlaceholder')}
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
      <Button
        type="submit"
        className="w-full h-auto min-h-11 py-3"
        size="lg"
        disabled={isSubmitting}
      >
        <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-white text-sm font-medium">
          <span className="text-white">{submitLabel}</span>
        {!isSubmitting && priceLine && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-white whitespace-nowrap">
                <CoinGlyph className="h-4 w-4 shrink-0" />
                {priceLine}
              </span>
            </>
        )}
        </span>
      </Button>
    </div>
  );
}

export default function HoroscopePage() {
  const th = useTranslations('services.horoscope');
  const te = useTranslations('services.errors');
  const tCommon = useTranslations('services.common');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { compactLabel: summaryPriceLine } = useServiceRunPrice('horoscope');
  const { compactLabel: detailedPriceLine } = useServiceRunPrice('horoscope_detailed');
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
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('summary');
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
        throw new Error(te('locationResolveHoroscope'));
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
      toast.error(te('dateTimeRequiredSentence'));
      return;
    }
    const name = (profile?.name ?? form.name)?.trim();
    if (!name) {
      toast.error(te('nameRequiredSentence'));
      return;
    }
    if (
      !profile &&
      !form.placeOfBirth?.trim() &&
      (form.latitude == null || form.longitude == null)
    ) {
      toast.error(te('placeOrCoords'));
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
        detailLevel,
      }).unwrap();
      const uuid = res?.data?.uuid;
      if (uuid) {
        toast.success(te('horoscopeStarted'));
        router.push(`/services/horoscope/result/${uuid}`);
      } else {
        toast.error(te('generic'));
      }
    } catch (err) {
      const fe = parseFetchBaseError(err);
      if (fe.status === 402 || fe.code === 'INSUFFICIENT_COINS') {
        toast.error(fe.message ?? te('insufficientCoins'));
        router.push('/pricing');
        return;
      }
      if (fe.status === 409 || fe.code === 'DUPLICATE_CHART_DETAILS') {
        toast.error(
          fe.message ?? te('duplicateChart'),
        );
        return;
      }
      const message = err instanceof Error ? err.message : te('failedHoroscope');
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
            {th('title')}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-gray-700 mb-4">
            {th('heroSubtitle')}
          </p>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            {th('heroSubtitle2')}
          </p>
        </div>
      </section>

      <section id="get-horoscope" className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">
            {th('sectionTitle')}
          </h2>
          <p className="text-lg text-gray-600 text-center mb-10">
            {th('sectionSubtitle')}
          </p>
          <ServiceCostBanner serviceKey={detailLevel === 'detailed' ? 'horoscope_detailed' : 'horoscope'} className="mb-8" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loading profiles (no profiles yet) */}
            {!hasProfiles && loadingKundlis && (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="pt-8 pb-8 text-center text-gray-500">
                  {th('loadingCard')}
                </CardContent>
              </Card>
            )}

            {/* No profiles: manual form only (like kundli first-time) */}
            {!hasProfiles && !loadingKundlis && (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {th('noProfilesTitle')}
                  </h3>
                  <p className="text-gray-600 -mt-2">
                    {th('noProfilesSubtitle')}
                  </p>
                  <ManualBirthForm
                    form={form}
                    setForm={setForm}
                    period={period}
                    setPeriod={setPeriod}
                    detailLevel={detailLevel}
                    setDetailLevel={setDetailLevel}
                    suggestions={suggestions}
                    setSuggestions={setSuggestions}
                    isSubmitting={isSubmitting}
                    submitLabel={th('submitGetHoroscope')}
                    priceLine={detailLevel === 'detailed' ? detailedPriceLine : summaryPriceLine}
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
                      {th('manualTitle')}
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleBackToProfiles}
                    >
                      {th('backToProfiles')}
                    </Button>
                  </div>
                  <p className="text-gray-600 -mt-2">
                    {th('manualSubtitle')}
                  </p>
                  <ManualBirthForm
                    form={form}
                    setForm={setForm}
                    period={period}
                    setPeriod={setPeriod}
                    detailLevel={detailLevel}
                    setDetailLevel={setDetailLevel}
                    suggestions={suggestions}
                    setSuggestions={setSuggestions}
                    isSubmitting={isSubmitting}
                    submitLabel={isSubmitting ? th('creatingReport') : th('submitGetHoroscope')}
                    priceLine={detailLevel === 'detailed' ? detailedPriceLine : summaryPriceLine}
                  />
                </CardContent>
              </Card>
            )}

            {/* Has profiles + profile select view (like GetKundliSection) */}
            {hasProfiles && !showManualForm && (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">{th('selectProfileTitle')}</h3>
                  <p className="text-gray-600 -mt-2">
                    {th('selectProfileSubtitle')}
                  </p>
                  {loadingKundlis ? (
                    <p className="text-gray-500 text-sm">{tCommon('loadingProfiles')}</p>
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
                                {k.dateOfBirth && `${tCommon('dobPrefix')} ${k.dateOfBirth}`}
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
                    <Label className="text-base font-medium">{th('enterManuallyLabel')}</Label>
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
                      {th('enterDetails')}
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="horoscope-period">{th('periodLabel')}</Label>
                      <select
                        id="horoscope-period"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as Period)}
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="daily">{th('manualForm.daily')}</option>
                        <option value="weekly">{th('manualForm.weekly')}</option>
                        <option value="monthly">{th('manualForm.monthly')}</option>
                      </select>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="horoscope-detail-level">{th('typeLabel')}</Label>
                      <select
                        id="horoscope-detail-level"
                        value={detailLevel}
                        onChange={(e) => setDetailLevel(e.target.value as DetailLevel)}
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="summary">{th('manualForm.summary')}</option>
                        <option value="detailed">{th('manualForm.detailed')}</option>
                      </select>
                    </div>
                    <Button
                      type="submit"
                      disabled={!selectedProfileId || isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 h-auto min-h-11 py-3"
                      size="lg"
                    >
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-white text-sm font-medium">
                        <Sparkles className="h-5 w-5 mr-2" />
                        <span className="text-white">{isSubmitting ? th('creatingReport') : th('submitGetHoroscope')}</span>
                        {!isSubmitting && (detailLevel === 'detailed' ? detailedPriceLine : summaryPriceLine) && (
                          <>
                            <span aria-hidden>·</span>
                            <span className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-white whitespace-nowrap">
                              <CoinGlyph className="h-4 w-4 shrink-0" />
                              {detailLevel === 'detailed' ? detailedPriceLine : summaryPriceLine}
                            </span>
                          </>
                        )}
                      </span>
                    </Button>
                    {!selectedProfileId && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        {th('hintSelectProfile')}
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
