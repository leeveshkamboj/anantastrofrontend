'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useGetChatAstrologersQuery, useStartChatSessionMutation } from '@/store/api/chatApi';
import { useGetMyWalletQuery } from '@/store/api/coinsApi';
import {
  useCreateKundliMutation,
  useGetMyKundlisQuery,
  useLazyGetGeocodeSuggestionsQuery,
} from '@/store/api/kundliApi';
import type { PlaceSuggestion } from '@/store/api/kundliApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowUpRight, MapPin, Plus, Sparkles, User } from 'lucide-react';
import { toast } from 'sonner';
import { CelestialBackground } from '@/components/CelestialBackground';
import { selectToken } from '@/store/slices/authSlice';

export default function AstrologersPage() {
  const router = useRouter();
  const token = useSelector(selectToken);
  const { data, isLoading } = useGetChatAstrologersQuery();
  const { data: walletData } = useGetMyWalletQuery();
  const { data: kundlisData, refetch: refetchKundlis } = useGetMyKundlisQuery();
  const [createKundli, { isLoading: creatingKundli }] = useCreateKundliMutation();
  const [getGeocodeSuggestions] = useLazyGetGeocodeSuggestionsQuery();
  const [startSession, { isLoading: starting }] = useStartChatSessionMutation();
  const [selectedKundliId, setSelectedKundliId] = useState<number | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [activeAstrologerId, setActiveAstrologerId] = useState<number | null>(null);
  const [showSomeoneElseForm, setShowSomeoneElseForm] = useState(false);
  const placeInputRef = useRef<HTMLDivElement | null>(null);
  const skipSuggestionsRef = useRef(false);
  const [newKundli, setNewKundli] = useState({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [placeSearchLoading, setPlaceSearchLoading] = useState(false);
  const [debouncedPlaceSearch, setDebouncedPlaceSearch] = useState('');

  const astrologers = data?.data || [];
  const kundlis = kundlisData?.data || [];
  const balance = walletData?.data?.balance ?? 0;
  const activeAstrologer = astrologers.find((a) => a.id === activeAstrologerId);

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

  const getAvatarUrl = (item: { avatarUrl?: string | null; slug?: string; displayName: string; id: number }) => {
    if (item.avatarUrl && item.avatarUrl.trim()) return item.avatarUrl;
    const seed = encodeURIComponent(item.slug || item.displayName || String(item.id));
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
  };

  const handleStart = async (aiAstrologerId: number) => {
    if (!selectedKundliId) {
      toast.error('Please select a kundli profile first');
      return;
    }
    try {
      const res = await startSession({ aiAstrologerId, kundliProfileId: selectedKundliId }).unwrap();
      const sessionUuid = res.data.uuid;
      router.push(`/chat/${sessionUuid}`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Could not start chat');
    }
  };

  const openStartChatDialog = (astrologerId: number) => {
    if (!token) {
      router.push(`/auth/login?next=${encodeURIComponent('/astrologers')}`);
      return;
    }
    setActiveAstrologerId(astrologerId);
    setShowSomeoneElseForm(false);
    setShowProfileDialog(true);
  };

  const handleCreateKundli = async () => {
    if (!newKundli.name || !newKundli.dateOfBirth || !newKundli.timeOfBirth || !newKundli.placeOfBirth) {
      toast.error('Please fill all kundli profile fields');
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
      const id = Number(res.data.id);
      setSelectedKundliId(id);
      setNewKundli({ name: '', dateOfBirth: '', timeOfBirth: '', placeOfBirth: '' });
      setSelectedPlace(null);
      setPlaceSuggestions([]);
      refetchKundlis();
      toast.success('Kundli profile created');
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create kundli profile');
      return false;
    }
  };

  return (
    <div>
      <CelestialBackground className="flex items-center justify-center px-4 py-8 sm:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl text-[#794235] font-serif font-bold">
              Connect With Astrologers
            </h1>
            <p className=" text-base md:text-lg font-medium max-w-2xl mx-auto">
              Select your kundli profile and begin a personalized consultation.
            </p>
          </div>
        </div>
      </CelestialBackground>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12 space-y-8 mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="text-gray-500 font-medium">Loading astrologers...</div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {astrologers.map((item) => (
              <Card
                key={item.id}
                className="group relative gap-0 mt-10 overflow-visible rounded-2xl border border-orange-100/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-r from-orange-100/80 via-amber-100/70 to-orange-50/80" />
                <CardHeader className="relative pb-2 pt-14">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <Image
                        src={getAvatarUrl(item)}
                        alt={item.displayName}
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-white"
                      />
                      <span
                        className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white ${
                          item.isOnlineNow ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                        title={item.isOnlineNow ? 'Online now' : 'Offline'}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <CardTitle className="text-lg text-[#2f1d12] truncate">{item.displayName}</CardTitle>
                    <p className="text-sm text-[#7b4c34] mt-0.5 truncate">
                      {item.persona || 'Astrology Consultant'}
                    </p>
                    {item.locationCity || item.locationState || item.locationCountry ? (
                      <p className="mt-2 flex items-center justify-center gap-1 text-xs text-[#7b4c34]">
                        <MapPin className="h-3.5 w-3.5" />
                        {[item.locationCity, item.locationState, item.locationCountry].filter(Boolean).join(', ')}
                      </p>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="flex h-full flex-col space-y-3">
                  <div className="min-h-[44px]">
                    <div className="flex flex-wrap gap-2">
                    {(item.specialties || []).slice(0, 3).map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="border-orange-200 bg-orange-50/50 text-[#7a3f23]"
                      >
                        {s}
                      </Badge>
                    ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#7b4c34]">Consultation Price</span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2f1d12]">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {item.coinsPerMinute} coins/min
                      </span>
                    </div>
                  </div>

                  <Button
                    className="mt-auto w-full h-11 bg-linear-to-r from-primary to-[#d6682a] text-white shadow-sm transition-all group-hover:shadow-md"
                    onClick={() => openStartChatDialog(item.id)}
                    disabled={starting || item.isOnlineNow === false}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {item.isOnlineNow === false ? 'Currently Offline' : 'Start Chat'}
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Kundli Profile</DialogTitle>
            <DialogDescription>
              Choose a saved profile or add someone else, then start your chat.
            </DialogDescription>
          </DialogHeader>

          {!showSomeoneElseForm ? (
            <div className="space-y-4">
              <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
                {kundlis.length === 0 ? (
                  <p className="text-sm text-gray-500">No saved profiles yet. Add one below.</p>
                ) : (
                  kundlis.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setSelectedKundliId(k.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        selectedKundliId === k.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50 bg-white'
                      }`}
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
                  ))
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-gray-700">Want to chat for someone else?</p>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowSomeoneElseForm(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Someone else
                </Button>
              </div>

              <Button
                className="w-full h-11"
                disabled={!selectedKundliId || !activeAstrologerId || starting}
                onClick={() => activeAstrologerId && handleStart(activeAstrologerId)}
              >
                <span className="inline-flex items-center gap-1.5">
                  Start Chat
                  {activeAstrologer?.coinsPerMinute ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium opacity-90">
                      · <CoinGlyph className="h-3.5 w-3.5" /> {activeAstrologer.coinsPerMinute} /min
                    </span>
                  ) : null}
                </span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Use accurate birth details for best astrological guidance.</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const ok = await handleCreateKundli();
                  if (ok) setShowSomeoneElseForm(false);
                }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="chat-kundli-name">Name</Label>
                  <Input
                    id="chat-kundli-name"
                    value={newKundli.name}
                    onChange={(e) => setNewKundli((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Full name"
                    className="bg-gray-50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date of birth</Label>
                  <DatePicker
                    value={newKundli.dateOfBirth || undefined}
                    onChange={(value) => setNewKundli((s) => ({ ...s, dateOfBirth: value || '' }))}
                    placeholder="Select date"
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chat-kundli-time">Time of birth</Label>
                  <Input
                    id="chat-kundli-time"
                    type="time"
                    value={newKundli.timeOfBirth}
                    onChange={(e) => setNewKundli((s) => ({ ...s, timeOfBirth: e.target.value }))}
                    className="bg-gray-50"
                  />
                </div>
                <div ref={placeInputRef} className="space-y-2">
                  <Label htmlFor="chat-kundli-place">Place of birth</Label>
                  <Input
                    id="chat-kundli-place"
                    value={newKundli.placeOfBirth}
                    onChange={(e) => setNewKundli((s) => ({ ...s, placeOfBirth: e.target.value }))}
                    placeholder="Search city or place"
                    className="bg-gray-50"
                    autoComplete="off"
                  />
                  {placeSearchLoading && newKundli.placeOfBirth.trim() && (
                    <p className="text-sm text-gray-500">Searching…</p>
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
                  className="w-full bg-primary hover:bg-primary/90 text-base py-2.5 h-auto"
                >
                  {creatingKundli ? 'Saving...' : 'Save Profile'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full mt-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setShowSomeoneElseForm(false)}
                >
                  Back
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
