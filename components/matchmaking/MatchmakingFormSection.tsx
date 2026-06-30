'use client';

import { RefObject } from 'react';
import { useTranslations } from 'next-intl';
import type { PlaceSuggestion } from '@/store/api/kundliApi';
import type { Kundli } from '@/store/api/kundliApi';
import type { MatchmakingResult as MatchmakingResultType } from '@/store/api/kundliApi';
import type { PartnerForm } from './types';
import { initialPartner, initialPartnerFemale } from './types';
import { BirthGenderSelect } from '@/components/kundli/BirthGenderSelect';
import {
  ServiceFormSection,
  ServiceProfileMeta,
  serviceFormCardClassName,
  serviceFormCardContentClassName,
  serviceBirthDetailsBoxClassName,
  serviceFormPrimaryButtonClassName,
  serviceProfileButtonClassName,
  serviceProfileIconClassName,
  serviceProfileListButtonClassName,
} from '@/components/services';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { Card, CardContent } from '@/components/ui/card';
import { MatchmakingResult } from './MatchmakingResult';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { Heart, User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServicePriceDisplay } from '@/components/coins/ServicePriceDisplay';
import { CoinGlyph } from '@/components/coins/CoinGlyph';

function PartnerReviewDetails({
  name,
  dob,
  time,
  placeOfBirth,
  fallbackName,
}: {
  name?: string;
  dob?: string;
  time?: string;
  placeOfBirth?: string;
  fallbackName: string;
}) {
  const hasDetails = Boolean(dob || time || placeOfBirth);

  return (
    <>
      <p className="font-medium text-gray-900">{name?.trim() || fallbackName}</p>
      {hasDetails ? (
        <div className="mt-2 space-y-1 text-sm text-gray-500">
          {dob ? <p>{dob}{time ? ` · ${time}` : ''}</p> : time ? <p>{time}</p> : null}
          {placeOfBirth ? <p className="wrap-break-word leading-snug">{placeOfBirth}</p> : null}
        </div>
      ) : (
        <p className="mt-1 text-sm text-gray-500">—</p>
      )}
    </>
  );
}

export interface MatchmakingFormSectionProps {
  matchStep: 1 | 2 | 3;
  setMatchStep: (step: 1 | 2 | 3) => void;
  kundlis: Kundli[];
  loadingKundlis: boolean;
  partner1: PartnerForm;
  setPartner1: React.Dispatch<React.SetStateAction<PartnerForm>>;
  partner2: PartnerForm;
  setPartner2: React.Dispatch<React.SetStateAction<PartnerForm>>;
  useProfile1: number | null;
  setUseProfile1: (id: number | null) => void;
  useProfile2: number | null;
  setUseProfile2: (id: number | null) => void;
  fillFromProfile: (which: 1 | 2, kundliId: number) => void;
  container1Ref: RefObject<HTMLDivElement | null>;
  container2Ref: RefObject<HTMLDivElement | null>;
  suggestions1: PlaceSuggestion[];
  suggestions2: PlaceSuggestion[];
  placeLoading1: boolean;
  placeLoading2: boolean;
  onSelectPlace: (which: 1 | 2, suggestion: PlaceSuggestion) => void;
  validatePartner1: () => { valid: boolean; message?: string };
  validatePartner2: () => { valid: boolean; message?: string };
  onSubmit: (e: React.FormEvent) => void;
  isComputing: boolean;
  /** Shown on the final CTA, e.g. "12 coins · ₹12" */
  submitPriceLine?: string | null;
  submitServicePrice?: { coinCost: number; isFree: boolean; compactLabel: string } | null;
  result?: MatchmakingResultType | null;
  costBanner?: React.ReactNode;
}

export function MatchmakingFormSection({
  matchStep,
  setMatchStep,
  kundlis,
  loadingKundlis,
  partner1,
  setPartner1,
  partner2,
  setPartner2,
  useProfile1,
  setUseProfile1,
  useProfile2,
  setUseProfile2,
  fillFromProfile,
  container1Ref,
  container2Ref,
  suggestions1,
  suggestions2,
  placeLoading1,
  placeLoading2,
  onSelectPlace,
  validatePartner1,
  validatePartner2,
  onSubmit,
  isComputing,
  submitPriceLine,
  submitServicePrice,
  result,
  costBanner,
}: MatchmakingFormSectionProps) {
  const tf = useTranslations('services.matchmaking.form');
  const tCommon = useTranslations('services.common');
  return (
    <ServiceFormSection
      id="get-matchmaking"
      title={matchStep === 1 ? tf('step1Title') : matchStep === 2 ? tf('step2Title') : tf('step3Title')}
      subtitle={
        matchStep === 1
          ? tf('step1Subtitle')
          : matchStep === 2
            ? tf('step1Subtitle')
            : tf('step3Subtitle')
      }
      narrow={false}
    >
      <div className="mx-auto max-w-5xl">
        {costBanner ? <div className="mb-6 sm:mb-8">{costBanner}</div> : null}

        <div className="mb-4 flex items-center justify-center gap-1.5 sm:mb-6 sm:gap-2">
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold sm:h-9 sm:w-9 sm:text-sm',
              matchStep === 1 ? 'bg-astro-orange text-white' : matchStep > 1 ? 'bg-astro-purple/20 text-astro-purple' : 'bg-gray-200 text-gray-500',
            )}
          >
            1
          </span>
          <span className="h-0.5 w-4 rounded bg-gray-200 sm:w-8" />
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold sm:h-9 sm:w-9 sm:text-sm',
              matchStep === 2 ? 'bg-astro-orange text-white' : matchStep > 2 ? 'bg-astro-purple/20 text-astro-purple' : 'bg-gray-200 text-gray-500',
            )}
          >
            2
          </span>
          <span className="h-0.5 w-4 rounded bg-gray-200 sm:w-8" />
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold sm:h-9 sm:w-9 sm:text-sm',
              matchStep === 3 ? 'bg-astro-orange text-white' : 'bg-gray-200 text-gray-500',
            )}
          >
            3
          </span>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
          {matchStep === 1 && (
            <Card className={serviceFormCardClassName}>
              <CardContent className={serviceFormCardContentClassName}>
                <p className="text-sm text-gray-600">{tf('introManual')}</p>
                {kundlis.length > 0 && !loadingKundlis ? (
                  <ul className="space-y-2">
                    {kundlis.map((k) => (
                      <li key={k.id}>
                        <button
                          type="button"
                          onClick={() => fillFromProfile(1, k.id)}
                          className={cn(
                            'flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-all sm:items-center sm:p-4',
                            useProfile1 === k.id ? serviceProfileButtonClassName(true) : serviceProfileButtonClassName(false),
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                              serviceProfileIconClassName(useProfile1 === k.id),
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
                    <li>
                      <button
                        type="button"
                        onClick={() => { setUseProfile1(null); setPartner1(initialPartner); }}
                        className={cn(
                          'flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-all sm:items-center sm:p-4',
                          useProfile1 === null
                            ? serviceProfileButtonClassName(true)
                            : 'border-2 border-dashed border-gray-300 bg-gray-50/50 hover:border-astro-orange/50 hover:bg-astro-orange/5',
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tf('enterBirthDetails')}</p>
                        </div>
                      </button>
                    </li>
                  </ul>
                ) : loadingKundlis ? (
                  <p className="text-gray-500 text-sm">{tf('loadingProfiles')}</p>
                ) : null}
                {(useProfile1 === null || (kundlis.length === 0 && !loadingKundlis)) && (
                  <div className={serviceBirthDetailsBoxClassName}>
                    <h3 className="text-sm font-semibold text-gray-900">{tf('birthDetailsHeading')}</h3>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{tf('name')}</Label>
                      <Input value={partner1.name} onChange={(e) => setPartner1((p) => ({ ...p, name: e.target.value }))} placeholder={tf('fullNamePlaceholder')} className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <BirthGenderSelect
                      id="matchmaking-partner1-gender"
                      value={partner1.gender}
                      onChange={(gender) => setPartner1((p) => ({ ...p, gender }))}
                      translationNamespace="services.matchmaking.form"
                      labelClassName="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    />
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{tf('dateOfBirth')}</Label>
                      <DatePicker value={partner1.dob || undefined} onChange={(v) => setPartner1((p) => ({ ...p, dob: v ?? '' }))} placeholder={tf('selectDate')} className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{tf('timeOfBirth')}</Label>
                      <Input type="time" value={partner1.time} onChange={(e) => setPartner1((p) => ({ ...p, time: e.target.value }))} className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <div ref={container1Ref} className="relative">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{tf('placeOfBirth')}</Label>
                      <Input value={partner1.placeOfBirth} onChange={(e) => setPartner1((p) => ({ ...p, placeOfBirth: e.target.value }))} placeholder={tf('placePlaceholder')} className="mt-1.5 rounded-xl border-gray-200 bg-white" autoComplete="off" />
                      {placeLoading1 && <p className="text-xs text-gray-500 mt-1">{tf('searching')}</p>}
                      {suggestions1.length > 0 && (
                        <ul className="absolute z-10 mt-0.5 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg max-h-48 overflow-auto">
                          {suggestions1.map((s, i) => (
                            <li key={i}>
                              <button type="button" onClick={() => onSelectPlace(1, s)} className="w-full text-left px-3 py-2.5 text-sm text-gray-800 hover:bg-astro-purple/5">{s.formattedAddress}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
                  <CosmicButton
                    type="button"
                    onClick={() => {
                      const { valid, message } = validatePartner1();
                      if (!valid) { toast.error(message); return; }
                      setMatchStep(2);
                    }}
                    variant="primary"
                    className={serviceFormPrimaryButtonClassName}
                  >
                    {tf('next')}
                  </CosmicButton>
                </div>
              </CardContent>
            </Card>
          )}

          {matchStep === 2 && (
            <Card className={serviceFormCardClassName}>
              <CardContent className={serviceFormCardContentClassName}>
                <div className="-mb-1 flex justify-center">
                  <button type="button" onClick={() => setMatchStep(1)} className="text-sm text-astro-purple hover:underline">{tf('backToPartner1')}</button>
                </div>
                <p className="text-sm text-gray-600">{tf('introManual')}</p>
                {kundlis.length > 0 && !loadingKundlis ? (
                  <ul className="space-y-2">
                    {kundlis.filter((k) => k.id !== useProfile1).map((k) => (
                      <li key={k.id}>
                        <button
                          type="button"
                          onClick={() => fillFromProfile(2, k.id)}
                          className={cn(
                            'flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-all sm:items-center sm:p-4',
                            useProfile2 === k.id ? serviceProfileButtonClassName(true) : serviceProfileButtonClassName(false),
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                              serviceProfileIconClassName(useProfile2 === k.id),
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
                    <li>
                      <button
                        type="button"
                        onClick={() => { setUseProfile2(null); setPartner2(initialPartnerFemale); }}
                        className={cn(
                          'flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-all sm:items-center sm:p-4',
                          useProfile2 === null
                            ? serviceProfileButtonClassName(true)
                            : 'border-2 border-dashed border-gray-300 bg-gray-50/50 hover:border-astro-orange/50 hover:bg-astro-orange/5',
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tf('enterBirthDetails')}</p>
                        </div>
                      </button>
                    </li>
                  </ul>
                ) : loadingKundlis ? (
                  <p className="text-gray-500 text-sm">{tf('loadingProfiles')}</p>
                ) : null}
                {(useProfile2 === null || (kundlis.filter((k) => k.id !== useProfile1).length === 0 && !loadingKundlis)) && (
                  <div className={serviceBirthDetailsBoxClassName}>
                    <h3 className="text-sm font-semibold text-gray-900">{tf('birthDetailsHeading')}</h3>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{tf('name')}</Label>
                      <Input value={partner2.name} onChange={(e) => setPartner2((p) => ({ ...p, name: e.target.value }))} placeholder={tf('fullNamePlaceholder')} className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <BirthGenderSelect
                      id="matchmaking-partner2-gender"
                      value={partner2.gender}
                      onChange={(gender) => setPartner2((p) => ({ ...p, gender }))}
                      translationNamespace="services.matchmaking.form"
                      labelClassName="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    />
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{tf('dateOfBirth')}</Label>
                      <DatePicker value={partner2.dob || undefined} onChange={(v) => setPartner2((p) => ({ ...p, dob: v ?? '' }))} placeholder={tf('selectDate')} className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{tf('timeOfBirth')}</Label>
                      <Input type="time" value={partner2.time} onChange={(e) => setPartner2((p) => ({ ...p, time: e.target.value }))} className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <div ref={container2Ref} className="relative">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{tf('placeOfBirth')}</Label>
                      <Input value={partner2.placeOfBirth} onChange={(e) => setPartner2((p) => ({ ...p, placeOfBirth: e.target.value }))} placeholder={tf('placePlaceholder')} className="mt-1.5 rounded-xl border-gray-200 bg-white" autoComplete="off" />
                      {placeLoading2 && <p className="text-xs text-gray-500 mt-1">{tf('searching')}</p>}
                      {suggestions2.length > 0 && (
                        <ul className="absolute z-10 mt-0.5 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg max-h-48 overflow-auto">
                          {suggestions2.map((s, i) => (
                            <li key={i}>
                              <button type="button" onClick={() => onSelectPlace(2, s)} className="w-full text-left px-3 py-2.5 text-sm text-gray-800 hover:bg-astro-purple/5">{s.formattedAddress}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="button" variant="outline" onClick={() => setMatchStep(1)} className="h-11 w-full rounded-xl sm:w-auto">{tf('back')}</Button>
                  <CosmicButton
                    type="button"
                    onClick={() => {
                      const { valid, message } = validatePartner2();
                      if (!valid) { toast.error(message); return; }
                      setMatchStep(3);
                    }}
                    variant="primary"
                    className={serviceFormPrimaryButtonClassName}
                  >
                    {tf('next')}
                  </CosmicButton>
                </div>
              </CardContent>
            </Card>
          )}

          {matchStep === 3 && (
            <>
              <div className="mb-2 flex justify-center sm:mb-4">
                <button type="button" onClick={() => setMatchStep(2)} className="text-sm text-astro-purple hover:underline">{tf('backToPartner2')}</button>
              </div>
              <Card className={cn(serviceFormCardClassName, 'overflow-hidden')}>
                <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_auto_1fr]">
                  <div className="border-gray-100 p-4 sm:p-6 lg:border-r lg:pr-8">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-astro-purple/15">
                        <User className="h-5 w-5 text-astro-purple" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{tf('partner1')}</h3>
                    </div>
                    <PartnerReviewDetails
                      name={partner1.name}
                      dob={partner1.dob}
                      time={partner1.time}
                      placeOfBirth={partner1.placeOfBirth}
                      fallbackName={tf('enterDetailsFallback')}
                    />
                  </div>
                  <div className="hidden flex-col items-center justify-center bg-gray-50/50 px-4 lg:flex">
                    <div className="rounded-full bg-astro-purple/10 p-3">
                      <Heart className="h-8 w-8 text-astro-purple" />
                    </div>
                    <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">{tf('match')}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 border-t border-gray-100 bg-gray-50/50 py-3 lg:hidden">
                    <Heart className="h-5 w-5 text-astro-purple" aria-hidden="true" />
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{tf('match')}</p>
                  </div>
                  <div className="border-t border-gray-100 p-4 sm:p-6 lg:border-t-0 lg:border-l lg:pl-8">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-astro-purple/15">
                        <User className="h-5 w-5 text-astro-purple" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{tf('partner2')}</h3>
                    </div>
                    <PartnerReviewDetails
                      name={partner2.name}
                      dob={partner2.dob}
                      time={partner2.time}
                      placeOfBirth={partner2.placeOfBirth}
                      fallbackName={tf('enterDetailsFallback')}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-stretch justify-between gap-4 border-t border-gray-100 bg-gray-50/50 px-4 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5">
                  <p className="text-center text-sm text-gray-500 sm:text-left">{tf('summaryNote')}</p>
                  <CosmicButton
                    type="submit"
                    disabled={isComputing}
                    variant="primary"
                    size="lg"
                    className="h-auto min-h-11 w-full rounded-full px-6 py-4 text-base font-semibold shadow-sm sm:min-w-[14rem] sm:w-auto sm:px-8 sm:py-5"
                  >
                    <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
                      {isComputing ? tf('calculating') : tf('seeCompatibility')}
                      {!isComputing && (submitServicePrice || submitPriceLine) && (
                        <>
                          <span aria-hidden>·</span>
                          <span className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-white">
                            {submitServicePrice ? (
                              <ServicePriceDisplay
                                coinCost={submitServicePrice.coinCost}
                                isFree={submitServicePrice.isFree}
                                compactLabel={submitServicePrice.compactLabel}
                                glyphClassName="text-white"
                              />
                            ) : (
                              <>
                                <CoinGlyph className="h-4 w-4 shrink-0" />
                                {submitPriceLine}
                              </>
                            )}
                          </span>
                        </>
                      )}
                      <ArrowRight className="h-5 w-5 shrink-0" />
                    </span>
                  </CosmicButton>
                </div>
              </Card>
            </>
          )}
        </form>
        {result && <MatchmakingResult result={result} />}
      </div>
    </ServiceFormSection>
  );
}
