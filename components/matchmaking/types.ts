import type { PlaceSuggestion } from '@/store/api/kundliApi';

export interface PartnerForm {
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

export const initialPartner: PartnerForm = {
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
