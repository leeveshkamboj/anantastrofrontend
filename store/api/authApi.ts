import { baseApi } from './baseApi';
import { setCredentials, setUser, logout as logoutAction, setSessionChecked } from '../slices/authSlice';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthData {
  user: {
    id: number;
    email: string;
    name: string;
    phone?: string;
    dateOfBirth?: string;
    profileImage?: string;
    provider: string;
    role: 'user' | 'admin' | 'astrologer';
    currency?: string;
    timezone?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AuthResponse {
  isSuccess: boolean;
  data: AuthData;
}

export interface RegisterResponse {
  isSuccess: boolean;
  data:
    | AuthData
    | { requiresEmailVerification: true; message: string };
}

export interface ResendVerificationResponse {
  isSuccess: boolean;
  data: { message: string; alreadyVerified?: boolean };
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string; // URL for backward compatibility
  profileImageUuid?: string | null; // UUID for submitting/saving
  profileImageUrl?: string | null; // URL for displaying
  provider: string;
  role: 'user' | 'admin' | 'astrologer';
  currency?: string;
  timezone?: string;
  emailVerified?: boolean;
  impersonation?: {
    active: boolean;
    adminId: number;
    adminName: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  isSuccess: boolean;
  data: User;
}

export interface LogoutResponse {
  isSuccess: boolean;
  data: {
    message: string;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
  currency?: string;
  timezone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SetPasswordRequest {
  newPassword: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.isSuccess && data.data && 'user' in data.data) {
            dispatch(setCredentials({ user: data.data.user }));
            dispatch(authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true }));
          }
        } catch {
          // Error handling is done by the mutation hook
        }
      },
    }),
    resendVerification: builder.mutation<ResendVerificationResponse, { email: string }>({
      query: (body) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body,
      }),
    }),
    verifyEmail: builder.mutation<AuthResponse, { token: string }>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.isSuccess && data.data?.user) {
            dispatch(setCredentials({ user: data.data.user }));
            dispatch(authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true }));
          }
        } catch {
          // Error handling in component
        }
      },
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.isSuccess && data.data?.user) {
            dispatch(setCredentials({ user: data.data.user }));
          }
        } catch {
          // Error handling is done by the mutation hook
        }
      },
    }),
    getProfile: builder.query<UserResponse, void>({
      query: () => '/auth/profile',
      providesTags: ['User', 'Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.isSuccess && data.data) {
            dispatch(setUser(data.data));
          }
        } catch (error: any) {
          if (error?.status === 401 || error?.status === 'FETCH_ERROR') {
            dispatch(logoutAction());
          } else {
            dispatch(setSessionChecked(true));
          }
        }
      },
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Immediately remove token from Redux state before API call
        // This ensures that any refetches triggered by invalidatesTags won't use the old token
        dispatch(logoutAction());
        
        try {
          await queryFulfilled;
        } catch {
          // Even if logout fails on server, state is already cleared
          // No need to dispatch logoutAction again
        }
      },
    }),
    updateProfile: builder.mutation<UserResponse, UpdateProfileRequest>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.isSuccess && data?.data) {
            dispatch(setUser(data.data));
          }
        } catch {
          // Error handled by component
        }
      },
    }),
    changePassword: builder.mutation<{ isSuccess: boolean; data: { message: string } }, ChangePasswordRequest>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),
    setPassword: builder.mutation<{ isSuccess: boolean; data: { message: string } }, SetPasswordRequest>({
      query: (body) => ({
        url: '/auth/set-password',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<
      { isSuccess: boolean; data: { message: string } },
      { email: string }
    >({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<
      { isSuccess: boolean; data: { message: string } },
      { token: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    exchangeOAuthCode: builder.mutation<AuthResponse, { code: string }>({
      query: (body) => ({
        url: '/auth/oauth/exchange',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.isSuccess && data.data?.user) {
            dispatch(setCredentials({ user: data.data.user }));
          }
        } catch {
          // Error handled in component
        }
      },
    }),
    establishSession: builder.mutation<AuthResponse, { token?: string } | void>({
      query: (arg) => ({
        url: '/auth/establish-session',
        method: 'POST',
        headers:
          arg && typeof arg === 'object' && arg.token
            ? { authorization: `Bearer ${arg.token}` }
            : undefined,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.isSuccess && data.data?.user) {
            dispatch(setCredentials({ user: data.data.user }));
          }
        } catch {
          // Error handled in component
        }
      },
    }),
    exitImpersonation: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/exit-impersonation',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.isSuccess && data.data?.user) {
            dispatch(setCredentials({ user: data.data.user }));
          }
        } catch {
          // Error handled in component
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSetPasswordMutation,
  useResendVerificationMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useExchangeOAuthCodeMutation,
  useEstablishSessionMutation,
  useExitImpersonationMutation,
} = authApi;

