'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useDeleteKundliMutation,
  useLazyGetGeocodeSuggestionsQuery,
  useUpdateKundliMutation,
  type Kundli,
  type PlaceSuggestion,
} from '@/store/api/kundliApi';
import { BirthDetailsForm } from '@/components/kundli/generate/BirthDetailsForm';
import { ServiceProfileMeta } from '@/components/services';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Pencil, Trash2 } from 'lucide-react';

type KundliProfileRowProps = {
  profile: Kundli;
  dobPrefix: string;
  onEdit: (profile: Kundli) => void;
  onDelete: (profile: Kundli) => void;
};

function KundliProfileRow({ profile, dobPrefix, onEdit, onDelete }: KundliProfileRowProps) {
  const tk = useTranslations('settingsKundli');

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-transparent bg-gray-50 px-4 py-3.5 transition-colors hover:border-astro-purple/10 hover:bg-white sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{profile.name}</p>
        <div className="mt-0.5 text-sm text-gray-500">
          {profile.gender && (
            <span>{profile.gender === 'Female' ? tk('genderFemale') : tk('genderMale')}</span>
          )}
          {(profile.dateOfBirth || profile.timeOfBirth || profile.placeOfBirth) && (
            <div className="mt-1">
              <ServiceProfileMeta
                dateOfBirth={profile.dateOfBirth}
                timeOfBirth={profile.timeOfBirth}
                placeOfBirth={profile.placeOfBirth}
                dobPrefix={dobPrefix}
              />
            </div>
          )}
          {profile.timezoneOffsetHours != null && !Number.isNaN(Number(profile.timezoneOffsetHours)) && (() => {
            const h = Number(profile.timezoneOffsetHours);
            const sign = h >= 0 ? '+' : '-';
            const abs = Math.abs(h);
            const hrs = Math.floor(abs);
            const mins = Math.round((abs - hrs) * 60);
            const tzStr = mins ? `GMT${sign}${hrs}:${mins.toString().padStart(2, '0')}` : `GMT${sign}${hrs}:00`;
            return <p className="mt-1 text-xs text-gray-400">{tzStr}</p>;
          })()}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button type="button" variant="outline" size="sm" className="h-9 flex-1 sm:flex-none" onClick={() => onEdit(profile)}>
          <Pencil className="mr-1.5 h-4 w-4" />
          {tk('edit')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 sm:flex-none"
          onClick={() => onDelete(profile)}
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          {tk('delete')}
        </Button>
      </div>
    </li>
  );
}

export function KundliProfileManageDialogs({
  editProfile,
  deleteProfile,
  onCloseEdit,
  onCloseDelete,
}: {
  editProfile: Kundli | null;
  deleteProfile: Kundli | null;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
}) {
  const tk = useTranslations('settingsKundli');
  const [updateKundli, { isLoading: isUpdating }] = useUpdateKundliMutation();
  const [deleteKundli, { isLoading: isDeleting }] = useDeleteKundliMutation();
  const [getGeocodeSuggestions] = useLazyGetGeocodeSuggestionsQuery();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>();
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [placeSearchLoading, setPlaceSearchLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);
  const [debouncedPlaceSearch, setDebouncedPlaceSearch] = useState('');
  const placeInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editProfile) return;
    setName(editProfile.name);
    setGender(editProfile.gender === 'Female' ? 'Female' : 'Male');
    setDateOfBirth(editProfile.dateOfBirth || undefined);
    setTimeOfBirth(editProfile.timeOfBirth || '');
    setPlaceOfBirth(editProfile.placeOfBirth || '');
    setSelectedPlace(null);
    setPlaceSuggestions([]);
  }, [editProfile]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedPlaceSearch(placeOfBirth?.trim() ?? ''), 400);
    return () => clearTimeout(t);
  }, [placeOfBirth]);

  useEffect(() => {
    const query = debouncedPlaceSearch;
    if (!query || (selectedPlace && query === (selectedPlace.formattedAddress ?? '').trim())) {
      setPlaceSuggestions([]);
      setPlaceSearchLoading(false);
      return;
    }
    let cancelled = false;
    setPlaceSearchLoading(true);
    getGeocodeSuggestions({ place: query, limit: 8 })
      .unwrap()
      .then((res) => {
        if (!cancelled && res?.data) {
          const normalized = res.data
            .map((item) => ({
              placeId: (item.placeId ?? '').trim(),
              formattedAddress: (item.formattedAddress ?? '').trim(),
            }))
            .filter((item) => item.placeId && item.formattedAddress);
          setPlaceSuggestions(normalized);
        }
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
  }, [debouncedPlaceSearch, getGeocodeSuggestions, selectedPlace]);

  const onSelectPlace = (suggestion: PlaceSuggestion) => {
    setPlaceSuggestions([]);
    setPlaceOfBirth((suggestion.formattedAddress ?? '').trim());
    setSelectedPlace(suggestion);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProfile) return;
    if (!name.trim()) {
      toast.error(tk('nameRequired'));
      return;
    }
    try {
      await updateKundli({
        id: editProfile.id,
        body: {
          name: name.trim(),
          gender,
          dateOfBirth: dateOfBirth || undefined,
          timeOfBirth: timeOfBirth || undefined,
          placeOfBirth: placeOfBirth || undefined,
          ...(selectedPlace &&
            (selectedPlace.formattedAddress ?? '').trim() === placeOfBirth.trim() &&
            selectedPlace.placeId && { placeId: selectedPlace.placeId }),
        },
      }).unwrap();
      toast.success(tk('updatedSuccess'));
      onCloseEdit();
    } catch {
      toast.error(tk('updateFailed'));
    }
  };

  const handleDelete = async () => {
    if (!deleteProfile) return;
    try {
      await deleteKundli(deleteProfile.id).unwrap();
      toast.success(tk('deletedSuccess'));
      onCloseDelete();
    } catch {
      toast.error(tk('deleteFailed'));
    }
  };

  return (
    <>
      <Dialog open={!!editProfile} onOpenChange={(open) => !open && onCloseEdit()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{tk('editTitle')}</DialogTitle>
            <DialogDescription>
              {tk('editDescription', { name: editProfile?.name ?? '' })}
            </DialogDescription>
          </DialogHeader>
          {editProfile && (
            <BirthDetailsForm
              embedded
              hideSubmitIcon
              title=""
              name={name}
              onNameChange={setName}
              gender={gender}
              onGenderChange={setGender}
              dateOfBirth={dateOfBirth}
              onDateOfBirthChange={setDateOfBirth}
              timeOfBirth={timeOfBirth}
              onTimeOfBirthChange={setTimeOfBirth}
              placeOfBirth={placeOfBirth}
              onPlaceOfBirthChange={setPlaceOfBirth}
              placeSuggestions={placeSuggestions}
              placeSearchLoading={placeSearchLoading}
              onSelectPlace={onSelectPlace}
              placeInputRef={placeInputRef}
              submitLabel={isUpdating ? tk('saving') : tk('saveChanges')}
              onSubmit={handleUpdate}
              isSubmitting={isUpdating}
              nameId={`edit-kundli-${editProfile.id}-name`}
              timeId={`edit-kundli-${editProfile.id}-time`}
              placeId={`edit-kundli-${editProfile.id}-place`}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteProfile} onOpenChange={(open) => !open && onCloseDelete()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{tk('deleteTitle')}</DialogTitle>
            <DialogDescription>
              {tk('deleteDescription', { name: deleteProfile?.name ?? '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCloseDelete} disabled={isDeleting}>
              {tk('deleteCancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tk('deleting')}
                </>
              ) : (
                tk('deleteConfirm')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { KundliProfileRow };
