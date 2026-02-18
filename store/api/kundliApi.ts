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
  id: number;
  uuid: string;
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
  shareToken: string | null;
  shareEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShareResponse {
  isSuccess: boolean;
  data: { shareToken: string | null; shareEnabled: boolean };
}

export interface CreateKundliGenerationResponse {
  isSuccess: boolean;
  data: { id: number; uuid: string; status: string };
}

export interface KundliGenerationResponse {
  isSuccess: boolean;
  data: KundliGeneration;
}

export interface KundliGenerationsListResponse {
  isSuccess: boolean;
  data: KundliGeneration[];
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
    getMyKundliGenerations: builder.query<
      KundliGenerationsListResponse,
      { status?: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'FAILED' } | void
    >({
      query: (params) => ({
        url: '/kundli',
        params: params && typeof params === 'object' && params.status ? { status: params.status } : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((g) => ({ type: 'KundliGeneration' as const, id: g.uuid })),
              { type: 'KundliGeneration', id: 'LIST' },
            ]
          : [{ type: 'KundliGeneration', id: 'LIST' }],
    }),
    getKundliGeneration: builder.query<KundliGenerationResponse, string>({
      query: (uuid) => `/kundli/${uuid}`,
      providesTags: (_result, _err, uuid) => [{ type: 'KundliGeneration', id: uuid }],
    }),
    getKundliByShareToken: builder.query<KundliGenerationResponse, string>({
      query: (token) => `/kundli/share/${token}`,
    }),
    updateKundliShare: builder.mutation<ShareResponse, { uuid: string; enabled: boolean }>({
      query: ({ uuid, enabled }) => ({
        url: `/kundli/${uuid}/share`,
        method: 'PATCH',
        body: { enabled },
      }),
      invalidatesTags: (_result, _err, { uuid }) => [{ type: 'KundliGeneration', id: uuid }],
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
  useGetMyKundliGenerationsQuery,
  useCreateKundliGenerationMutation,
  useGetKundliGenerationQuery,
  useGetKundliByShareTokenQuery,
  useUpdateKundliShareMutation,
  useLazyGetGeocodeQuery,
  useLazyGetGeocodeSuggestionsQuery,
} = kundliApi;
