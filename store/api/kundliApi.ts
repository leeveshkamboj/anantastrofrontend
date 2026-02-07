import { baseApi } from './baseApi';

export interface Kundli {
  id: number;
  userId: number;
  name: string;
  dateOfBirth: string | null;
  timeOfBirth: string | null;
  placeOfBirth: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKundliRequest {
  name: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateKundliRequest {
  name?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
}

export interface KundliResponse {
  isSuccess: boolean;
  data: Kundli;
}

export interface KundlisListResponse {
  isSuccess: boolean;
  data: Kundli[];
}

/** Request body for starting a kundli generation (chart + AI interpretation) */
export interface CreateKundliGenerationRequest {
  dob: string; // YYYY-MM-DD
  time: string; // HH:mm
  latitude: number;
  longitude: number;
  timezoneOffsetHours?: number;
  name?: string;
  placeOfBirth?: string;
}

export type KundliGenerationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface KundliGeneration {
  id: string;
  userId: number;
  dob: string;
  time: string;
  latitude: string;
  longitude: string;
  name: string | null;
  placeOfBirth: string | null;
  chartData: Record<string, unknown> | null;
  interpretation: string | null;
  status: KundliGenerationStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKundliGenerationResponse {
  isSuccess: boolean;
  data: { id: string; status: string };
}

export interface KundliGenerationResponse {
  isSuccess: boolean;
  data: KundliGeneration;
}

/** Backend geocode (Google Maps); returns lat/lng for place string */
export interface GeocodeResponse {
  isSuccess: boolean;
  data: { lat: number; lng: number; formattedAddress?: string } | null;
}

/** Autocomplete suggestion; send placeId in profile create/update so backend resolves lat/lng */
export interface PlaceSuggestion {
  placeId: string;
  formattedAddress: string;
}

export interface GeocodeSuggestionsResponse {
  isSuccess: boolean;
  data: PlaceSuggestion[];
}

export const kundliApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createKundli: builder.mutation<KundliResponse, CreateKundliRequest>({
      query: (body) => ({
        url: '/kundlis',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Kundlis'],
    }),
    updateKundli: builder.mutation<KundliResponse, { id: number; body: UpdateKundliRequest }>({
      query: ({ id, body }) => ({
        url: `/kundlis/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Kundlis'],
    }),
    getMyKundlis: builder.query<KundlisListResponse, void>({
      query: () => '/kundlis',
      providesTags: ['Kundlis'],
    }),
    createKundliGeneration: builder.mutation<CreateKundliGenerationResponse, CreateKundliGenerationRequest>({
      query: (body) => ({
        url: '/kundli',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['KundliGeneration'],
    }),
    getKundliGeneration: builder.query<KundliGenerationResponse, string>({
      query: (id) => `/kundli/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'KundliGeneration', id }],
    }),
    getGeocode: builder.query<GeocodeResponse, string>({
      query: (place) => ({ url: '/geocode', params: { place } }),
    }),
    getGeocodeSuggestions: builder.query<GeocodeSuggestionsResponse, { place: string; limit?: number }>({
      query: ({ place, limit }) => ({
        url: '/geocode/suggestions',
        params: { place, ...(limit != null && { limit: String(limit) }) },
      }),
    }),
  }),
});

export const {
  useCreateKundliMutation,
  useUpdateKundliMutation,
  useGetMyKundlisQuery,
  useCreateKundliGenerationMutation,
  useGetKundliGenerationQuery,
  useLazyGetGeocodeQuery,
  useLazyGetGeocodeSuggestionsQuery,
} = kundliApi;
