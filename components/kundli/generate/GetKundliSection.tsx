'use client';

import { RefObject } from 'react';
import { useTranslations } from 'next-intl';
import type { PlaceSuggestion } from '@/store/api/kundliApi';
import type { Kundli } from '@/store/api/kundliApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, User } from 'lucide-react';
import { ServicePriceDisplay } from '@/components/coins/ServicePriceDisplay';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { cn } from '@/lib/utils';
import {
  serviceFormCardClassName,
  serviceFormCardContentClassName,
  serviceProfileButtonClassName,
  serviceProfileIconClassName,
  serviceProfileListButtonClassName,
  ServiceProfileMeta,
} from '@/components/services';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { BirthDetailsForm } from './BirthDetailsForm';
import { FadeIn } from '@/components/motion/FadeIn';
import { HoverLift } from '@/components/motion/HoverLift';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

export interface GetKundliSectionProps {
  hasProfiles: boolean;
  isLoading: boolean;
  kundlis: Kundli[];
  selectedId: number | null;
  onSelectProfile: (id: number) => void;
  showSomeoneElseForm: boolean;
  onShowSomeoneElseForm: (show: boolean) => void;
  /** Form state for "first profile" or "someone else" */
  name: string;
  onNameChange: (value: string) => void;
  gender: 'Male' | 'Female';
  onGenderChange: (value: 'Male' | 'Female') => void;
  dateOfBirth: string | undefined;
  onDateOfBirthChange: (value: string | undefined) => void;
  timeOfBirth: string;
  onTimeOfBirthChange: (value: string) => void;
  placeOfBirth: string;
  onPlaceOfBirthChange: (value: string) => void;
  placeSuggestions: PlaceSuggestion[];
  placeSearchLoading: boolean;
  onSelectPlace: (suggestion: PlaceSuggestion) => void;
  placeInputRef: RefObject<HTMLDivElement | null>;
  onAddProfile: (e: React.FormEvent) => void;
  isCreating: boolean;
  isUpdating: boolean;
  onGetKundli: () => void;
  isStartingGeneration: boolean;
  /** Shown under the main CTA, e.g. "12 coins · ₹12" */
  generatePriceLine?: string | null;
  /** Same line on profile creation / someone-else forms when generation will charge coins */
  runPriceLine?: string | null;
  kundliServicePrice?: { coinCost: number; isFree: boolean; compactLabel: string } | null;
  kundliFormPrefill: { name?: string; dateOfBirth?: string; timeOfBirth?: string; placeOfBirth?: string; gender?: 'Male' | 'Female' };
  onBackSomeoneElse?: () => void;
}

export function GetKundliSection({
  hasProfiles,
  isLoading,
  kundlis,
  selectedId,
  onSelectProfile,
  showSomeoneElseForm,
  onShowSomeoneElseForm,
  name,
  onNameChange,
  gender,
  onGenderChange,
  dateOfBirth,
  onDateOfBirthChange,
  timeOfBirth,
  onTimeOfBirthChange,
  placeOfBirth,
  onPlaceOfBirthChange,
  placeSuggestions,
  placeSearchLoading,
  onSelectPlace,
  placeInputRef,
  onAddProfile,
  isCreating,
  isUpdating,
  onGetKundli,
  isStartingGeneration,
  generatePriceLine,
  runPriceLine,
  kundliServicePrice,
  kundliFormPrefill,
  onBackSomeoneElse,
}: GetKundliSectionProps) {
  const t = useTranslations('services.kundli.getSection');
  const tCommon = useTranslations('services.common');
  if (!hasProfiles && !isLoading) {
    return (
      <BirthDetailsForm
        title={t('firstProfileTitle')}
        subtitle={t('firstProfileSubtitle')}
        name={name}
        onNameChange={onNameChange}
        gender={gender}
        onGenderChange={onGenderChange}
        dateOfBirth={dateOfBirth}
        onDateOfBirthChange={onDateOfBirthChange}
        timeOfBirth={timeOfBirth}
        onTimeOfBirthChange={onTimeOfBirthChange}
        placeOfBirth={placeOfBirth}
        onPlaceOfBirthChange={onPlaceOfBirthChange}
        placeSuggestions={placeSuggestions}
        placeSearchLoading={placeSearchLoading}
        onSelectPlace={onSelectPlace}
        placeInputRef={placeInputRef}
        submitLabel={t('submitGetKundli')}
        priceLine={runPriceLine}
        servicePrice={kundliServicePrice}
        onSubmit={onAddProfile}
        isSubmitting={isCreating}
      />
    );
  }

  if (hasProfiles && showSomeoneElseForm) {
    return (
      <BirthDetailsForm
        title={t('someoneElseTitle')}
        subtitle={t('someoneElseSubtitle')}
        name={name}
        onNameChange={onNameChange}
        gender={gender}
        onGenderChange={onGenderChange}
        dateOfBirth={dateOfBirth}
        onDateOfBirthChange={onDateOfBirthChange}
        timeOfBirth={timeOfBirth}
        onTimeOfBirthChange={onTimeOfBirthChange}
        placeOfBirth={placeOfBirth}
        onPlaceOfBirthChange={onPlaceOfBirthChange}
        placeSuggestions={placeSuggestions}
        placeSearchLoading={placeSearchLoading}
        onSelectPlace={onSelectPlace}
        placeInputRef={placeInputRef}
        submitLabel={isCreating || isUpdating ? t('submitSaving') : t('submitGetKundliLower')}
        priceLine={runPriceLine}
        servicePrice={kundliServicePrice}
        onSubmit={onAddProfile}
        isSubmitting={isCreating || isUpdating}
        nameId="someone-name"
        timeId="someone-time"
        placeId="someone-place"
        backLabel={t('backToProfiles')}
        onBack={onBackSomeoneElse}
      />
    );
  }

  return (
    <FadeIn preset="scaleIn" inView>
      <Card className={serviceFormCardClassName}>
        <CardContent className={serviceFormCardContentClassName}>
          <h3 className="text-lg font-extrabold text-gray-900 sm:text-xl">{t('selectTitle')}</h3>
          <p className="-mt-2 text-sm text-gray-600 sm:text-base">{t('selectSubtitle')}</p>
          {isLoading ? (
            <p className="text-gray-500 text-sm">{tCommon('loadingProfiles')}</p>
          ) : (
            <Stagger>
              <ul className="space-y-2">
                {kundlis.map((k) => (
                  <StaggerItem key={k.id}>
                    <HoverLift>
                      <button
                        type="button"
                        onClick={() => onSelectProfile(k.id)}
                        className={cn(
                          serviceProfileListButtonClassName,
                          serviceProfileButtonClassName(selectedId === k.id),
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                            serviceProfileIconClassName(selectedId === k.id),
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
                    </HoverLift>
                  </StaggerItem>
                ))}
              </ul>
            </Stagger>
          )}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <Label className="text-sm font-medium sm:text-base">{t('someoneElseLabel')}</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 w-full sm:w-auto"
            onClick={() => {
              onShowSomeoneElseForm(true);
              onNameChange(kundliFormPrefill.name || '');
              onGenderChange(kundliFormPrefill.gender ?? 'Male');
              onDateOfBirthChange(kundliFormPrefill.dateOfBirth || undefined);
              onTimeOfBirthChange(kundliFormPrefill.timeOfBirth || '');
              onPlaceOfBirthChange(kundliFormPrefill.placeOfBirth || '');
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('someoneElseButton')}
          </Button>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <CosmicButton
            onClick={onGetKundli}
            disabled={!selectedId || isStartingGeneration}
            variant="primary"
            className="h-auto min-h-11 w-full rounded-full py-3 text-base"
          >
            <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
              <BookOpen className="mr-2 h-4 w-4 shrink-0" />
              {isStartingGeneration ? t('ctaStarting') : t('ctaGetKundli')}
              {!isStartingGeneration && (kundliServicePrice || generatePriceLine) && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white sm:text-sm">
                    {kundliServicePrice ? (
                      <ServicePriceDisplay
                        coinCost={kundliServicePrice.coinCost}
                        isFree={kundliServicePrice.isFree}
                        compactLabel={kundliServicePrice.compactLabel}
                        glyphClassName="text-white"
                      />
                    ) : (
                      <>
                        <CoinGlyph className="h-4 w-4 shrink-0" />
                        {generatePriceLine}
                      </>
                    )}
                  </span>
                </>
              )}
            </span>
          </CosmicButton>
          {!selectedId && (
            <p className="mt-2 text-center text-sm text-gray-500">{t('hintSelect')}</p>
          )}
        </div>
      </CardContent>
    </Card>
    </FadeIn>
  );
}
