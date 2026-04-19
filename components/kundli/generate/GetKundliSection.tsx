'use client';

import { RefObject } from 'react';
import type { PlaceSuggestion } from '@/store/api/kundliApi';
import type { Kundli } from '@/store/api/kundliApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, User } from 'lucide-react';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { cn } from '@/lib/utils';
import { BirthDetailsForm } from './BirthDetailsForm';

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
  kundliFormPrefill: { name?: string; dateOfBirth?: string; timeOfBirth?: string; placeOfBirth?: string };
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
  kundliFormPrefill,
  onBackSomeoneElse,
}: GetKundliSectionProps) {
  if (!hasProfiles && !isLoading) {
    return (
      <BirthDetailsForm
        title="Create your first kundli profile"
        subtitle="Enter birth details below. You can add more profiles later."
        name={name}
        onNameChange={onNameChange}
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
        submitLabel="Get Kundli"
        priceLine={runPriceLine}
        onSubmit={onAddProfile}
        isSubmitting={isCreating}
      />
    );
  }

  if (hasProfiles && showSomeoneElseForm) {
    return (
      <BirthDetailsForm
        title="Get kundli for someone else"
        subtitle="Enter their birth details to create a new profile and get their kundli."
        name={name}
        onNameChange={onNameChange}
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
        submitLabel={isCreating || isUpdating ? 'Saving...' : 'Get kundli'}
        priceLine={runPriceLine}
        onSubmit={onAddProfile}
        isSubmitting={isCreating || isUpdating}
        nameId="someone-name"
        timeId="someone-time"
        placeId="someone-place"
        backLabel="Back to profiles"
        onBack={onBackSomeoneElse}
      />
    );
  }

  return (
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
                  onClick={() => onSelectProfile(k.id)}
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
              onShowSomeoneElseForm(true);
              onNameChange(kundliFormPrefill.name || '');
              onDateOfBirthChange(kundliFormPrefill.dateOfBirth || undefined);
              onTimeOfBirthChange(kundliFormPrefill.timeOfBirth || '');
              onPlaceOfBirthChange(kundliFormPrefill.placeOfBirth || '');
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Someone else
          </Button>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={onGetKundli}
            disabled={!selectedId || isStartingGeneration}
            className="w-full bg-primary hover:bg-primary/90 text-base py-2.5 h-auto"
          >
            <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
              <BookOpen className="h-4 w-4 mr-2 shrink-0" />
              {isStartingGeneration ? 'Starting…' : 'Get Kundli'}
              {!isStartingGeneration && generatePriceLine && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white whitespace-nowrap">
                    <CoinGlyph className="h-4 w-4 shrink-0" />
                    {generatePriceLine}
                  </span>
                </>
              )}
            </span>
          </Button>
          {!selectedId && (
            <p className="text-sm text-gray-500 mt-2 text-center">Select a profile above or get kundli for someone else to continue.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
