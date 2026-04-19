'use client';

import { RefObject } from 'react';
import type { PlaceSuggestion } from '@/store/api/kundliApi';
import type { Kundli } from '@/store/api/kundliApi';
import type { MatchmakingResult as MatchmakingResultType } from '@/store/api/kundliApi';
import type { PartnerForm } from './types';
import { initialPartner } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { MatchmakingResult } from './MatchmakingResult';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { Heart, User, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CoinGlyph } from '@/components/coins/CoinGlyph';

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
  result?: MatchmakingResultType | null;
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
  result,
}: MatchmakingFormSectionProps) {
  return (
    <section id="get-matchmaking" className="py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold', matchStep === 1 ? 'bg-primary text-white' : matchStep > 1 ? 'bg-primary/20 text-primary' : 'bg-gray-200 text-gray-500')}>1</span>
          <span className="h-0.5 w-8 bg-gray-200 rounded" />
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold', matchStep === 2 ? 'bg-primary text-white' : matchStep > 2 ? 'bg-primary/20 text-primary' : 'bg-gray-200 text-gray-500')}>2</span>
          <span className="h-0.5 w-8 bg-gray-200 rounded" />
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold', matchStep === 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500')}>3</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">
          {matchStep === 1 ? 'Partner 1' : matchStep === 2 ? 'Partner 2' : 'Summary'}
        </h2>
        <p className="text-lg text-gray-600 text-center mb-10">
          {matchStep === 1
            ? 'Select a saved profile or enter birth details.'
            : matchStep === 2
              ? 'Select a saved profile or enter birth details.'
              : 'Review the selected details and get your matchmaking result.'}
        </p>

        <form onSubmit={onSubmit} className="space-y-8">
          {matchStep === 1 && (
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="pt-8 pb-8 space-y-6">
                <p className="text-gray-600 text-sm">Select a saved profile or enter birth details manually.</p>
                {kundlis.length > 0 && !loadingKundlis ? (
                  <ul className="space-y-2">
                    {kundlis.map((k) => (
                      <li key={k.id}>
                        <button
                          type="button"
                          onClick={() => fillFromProfile(1, k.id)}
                          className={cn(
                            'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                            useProfile1 === k.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 bg-white'
                          )}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
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
                    <li>
                      <button
                        type="button"
                        onClick={() => { setUseProfile1(null); setPartner1(initialPartner); }}
                        className={cn(
                          'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                          useProfile1 === null ? 'border-primary bg-primary/5' : 'border-dashed border-gray-300 bg-gray-50/50 hover:border-primary/50 hover:bg-primary/5'
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Enter birth details</p>
                        </div>
                      </button>
                    </li>
                  </ul>
                ) : loadingKundlis ? (
                  <p className="text-gray-500 text-sm">Loading profiles...</p>
                ) : null}
                {(useProfile1 === null || (kundlis.length === 0 && !loadingKundlis)) && (
                  <div className="rounded-xl border-2 border-gray-100 bg-gray-50/30 p-6 space-y-5">
                    <h3 className="text-sm font-semibold text-gray-900">Birth details</h3>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</Label>
                      <Input value={partner1.name} onChange={(e) => setPartner1((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date of birth</Label>
                      <DatePicker value={partner1.dob || undefined} onChange={(v) => setPartner1((p) => ({ ...p, dob: v ?? '' }))} placeholder="Select date" className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Time of birth</Label>
                      <Input type="time" value={partner1.time} onChange={(e) => setPartner1((p) => ({ ...p, time: e.target.value }))} className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <div ref={container1Ref} className="relative">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Place of birth</Label>
                      <Input value={partner1.placeOfBirth} onChange={(e) => setPartner1((p) => ({ ...p, placeOfBirth: e.target.value }))} placeholder="Search city or place" className="mt-1.5 rounded-xl border-gray-200 bg-white" autoComplete="off" />
                      {placeLoading1 && <p className="text-xs text-gray-500 mt-1">Searching…</p>}
                      {suggestions1.length > 0 && (
                        <ul className="absolute z-10 mt-0.5 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg max-h-48 overflow-auto">
                          {suggestions1.map((s, i) => (
                            <li key={i}>
                              <button type="button" onClick={() => onSelectPlace(1, s)} className="w-full text-left px-3 py-2.5 text-sm text-gray-800 hover:bg-primary/5">{s.formattedAddress}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-200 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      const { valid, message } = validatePartner1();
                      if (!valid) { toast.error(message); return; }
                      setMatchStep(2);
                    }}
                    className="bg-primary hover:bg-primary/90 px-8 py-6 text-base font-semibold rounded-xl"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {matchStep === 2 && (
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div className="flex justify-center mb-2">
                  <button type="button" onClick={() => setMatchStep(1)} className="text-sm text-primary hover:underline">← Back to Partner 1</button>
                </div>
                <p className="text-gray-600 text-sm">Select a saved profile or enter birth details manually.</p>
                {kundlis.length > 0 && !loadingKundlis ? (
                  <ul className="space-y-2">
                    {kundlis.filter((k) => k.id !== useProfile1).map((k) => (
                      <li key={k.id}>
                        <button
                          type="button"
                          onClick={() => fillFromProfile(2, k.id)}
                          className={cn(
                            'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                            useProfile2 === k.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 bg-white'
                          )}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
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
                    <li>
                      <button
                        type="button"
                        onClick={() => { setUseProfile2(null); setPartner2(initialPartner); }}
                        className={cn(
                          'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                          useProfile2 === null ? 'border-primary bg-primary/5' : 'border-dashed border-gray-300 bg-gray-50/50 hover:border-primary/50 hover:bg-primary/5'
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Enter birth details</p>
                        </div>
                      </button>
                    </li>
                  </ul>
                ) : loadingKundlis ? (
                  <p className="text-gray-500 text-sm">Loading profiles...</p>
                ) : null}
                {(useProfile2 === null || (kundlis.filter((k) => k.id !== useProfile1).length === 0 && !loadingKundlis)) && (
                  <div className="rounded-xl border-2 border-gray-100 bg-gray-50/30 p-6 space-y-5">
                    <h3 className="text-sm font-semibold text-gray-900">Birth details</h3>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</Label>
                      <Input value={partner2.name} onChange={(e) => setPartner2((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date of birth</Label>
                      <DatePicker value={partner2.dob || undefined} onChange={(v) => setPartner2((p) => ({ ...p, dob: v ?? '' }))} placeholder="Select date" className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Time of birth</Label>
                      <Input type="time" value={partner2.time} onChange={(e) => setPartner2((p) => ({ ...p, time: e.target.value }))} className="mt-1.5 rounded-xl border-gray-200 bg-white" />
                    </div>
                    <div ref={container2Ref} className="relative">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Place of birth</Label>
                      <Input value={partner2.placeOfBirth} onChange={(e) => setPartner2((p) => ({ ...p, placeOfBirth: e.target.value }))} placeholder="Search city or place" className="mt-1.5 rounded-xl border-gray-200 bg-white" autoComplete="off" />
                      {placeLoading2 && <p className="text-xs text-gray-500 mt-1">Searching…</p>}
                      {suggestions2.length > 0 && (
                        <ul className="absolute z-10 mt-0.5 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg max-h-48 overflow-auto">
                          {suggestions2.map((s, i) => (
                            <li key={i}>
                              <button type="button" onClick={() => onSelectPlace(2, s)} className="w-full text-left px-3 py-2.5 text-sm text-gray-800 hover:bg-primary/5">{s.formattedAddress}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-200 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setMatchStep(1)} className="rounded-xl">Back</Button>
                  <Button
                    type="button"
                    onClick={() => {
                      const { valid, message } = validatePartner2();
                      if (!valid) { toast.error(message); return; }
                      setMatchStep(3);
                    }}
                    className="bg-primary hover:bg-primary/90 px-8 py-6 text-base font-semibold rounded-xl"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {matchStep === 3 && (
            <>
              <div className="flex justify-center mb-4">
                <button type="button" onClick={() => setMatchStep(2)} className="text-sm text-primary hover:underline">← Back to Partner 2</button>
              </div>
              <Card className="border-2 border-gray-100 overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0">
                  <div className="p-6 lg:border-r border-gray-100 lg:pr-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Partner 1</h3>
                    </div>
                    <p className="font-medium text-gray-900">
                      {partner1.name?.trim() || 'Enter details'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {partner1.dob && partner1.time && partner1.placeOfBirth
                        ? `${partner1.dob} • ${partner1.time} • ${partner1.placeOfBirth}`
                        : partner1.dob || partner1.time || partner1.placeOfBirth
                          ? [partner1.dob, partner1.time, partner1.placeOfBirth].filter(Boolean).join(' • ')
                          : '—'}
                    </p>
                  </div>
                  <div className="hidden lg:flex flex-col items-center justify-center px-4 bg-gray-50/50">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-xs font-medium text-gray-500 mt-2 uppercase tracking-wider">Match</p>
                  </div>
                  <div className="p-6 lg:pl-8 border-t lg:border-t-0 lg:border-l border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Partner 2</h3>
                    </div>
                    <p className="font-medium text-gray-900">
                      {partner2.name?.trim() || 'Enter details'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {partner2.dob && partner2.time && partner2.placeOfBirth
                        ? `${partner2.dob} • ${partner2.time} • ${partner2.placeOfBirth}`
                        : partner2.dob || partner2.time || partner2.placeOfBirth
                          ? [partner2.dob, partner2.time, partner2.placeOfBirth].filter(Boolean).join(' • ')
                          : '—'}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">We&apos;ll run Ashtakoot (36 gunas) matching.</p>
                  <Button
                    type="submit"
                    disabled={isComputing}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-base font-semibold px-8 py-6 rounded-xl shadow-sm h-auto min-h-[3.25rem] sm:min-w-[14rem]"
                    size="lg"
                  >
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      {isComputing ? 'Calculating…' : 'See compatibility'}
                      {!isComputing && submitPriceLine && (
                        <>
                          <span aria-hidden>·</span>
                          <span className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-white whitespace-nowrap">
                            <CoinGlyph className="h-4 w-4 shrink-0" />
                            {submitPriceLine}
                          </span>
                        </>
                      )}
                       <ArrowRight className="h-5 w-5 shrink-0" />
                    </span>
                  </Button>
                </div>
              </Card>
            </>
          )}
        </form>
        {result && <MatchmakingResult result={result} />}
      </div>
    </section>
  );
}
