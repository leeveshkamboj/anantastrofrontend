import { baseApi } from './baseApi';

export interface AstrologerProfile {
  id: number;
  userId: number;
  bio?: string;
  yearsOfExperience?: number;
  education?: string;
  profileImage?: string; // URL for backward compatibility
  profileImageUuid?: string | null; // UUID for submitting/saving
  profileImageUrl?: string | null; // URL for displaying
  isActive: boolean;
  isVisible: boolean;
  profileApproved: boolean;
  profileStatus?: 'draft' | 'pending_review' | 'approved';
  approvedData?: {
    bio?: string;
    yearsOfExperience?: number;
    education?: string;
    baseCurrency?: string;
    isVisible?: boolean;
  };
  rating?: number;
  totalConsultations: number;
  baseCurrency?: string;
  languages?: AstrologerLanguage[];
  expertise?: AstrologerExpertise[];
  servicePricing?: AstrologerServicePricing[];
  preferredHours?: AstrologerPreferredHours[];
  unreadNotificationsCount?: number;
  user?: {
    id: number;
    name: string;
    email: string;
    profileImage?: string; // URL for backward compatibility
    profileImageUuid?: string | null; // UUID for submitting/saving
    profileImageUrl?: string | null; // URL for displaying
  };
}

export interface AstrologerLanguage {
  id: number;
  astrologerProfileId: number;
  language: string;
  isApproved: boolean;
}

export interface AstrologerExpertise {
  id: number;
  astrologerProfileId: number;
  expertise: string;
  isCustom: boolean;
  isApproved: boolean;
}

export interface AstrologerServicePricing {
  id: number;
  astrologerProfileId: number;
  serviceType: 'full_kundli' | 'horoscope' | 'matchmaking' | 'consultation';
  price?: number;
  approvedPrice?: number;
  isApproved: boolean;
  rejectionReason?: string;
  // Currency conversion fields (added by backend when userCurrency is provided)
  formattedPrice?: string;
  displayCurrency?: string;
  originalPrice?: number;
  originalCurrency?: string;
}

export interface AstrologerPreferredHours {
  id: number;
  astrologerProfileId: number;
  dayOfWeek: string;
  startTime?: string;
  endTime?: string;
  isAvailable: boolean;
  isApproved: boolean;
}

export interface Language {
  id: number;
  name: string;
  code?: string;
  isActive: boolean;
}

export interface ExpertiseTag {
  id: number;
  name: string;
  category?: string;
  isActive: boolean;
}

export interface Notification {
  id: number;
  astrologerProfileId: number;
  type: string;
  message: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
  readAt?: string;
}

export interface AstrologerProfileResponse {
  isSuccess: boolean;
  data: AstrologerProfile;
}

export interface LanguagesResponse {
  isSuccess: boolean;
  data: Language[];
}

export interface ExpertiseTagsResponse {
  isSuccess: boolean;
  data: ExpertiseTag[];
}

export interface NotificationsResponse {
  isSuccess: boolean;
  data: {
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateProfileRequest {
  bio?: string;
  yearsOfExperience?: number;
  education?: string;
  profileImage?: string;
  isVisible?: boolean;
  baseCurrency?: string;
  languages?: string[];
  expertise?: string[];
  preferredHours?: PreferredHoursItem[];
  submitForReview?: boolean;
}

export interface UpdateLanguagesRequest {
  languages: string[];
}

export interface UpdateExpertiseRequest {
  expertise: string[];
}

export interface ServicePricingItem {
  serviceType: 'full_kundli' | 'horoscope' | 'matchmaking' | 'consultation';
  price?: number;
}

export interface UpdateServicePricingRequest {
  pricing: ServicePricingItem[];
}

export interface PreferredHoursItem {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
}

export interface UpdatePreferredHoursRequest {
  hours: PreferredHoursItem[];
}

export interface RejectProfileRequest {
  reason: string;
}

export interface RejectPricingRequest {
  serviceType: 'full_kundli' | 'horoscope' | 'matchmaking' | 'consultation';
  reason: string;
}

export const astrologerProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<AstrologerProfileResponse, { currency?: string; timezone?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.currency) queryParams.append('currency', params.currency);
        if (params?.timezone) queryParams.append('timezone', params.timezone);
        const queryString = queryParams.toString();
        return `/astrologer-profiles/my-profile${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['AstrologerProfile', 'Auth'],
    }),
    updateMyProfile: builder.mutation<AstrologerProfileResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: '/astrologer-profiles/my-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AstrologerProfile', 'Auth'],
    }),
    updateLanguages: builder.mutation<{ isSuccess: boolean; data: { message: string } }, UpdateLanguagesRequest>({
      query: (data) => ({
        url: '/astrologer-profiles/my-profile/languages',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AstrologerProfile', 'Auth'],
    }),
    updateExpertise: builder.mutation<{ isSuccess: boolean; data: { message: string } }, UpdateExpertiseRequest>({
      query: (data) => ({
        url: '/astrologer-profiles/my-profile/expertise',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AstrologerProfile', 'Auth'],
    }),
    updateServicePricing: builder.mutation<{ isSuccess: boolean; data: { message: string } }, UpdateServicePricingRequest>({
      query: (data) => ({
        url: '/astrologer-profiles/my-profile/pricing',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AstrologerProfile', 'Auth'],
    }),
    updatePreferredHours: builder.mutation<{ isSuccess: boolean; data: { message: string } }, UpdatePreferredHoursRequest>({
      query: (data) => ({
        url: '/astrologer-profiles/my-profile/preferred-hours',
        method: 'PUT',
        body: data,
      }),
      // Don't invalidate immediately - will be invalidated by updateProfile at the end
      invalidatesTags: [],
    }),
    submitProfileForReview: builder.mutation<AstrologerProfileResponse, void>({
      query: () => ({
        url: '/astrologer-profiles/my-profile/submit-for-review',
        method: 'POST',
      }),
      invalidatesTags: ['AstrologerProfile', 'Auth'],
    }),
    checkProfileCompletion: builder.query<{ isSuccess: boolean; data: { isComplete: boolean; profileApproved: boolean } }, void>({
      query: () => '/astrologer-profiles/my-profile/completion-status',
      providesTags: ['AstrologerProfile', 'Auth'],
      transformResponse: (response: any) => {
        // The backend returns isComplete and profileApproved
        return response;
      },
    }),
    getPredefinedLanguages: builder.query<LanguagesResponse, string | void>({
      query: (search) => ({
        url: '/astrologer-profiles/languages',
        params: search ? { search } : {},
      }),
      providesTags: ['Languages', 'Auth'],
    }),
    getPredefinedExpertise: builder.query<ExpertiseTagsResponse, void>({
      query: () => '/astrologer-profiles/expertise-tags',
      providesTags: ['ExpertiseTags', 'Auth'],
    }),
    getCurrencies: builder.query<{ isSuccess: boolean; data: any[] }, void>({
      query: () => '/astrologer-profiles/currencies',
      providesTags: ['Currencies', 'Auth'],
    }),
    getTimezones: builder.query<{ isSuccess: boolean; data: any[] }, void>({
      query: () => '/astrologer-profiles/timezones',
      providesTags: ['Timezones', 'Auth'],
    }),
    getNotifications: builder.query<NotificationsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/astrologer-profiles/my-profile/notifications?page=${page}&limit=${limit}`,
      providesTags: ['Notifications', 'Auth'],
    }),
    markNotificationAsRead: builder.mutation<{ isSuccess: boolean; data: { message: string } }, number>({
      query: (id) => ({
        url: `/astrologer-profiles/my-profile/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications', 'AstrologerProfile', 'Auth'],
    }),
    // Admin endpoints
    getAstrologerProfiles: builder.query<{ isSuccess: boolean; data: AstrologerProfile[] }, void>({
      query: () => '/astrologer-profiles/admin/astrologer-profiles',
      providesTags: ['AstrologerProfiles', 'Auth'],
    }),
    getAstrologerProfile: builder.query<AstrologerProfileResponse, number>({
      query: (id) => `/astrologer-profiles/admin/astrologer-profiles/${id}`,
      providesTags: (result, error, id) => [{ type: 'AstrologerProfile', id }, 'Auth'],
    }),
    updateAstrologerProfile: builder.mutation<AstrologerProfileResponse, { id: number; data: UpdateProfileRequest }>({
      query: ({ id, data }) => ({
        url: `/astrologer-profiles/admin/astrologer-profiles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AstrologerProfiles', 'AstrologerProfile', 'Auth'],
    }),
    activateAstrologer: builder.mutation<AstrologerProfileResponse, number>({
      query: (id) => ({
        url: `/astrologer-profiles/admin/astrologer-profiles/${id}/activate`,
        method: 'POST',
      }),
      invalidatesTags: ['AstrologerProfiles', 'AstrologerProfile', 'Auth'],
    }),
    deactivateAstrologer: builder.mutation<AstrologerProfileResponse, number>({
      query: (id) => ({
        url: `/astrologer-profiles/admin/astrologer-profiles/${id}/deactivate`,
        method: 'POST',
      }),
      invalidatesTags: ['AstrologerProfiles', 'AstrologerProfile', 'Auth'],
    }),
    approveProfile: builder.mutation<AstrologerProfileResponse, number>({
      query: (id) => ({
        url: `/astrologer-profiles/admin/astrologer-profiles/${id}/approve-profile`,
        method: 'POST',
      }),
      invalidatesTags: ['AstrologerProfiles', 'AstrologerProfile', 'Notifications', 'Auth'],
    }),
    rejectProfile: builder.mutation<AstrologerProfileResponse, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/astrologer-profiles/admin/astrologer-profiles/${id}/reject-profile`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['AstrologerProfiles', 'AstrologerProfile', 'Notifications', 'Auth'],
    }),
    approvePricing: builder.mutation<{ isSuccess: boolean; data: { message: string } }, { id: number; serviceType?: string }>({
      query: ({ id, serviceType }) => ({
        url: `/astrologer-profiles/admin/astrologer-profiles/${id}/approve-pricing${serviceType ? `?serviceType=${serviceType}` : ''}`,
        method: 'POST',
      }),
      invalidatesTags: ['AstrologerProfiles', 'AstrologerProfile', 'Notifications', 'Auth'],
    }),
    rejectPricing: builder.mutation<{ isSuccess: boolean; data: { message: string } }, { id: number; data: RejectPricingRequest }>({
      query: ({ id, data }) => ({
        url: `/astrologer-profiles/admin/astrologer-profiles/${id}/reject-pricing`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AstrologerProfiles', 'AstrologerProfile', 'Notifications', 'Auth'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateLanguagesMutation,
  useUpdateExpertiseMutation,
  useUpdateServicePricingMutation,
  useUpdatePreferredHoursMutation,
  useSubmitProfileForReviewMutation,
  useCheckProfileCompletionQuery,
  useGetPredefinedLanguagesQuery,
  useGetPredefinedExpertiseQuery,
  useGetCurrenciesQuery,
  useGetTimezonesQuery,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useGetAstrologerProfilesQuery,
  useGetAstrologerProfileQuery,
  useUpdateAstrologerProfileMutation,
  useActivateAstrologerMutation,
  useDeactivateAstrologerMutation,
  useApproveProfileMutation,
  useRejectProfileMutation,
  useApprovePricingMutation,
  useRejectPricingMutation,
} = astrologerProfileApi;
