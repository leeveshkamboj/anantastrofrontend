'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, User } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';
import {
  useCreateKundliMutation,
  useGetMyKundlisQuery,
  useLazyGetGeocodeSuggestionsQuery,
} from '@/store/api/kundliApi';
import { useStartChatSessionMutation } from '@/store/api/chatApi';
import type { PlaceSuggestion } from '@/store/api/kundliApi';
import type { ChatAstrologer } from '@/store/api/chatApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { BirthGenderSelect } from '@/components/kundli/BirthGenderSelect';
import { ChatPerMinutePrice } from '@/components/coins/ChatPerMinutePrice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type StartChatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeAstrologer: ChatAstrologer | undefined;
};

export function StartChatDialog({ open, onOpenChange, activeAstrologer }: StartChatDialogProps) {
  const ta = useTranslations('astrologersPage');
  const tk = useTranslations('settingsKundli');
  const router = useRouter();
  const { data: kundlisData, refetch: refetchKundlis } = useGetMyKundlisQuery();
  const [createKundli, { isLoading: creatingKundli }] = useCreateKundliMutation();
  const [getGeocodeSuggestions] = useLazyGetGeocodeSuggestionsQuery();
  const [startSession, { isLoading: starting }] = useStartChatSessionMutation();
  const [selectedKundliId, setSelectedKundliId] = useState<number | null>(null);
  const [showSomeoneElseForm, setShowSomeoneElseForm] = useState(false);
  const placeInputRef = useRef<HTMLDivElement | null>(null);
  const skipSuggestionsRef = useRef(false);
  const [newKundli, setNewKundli] = useState({
    name: '',
    gender: 'Male' as 'Male' | 'Female',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [placeSearchLoading, setPlaceSearchLoading] = useState(false);
  const [debouncedPlaceSearch, setDebouncedPlaceSearch] = useState('');

  const kundlis = kundlisData?.data || [];

  useEffect(() => {
    if (!open) {
      setShowSomeoneElseForm(false);
      setSelectedKundliId(null);
    }
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedPlaceSearch(newKundli.placeOfBirth.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [newKundli.placeOfBirth]);

  useEffect(() => {
    if (skipSuggestionsRef.current) {
      skipSuggestionsRef.current = false;
      setPlaceSuggestions([]);
      setPlaceSearchLoading(false);
      return;
    }
    if (!debouncedPlaceSearch) {
      setPlaceSuggestions([]);
      setPlaceSearchLoading(false);
      return;
    }
    let cancelled = false;
    setPlaceSearchLoading(true);
    getGeocodeSuggestions({ place: debouncedPlaceSearch, limit: 8 })
      .unwrap()
      .then((res) => {
        if (cancelled || !res?.data) return;
        setPlaceSuggestions(res.data);
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
      if (placeInputRef.current && !placeInputRef.current.contains(e.target as Node)) {
        setPlaceSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedPlace && selectedPlace.formattedAddress.trim() !== newKundli.placeOfBirth.trim()) {
      setSelectedPlace(null);
    }
  }, [newKundli.placeOfBirth, selectedPlace]);

  const handleStart = async () => {
    if (!selectedKundliId || !activeAstrologer) {
      toast.error(ta('selectProfileFirst'));
      return;
    }
    try {
      const res = await startSession({
        aiAstrologerId: activeAstrologer.id,
        kundliProfileId: selectedKundliId,
      }).unwrap();
      onOpenChange(false);
      router.push(`/chat/${res.data.uuid}`);
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'data' in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || ta('chatStartFailed'));
    }
  };

  const handleCreateKundli = async () => {
    if (!newKundli.name || !newKundli.dateOfBirth || !newKundli.timeOfBirth || !newKundli.placeOfBirth) {
      toast.error(ta('fillAllFields'));
      return false;
    }
    try {
      const body = {
        ...newKundli,
        ...(selectedPlace &&
          selectedPlace.placeId &&
          selectedPlace.formattedAddress.trim() === newKundli.placeOfBirth.trim() && {
            placeId: selectedPlace.placeId,
          }),
      };
      const res = await createKundli(body).unwrap();
      setSelectedKundliId(Number(res.data.id));
      setNewKundli({ name: '', gender: 'Male', dateOfBirth: '', timeOfBirth: '', placeOfBirth: '' });
      setSelectedPlace(null);
      setPlaceSuggestions([]);
      refetchKundlis();
      toast.success(ta('profileCreated'));
      return true;
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'data' in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || ta('kundliCreateFailed'));
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ta('dialogTitle')}</DialogTitle>
          <DialogDescription>{ta('dialogDescription')}</DialogDescription>
        </DialogHeader>

        {!showSomeoneElseForm ? (
          <div className="space-y-4">
            <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {kundlis.length === 0 ? (
                <p className="text-sm text-gray-500">{ta('noProfilesHint')}</p>
              ) : (
                kundlis.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setSelectedKundliId(k.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      selectedKundliId === k.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 bg-white hover:border-primary/50'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{k.name}</p>
                      <p className="text-sm text-gray-500">
                        {k.dateOfBirth && `${tk('dob')} ${k.dateOfBirth}`}
                        {k.timeOfBirth && ` • ${tk('time')} ${k.timeOfBirth}`}
                        {k.placeOfBirth && ` • ${k.placeOfBirth}`}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t pt-2">
              <p className="text-sm text-gray-700">{ta('someoneElsePrompt')}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowSomeoneElseForm(true)}>
                <Plus className="mr-1 h-4 w-4" />
                {ta('someoneElse')}
              </Button>
            </div>

            <Button className="h-11 w-full" disabled={!selectedKundliId || !activeAstrologer || starting} onClick={handleStart}>
              <span className="inline-flex items-center gap-1.5">
                {ta('startChat')}
                {activeAstrologer?.coinsPerMinute ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium opacity-90">
                    ·{' '}
                    <ChatPerMinutePrice
                      coinsPerMinute={activeAstrologer.coinsPerMinute}
                      labeled
                      glyphClassName="h-3.5 w-3.5 text-astro-orange"
                    />
                  </span>
                ) : null}
              </span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">{ta('formIntro')}</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const ok = await handleCreateKundli();
                if (ok) setShowSomeoneElseForm(false);
              }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="chat-kundli-name">{ta('labelName')}</Label>
                <Input
                  id="chat-kundli-name"
                  value={newKundli.name}
                  onChange={(e) => setNewKundli((s) => ({ ...s, name: e.target.value }))}
                  placeholder={ta('fullNamePh')}
                  className="bg-gray-50"
                  required
                />
              </div>
              <BirthGenderSelect
                id="chat-kundli-gender"
                value={newKundli.gender}
                onChange={(gender) => setNewKundli((s) => ({ ...s, gender }))}
                translationNamespace="astrologersPage"
              />
              <div className="space-y-2">
                <Label>{ta('labelDob')}</Label>
                <DatePicker
                  value={newKundli.dateOfBirth || undefined}
                  onChange={(value) => setNewKundli((s) => ({ ...s, dateOfBirth: value || '' }))}
                  placeholder={ta('dobPh')}
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chat-kundli-time">{ta('labelTime')}</Label>
                <Input
                  id="chat-kundli-time"
                  type="time"
                  value={newKundli.timeOfBirth}
                  onChange={(e) => setNewKundli((s) => ({ ...s, timeOfBirth: e.target.value }))}
                  className="bg-gray-50"
                />
              </div>
              <div ref={placeInputRef} className="space-y-2">
                <Label htmlFor="chat-kundli-place">{ta('labelPlace')}</Label>
                <Input
                  id="chat-kundli-place"
                  value={newKundli.placeOfBirth}
                  onChange={(e) => setNewKundli((s) => ({ ...s, placeOfBirth: e.target.value }))}
                  placeholder={ta('placePh')}
                  className="bg-gray-50"
                  autoComplete="off"
                />
                {placeSearchLoading && newKundli.placeOfBirth.trim() && (
                  <p className="text-sm text-gray-500">{ta('searchingPlaces')}</p>
                )}
                {placeSuggestions.length > 0 && (
                  <ul className="mt-0.5 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {placeSuggestions.map((s, i) => (
                      <li key={`${s.placeId}-${i}`}>
                        <button
                          type="button"
                          onClick={() => {
                            skipSuggestionsRef.current = true;
                            setSelectedPlace(s);
                            setNewKundli((prev) => ({ ...prev, placeOfBirth: s.formattedAddress }));
                            setPlaceSuggestions([]);
                          }}
                          className="w-full px-3 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
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
                disabled={creatingKundli}
                className="h-auto w-full bg-primary py-2.5 text-base hover:bg-primary/90"
              >
                {creatingKundli ? ta('saving') : ta('saveProfile')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="mt-2 w-full text-gray-600 hover:text-gray-900"
                onClick={() => setShowSomeoneElseForm(false)}
              >
                {ta('back')}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
