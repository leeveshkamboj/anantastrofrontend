'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
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
import {
  HoroscopeHero,
  WhatIsHoroscope,
  HoroscopeHowItWorks,
  HoroscopeWhyDetailsMatter,
  HoroscopeWhatYouGet,
  HoroscopeFaq,
  HoroscopeFinalCta,
} from '@/components/horoscope';
import {
  ServiceFormSection,
  ServiceProfileMeta,
  serviceFormCardClassName,
  serviceFormCardContentClassName,
  serviceCostBannerClassName,
  serviceProfileButtonClassName,
  serviceProfileIconClassName,
  serviceProfileListButtonClassName,
} from '@/components/services';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { BirthGenderSelect, type BirthGender } from '@/components/kundli/BirthGenderSelect';
import { User, Sparkles, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type Period = 'daily' | 'weekly' | 'monthly';
type DetailLevel = 'summary' | 'detailed';

interface BirthForm {
  name: string;
  gender: BirthGender;
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
  gender: 'Male',
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
      <BirthGenderSelect
        id="horoscope-gender"
        value={form.gender}
        onChange={(gender) => setForm((f) => ({ ...f, gender }))}
        translationNamespace="services.horoscope.manualForm"
      />
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
        variant="gradient"
        className="h-auto min-h-11 w-full rounded-full py-3"
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
  const navLocale = useLocale();
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
  const [isStartingFlow, setIsStartingFlow] = useState(false);

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
        const tzRes = await getGeocodeTimezone({
          lat,
          lng,
          dob: p.dob?.trim() || undefined,
          time: p.time?.trim() || undefined,
        }).unwrap();
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
      setIsStartingFlow(true);
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
        reportLocale: navLocale,
        ...(navLocale === 'hi' && { reportLanguageStyle: 'simple' as const }),
      }).unwrap();
      const uuid = res?.data?.uuid;
      if (uuid) {
        toast.success(te('horoscopeStarted'));
        router.push(`/services/horoscope/result/${uuid}?journey=1`);
        return;
      }
      toast.error(te('generic'));
      setIsStartingFlow(false);
    } catch (err) {
      setIsStartingFlow(false);
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
    <div className="overflow-x-hidden">
      <HoroscopeHero />

      <ServiceFormSection
        id="get-horoscope"
        title={th('sectionTitle')}
        subtitle={th('sectionSubtitle')}
      >
        <ServiceCostBanner
          serviceKey={detailLevel === 'detailed' ? 'horoscope_detailed' : 'horoscope'}
          className={serviceCostBannerClassName}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loading profiles (no profiles yet) */}
            {!hasProfiles && loadingKundlis && (
              <Card className={serviceFormCardClassName}>
                <CardContent className={cn(serviceFormCardContentClassName, 'text-center text-gray-500')}>
                  {th('loadingCard')}
                </CardContent>
              </Card>
            )}

            {/* No profiles: manual form only (like kundli first-time) */}
            {!hasProfiles && !loadingKundlis && (
              <Card className={serviceFormCardClassName}>
                <CardContent className={serviceFormCardContentClassName}>
                  <h3 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                    {th('noProfilesTitle')}
                  </h3>
                  <p className="-mt-2 text-sm text-gray-600 sm:text-base">
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
              <Card className={serviceFormCardClassName}>
                <CardContent className={serviceFormCardContentClassName}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                      {th('manualTitle')}
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 w-full sm:w-auto"
                      onClick={handleBackToProfiles}
                    >
                      {th('backToProfiles')}
                    </Button>
                  </div>
                  <p className="-mt-2 text-sm text-gray-600 sm:text-base">
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
              <Card className={serviceFormCardClassName}>
                <CardContent className={serviceFormCardContentClassName}>
                  <h3 className="text-lg font-extrabold text-gray-900 sm:text-xl">{th('selectProfileTitle')}</h3>
                  <p className="-mt-2 text-sm text-gray-600 sm:text-base">
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
                              serviceProfileListButtonClassName,
                              serviceProfileButtonClassName(selectedProfileId === k.id),
                            )}
                          >
                            <div
                              className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                                serviceProfileIconClassName(selectedProfileId === k.id),
                              )}
                            >
                              <User className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900">{k.name}</p>
                              <ServiceProfileMeta
                                dateOfBirth={k.dateOfBirth}
                                timeOfBirth={k.timeOfBirth}
                                placeOfBirth={k.placeOfBirth}
                                dobPrefix={tCommon('dobPrefix')}
                              />
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <Label className="text-sm font-medium sm:text-base">{th('enterManuallyLabel')}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 w-full sm:w-auto"
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
                    <CosmicButton
                      type="submit"
                      disabled={!selectedProfileId || isSubmitting}
                      variant="primary"
                      className="h-auto min-h-11 w-full rounded-full py-3"
                      size="lg"
                    >
                      <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-sm font-medium text-white">
                        <Sparkles className="mr-2 h-5 w-5 shrink-0" />
                        <span>{isSubmitting ? th('creatingReport') : th('submitGetHoroscope')}</span>
                        {!isSubmitting && (detailLevel === 'detailed' ? detailedPriceLine : summaryPriceLine) && (
                          <>
                            <span aria-hidden>·</span>
                            <span className="inline-flex items-center justify-center gap-1.5 font-medium text-white">
                              <CoinGlyph className="h-4 w-4 shrink-0" />
                              {detailLevel === 'detailed' ? detailedPriceLine : summaryPriceLine}
                            </span>
                          </>
                        )}
                      </span>
                    </CosmicButton>
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
      </ServiceFormSection>

      <WhatIsHoroscope />
      <HoroscopeHowItWorks />
      <HoroscopeWhyDetailsMatter />
      <HoroscopeWhatYouGet />
      <HoroscopeFaq />
      <HoroscopeFinalCta />
      <AnimatePresence>
        {isStartingFlow ? (
          <motion.div
            key="horoscope-starting-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-70 flex items-center justify-center bg-astro-dark/60 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: 0.36 }}
              className="w-full max-w-md overflow-hidden rounded-4xl border border-white/70 bg-white text-center shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)]"
            >
              <div className="h-1 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple" aria-hidden="true" />
              <div className="p-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-astro-purple/15 bg-astro-yellow/20">
                  <Loader2 className="h-6 w-6 animate-spin text-astro-orange" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">{th('creatingReport')}</h3>
                <p className="mt-2 text-sm text-gray-600">{th('sectionSubtitle')}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
