import { baseApi } from './baseApi';

export interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalAstrologers: number;
  totalRegularUsers: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

export interface DashboardStatsResponse {
  isSuccess: boolean;
  data: DashboardStats;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
  role: 'user' | 'admin' | 'astrologer';
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  isSuccess: boolean;
  data: User[];
}

export interface UserResponse {
  isSuccess: boolean;
  data: User;
}

export interface UpdateUserRequest {
  id: number;
  data: {
    email?: string;
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    role?: 'user' | 'admin' | 'astrologer';
    currency?: string;
    timezone?: string;
  };
}

export interface UpdateUserResponse {
  isSuccess: boolean;
  data: User;
}

export interface DeleteUserResponse {
  isSuccess: boolean;
  data: {
    message: string;
  };
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Admin', 'Auth'],
    }),
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => '/admin/users',
      providesTags: ['Admin', 'User', 'Auth'],
    }),
    getUser: builder.query<UserResponse, number>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }, 'Auth'],
    }),
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin', 'User', 'Auth'],
    }),
    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin', 'User', 'Auth'],
    }),
  }),
});

// Re-export astrologer profile endpoints for admin
export {
  useGetAstrologerProfilesQuery,
  useGetAstrologerProfileQuery,
  useUpdateAstrologerProfileMutation,
  useActivateAstrologerMutation,
  useDeactivateAstrologerMutation,
  useApproveProfileMutation,
  useRejectProfileMutation,
  useApprovePricingMutation,
  useRejectPricingMutation,
} from './astrologerProfileApi';

export const { 
  useGetDashboardStatsQuery, 
  useGetAllUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApi;
