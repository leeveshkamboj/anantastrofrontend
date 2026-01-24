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
      providesTags: ['Admin'],
    }),
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => '/admin/users',
      providesTags: ['Admin', 'User'],
    }),
    getUser: builder.query<UserResponse, number>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin', 'User'],
    }),
    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin', 'User'],
    }),
  }),
});

export const { 
  useGetDashboardStatsQuery, 
  useGetAllUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApi;
