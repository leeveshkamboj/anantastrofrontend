'use client';

import { RefObject } from 'react';
import type { PlaceSuggestion } from '@/store/api/kundliApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { BookOpen, ArrowLeft } from 'lucide-react';

export interface BirthDetailsFormProps {
  title: string;
  subtitle?: string;
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
  submitLabel: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  backLabel?: string;
  onBack?: () => void;
  nameId?: string;
  timeId?: string;
  placeId?: string;
}

export function BirthDetailsForm({
  title,
  subtitle,
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
  submitLabel,
  onSubmit,
  isSubmitting = false,
  backLabel,
  onBack,
  nameId = 'name',
  timeId = 'time',
  placeId = 'place',
}: BirthDetailsFormProps) {
  return (
    <Card className="border-0 shadow-xl bg-white">
      <CardContent className="pt-8 pb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={nameId}>Name</Label>
            <Input
              id={nameId}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Full name"
              className="bg-gray-50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Date of birth</Label>
            <DatePicker
              value={dateOfBirth}
              onChange={onDateOfBirthChange}
              placeholder="Select date"
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={timeId}>Time of birth</Label>
            <Input
              id={timeId}
              type="time"
              value={timeOfBirth}
              onChange={(e) => onTimeOfBirthChange(e.target.value)}
              className="bg-gray-50"
            />
          </div>
          <div ref={placeInputRef} className="relative space-y-2">
            <Label htmlFor={placeId}>Place of birth</Label>
            <Input
              id={placeId}
              value={placeOfBirth}
              onChange={(e) => onPlaceOfBirthChange(e.target.value)}
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
            size="lg"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
          {backLabel && onBack && (
            <Button
              type="button"
              variant="ghost"
              className="w-full mt-2 text-gray-600 hover:text-gray-900"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
