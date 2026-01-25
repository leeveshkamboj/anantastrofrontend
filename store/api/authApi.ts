import { baseApi } from './baseApi';
import { setCredentials, setUser, logout as logoutAction } from '../slices/authSlice';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthData {
  access_token: string;
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

export interface User {
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

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.isSuccess && data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                token: data.data.access_token,
              })
            );
            // Trigger profile refetch to ensure state is fully updated
            dispatch(authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true }));
          }
        } catch {
          // Error handling is done by the mutation hook
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
          if (data.isSuccess && data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                token: data.data.access_token,
              })
            );
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
          // If profile fetch fails with 401, user is not authenticated
          if (error?.status === 401 || error?.status === 'FETCH_ERROR') {
            dispatch(logoutAction());
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
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = authApi;

