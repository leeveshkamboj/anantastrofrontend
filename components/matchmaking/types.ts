import type { PlaceSuggestion } from '@/store/api/kundliApi';

export interface PartnerForm {
  name: string;
  gender: 'Male' | 'Female';
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

export const initialPartnerFemale: PartnerForm = {
  ...initialPartner,
  gender: 'Female',
};
