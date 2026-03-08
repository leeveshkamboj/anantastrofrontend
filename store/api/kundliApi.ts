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
  timezoneOffsetHours: number | null;
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

/** KP (Krishnamurti Paddhati) Bhav Chalit chart data from backend */
export interface KpChartData {
  rulingPlanets?: { point: string; signLord: string; starLord: string; subLord: string }[];
  planets?: { planet: string; cusp: number; sign: string; signLord: string; starLord: string; subLord: string }[];
  cusps?: { cusp: number; degree: number; sign: string; signLord: string; starLord: string; subLord: string }[];
}

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
  kpChartData: KpChartData | null;
  timezoneOffsetHours: number | null;
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

/** Backend timezone from lat/lng (Google Time Zone API); offset in hours e.g. 5.5 for IST */
export interface GeocodeTimezoneResponse {
  isSuccess: boolean;
  data: { timezoneOffsetHours: number | null };
}

/** Partner birth details for matchmaking */
export interface MatchmakingPartnerRequest {
  dob: string;
  time: string;
  latitude: number;
  longitude: number;
  timezoneOffsetHours?: number;
  name?: string;
  placeOfBirth?: string;
}

export interface MatchmakingKootaResult {
  name: string;
  maxPoints: number;
  points: number;
  description: string;
  maleValue?: string;
  femaleValue?: string;
  areaOfLife?: string;
  meaning?: string;
}

export interface MatchmakingResult {
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  interpretation: string;
  kootas: MatchmakingKootaResult[];
  partner1Summary: { name?: string; nakshatra: string; rashi: string; varna: string; gan: string; nadi: string };
  partner2Summary: { name?: string; nakshatra: string; rashi: string; varna: string; gan: string; nadi: string };
}

export interface MatchmakingRequest {
  partner1: MatchmakingPartnerRequest;
  partner2: MatchmakingPartnerRequest;
}

export interface MatchmakingResponse {
  isSuccess: boolean;
  data: MatchmakingResult;
}

export type MatchmakingReportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface MatchmakingReport {
  id: number;
  uuid: string;
  userId: number;
  partner1Name: string | null;
  partner1Dob: string;
  partner1Time: string;
  partner1Latitude: string | number;
  partner1Longitude: string | number;
  partner1TimezoneOffsetHours: number | null;
  partner1PlaceOfBirth: string | null;
  partner2Name: string | null;
  partner2Dob: string;
  partner2Time: string;
  partner2Latitude: string | number;
  partner2Longitude: string | number;
  partner2TimezoneOffsetHours: number | null;
  partner2PlaceOfBirth: string | null;
  result: MatchmakingResult | null;
  partner1ChartData: Record<string, unknown> | null;
  partner2ChartData: Record<string, unknown> | null;
  status: MatchmakingReportStatus;
  errorMessage: string | null;
  shareToken: string | null;
  shareEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMatchmakingReportResponse {
  isSuccess: boolean;
  data: { id: number; uuid: string; status: string };
}

export interface MatchmakingReportResponse {
  isSuccess: boolean;
  data: MatchmakingReport;
}

export interface MatchmakingReportsListResponse {
  isSuccess: boolean;
  data: MatchmakingReport[];
}

/** Horoscope: create request (birth details + period) */
export interface CreateHoroscopeRequest {
  dob: string;
  time: string;
  latitude: number;
  longitude: number;
  timezoneOffsetHours?: number;
  name?: string;
  placeOfBirth?: string;
  period: 'daily' | 'weekly' | 'monthly';
}

export type HoroscopeReportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

/** Structured horoscope result from AI (overview, career, health, relationships, finance, remedies) */
export interface HoroscopeResult {
  overview?: string;
  career?: string;
  health?: string;
  relationships?: string;
  finance?: string;
  remedies?: string;
}

export interface HoroscopeReport {
  id: number;
  uuid: string;
  userId: number;
  name: string | null;
  dob: string;
  time: string;
  latitude: string | number;
  longitude: string | number;
  timezoneOffsetHours: number | null;
  placeOfBirth: string | null;
  period: 'daily' | 'weekly' | 'monthly';
  chartData: Record<string, unknown> | null;
  result: HoroscopeResult | Record<string, unknown> | null;
  status: HoroscopeReportStatus;
  errorMessage: string | null;
  shareToken: string | null;
  shareEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHoroscopeReportResponse {
  isSuccess: boolean;
  data: { id: number; uuid: string; status: string };
}

export interface HoroscopeReportResponse {
  isSuccess: boolean;
  data: HoroscopeReport;
}

export interface HoroscopeReportsListResponse {
  isSuccess: boolean;
  data: HoroscopeReport[];
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
    getGeocodeTimezone: builder.query<GeocodeTimezoneResponse, { lat: number; lng: number }>({
      query: ({ lat, lng }) => ({ url: '/geocode/timezone', params: { lat: String(lat), lng: String(lng) } }),
    }),
    createMatchmakingReport: builder.mutation<CreateMatchmakingReportResponse, MatchmakingRequest>({
      query: (body) => ({
        url: '/matchmaking',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MatchmakingReport'],
    }),
    getMatchmakingReport: builder.query<MatchmakingReportResponse, string>({
      query: (uuid) => `/matchmaking/${uuid}`,
      providesTags: (_result, _err, uuid) => [{ type: 'MatchmakingReport', id: uuid }],
    }),
    getMatchmakingByShareToken: builder.query<MatchmakingReportResponse, string>({
      query: (token) => `/matchmaking/share/${token}`,
    }),
    updateMatchmakingShare: builder.mutation<ShareResponse, { uuid: string; enabled: boolean }>({
      query: ({ uuid, enabled }) => ({
        url: `/matchmaking/${uuid}/share`,
        method: 'PATCH',
        body: { enabled },
      }),
      invalidatesTags: (_result, _err, { uuid }) => [{ type: 'MatchmakingReport', id: uuid }],
    }),
    getMyMatchmakingReports: builder.query<
      MatchmakingReportsListResponse,
      { status?: MatchmakingReportStatus } | void
    >({
      query: (params) => ({
        url: '/matchmaking',
        params: params && typeof params === 'object' && params.status ? { status: params.status } : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((r) => ({ type: 'MatchmakingReport' as const, id: r.uuid })),
              { type: 'MatchmakingReport', id: 'LIST' },
            ]
          : [{ type: 'MatchmakingReport', id: 'LIST' }],
    }),
    createHoroscopeReport: builder.mutation<CreateHoroscopeReportResponse, CreateHoroscopeRequest>({
      query: (body) => ({
        url: '/horoscope',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HoroscopeReport'],
    }),
    getHoroscopeReport: builder.query<HoroscopeReportResponse, string>({
      query: (uuid) => `/horoscope/${uuid}`,
      providesTags: (_result, _err, uuid) => [{ type: 'HoroscopeReport', id: uuid }],
    }),
    getHoroscopeByShareToken: builder.query<HoroscopeReportResponse, string>({
      query: (token) => `/horoscope/share/${token}`,
    }),
    updateHoroscopeShare: builder.mutation<ShareResponse, { uuid: string; enabled: boolean }>({
      query: ({ uuid, enabled }) => ({
        url: `/horoscope/${uuid}/share`,
        method: 'PATCH',
        body: { enabled },
      }),
      invalidatesTags: (_result, _err, { uuid }) => [{ type: 'HoroscopeReport', id: uuid }],
    }),
    getMyHoroscopeReports: builder.query<
      HoroscopeReportsListResponse,
      { status?: HoroscopeReportStatus } | void
    >({
      query: (params) => ({
        url: '/horoscope',
        params: params && typeof params === 'object' && params.status ? { status: params.status } : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((r) => ({ type: 'HoroscopeReport' as const, id: r.uuid })),
              { type: 'HoroscopeReport', id: 'LIST' },
            ]
          : [{ type: 'HoroscopeReport', id: 'LIST' }],
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
  useLazyGetGeocodeTimezoneQuery,
  useCreateMatchmakingReportMutation,
  useGetMatchmakingReportQuery,
  useGetMatchmakingByShareTokenQuery,
  useUpdateMatchmakingShareMutation,
  useGetMyMatchmakingReportsQuery,
  useCreateHoroscopeReportMutation,
  useGetHoroscopeReportQuery,
  useGetHoroscopeByShareTokenQuery,
  useUpdateHoroscopeShareMutation,
  useGetMyHoroscopeReportsQuery,
} = kundliApi;
