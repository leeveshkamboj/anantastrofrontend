import { baseApi } from './baseApi';

export interface AstrologerRequest {
  id: number;
  userId: number;
  aadharCard: string;
  panCard: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionNote?: string;
  canReapply: boolean;
  bio?: string;
  yearsOfExperience?: number;
  education?: string;
  languages?: string;
  expertise?: string;
  customExpertise?: string;
  consultationFee?: number;
  preferredHours?: string;
  createdAt: string;
  updatedAt: string;
  aadharCardUrl?: string;
  panCardUrl?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AstrologerRequestResponse {
  isSuccess: boolean;
  data: AstrologerRequest;
}

export interface AstrologerRequestsResponse {
  isSuccess: boolean;
  data: AstrologerRequest[];
}

export interface UploadResponse {
  isSuccess: boolean;
  data: {
    uuid: string;
    url: string;
  };
}

export interface CreateAstrologerRequestData {
  aadharCardUuid: string;
  panCardUuid: string;
  bio: string;
  yearsOfExperience: number;
  education: string;
  languages: string;
  expertise: string[];
  customExpertise?: string;
  consultationFee: number;
  preferredHours: string;
}

export const astrologerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<UploadResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Auth'],
    }),
    createAstrologerRequest: builder.mutation<AstrologerRequestResponse, CreateAstrologerRequestData>({
      query: (data) => ({
        url: '/astrologer-requests',
        method: 'POST',
        body: {
          aadharCardUuid: data.aadharCardUuid,
          panCardUuid: data.panCardUuid,
          bio: data.bio,
          yearsOfExperience: data.yearsOfExperience?.toString(),
          education: data.education,
          languages: data.languages,
          expertise: JSON.stringify(data.expertise),
          customExpertise: data.customExpertise,
          consultationFee: data.consultationFee?.toString(),
          preferredHours: data.preferredHours,
        },
      }),
      transformResponse: (response: any, meta) => {
        // Handle both response formats
        if (meta?.response?.status === 201) {
          // If backend returns the request directly, wrap it
          if (response && !response.isSuccess) {
            return {
              isSuccess: true,
              data: response,
            };
          }
        }
        return response;
      },
      invalidatesTags: ['AstrologerRequests', 'Auth'],
    }),
    getAstrologerRequests: builder.query<AstrologerRequestsResponse, void>({
      query: () => '/astrologer-requests',
      providesTags: ['AstrologerRequests', 'Auth'],
    }),
    getMyAstrologerRequest: builder.query<AstrologerRequestResponse, void>({
      query: () => '/astrologer-requests/my-request',
      providesTags: ['AstrologerRequests', 'Auth'],
    }),
    getAstrologerRequest: builder.query<AstrologerRequestResponse, number>({
      query: (id) => `/astrologer-requests/${id}`,
      providesTags: ['AstrologerRequests', 'Auth'],
    }),
    approveAstrologerRequest: builder.mutation<AstrologerRequestResponse, number>({
      query: (id) => ({
        url: `/astrologer-requests/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['AstrologerRequests', 'Auth'],
    }),
    rejectAstrologerRequest: builder.mutation<
      AstrologerRequestResponse,
      { id: number; rejectionNote: string }
    >({
      query: ({ id, rejectionNote }) => ({
        url: `/astrologer-requests/${id}/reject`,
        method: 'POST',
        body: { rejectionNote },
      }),
      invalidatesTags: ['AstrologerRequests', 'Auth'],
    }),
    allowReapply: builder.mutation<AstrologerRequestResponse, number>({
      query: (id) => ({
        url: `/astrologer-requests/${id}/allow-reapply`,
        method: 'POST',
      }),
      invalidatesTags: ['AstrologerRequests', 'Auth'],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useCreateAstrologerRequestMutation,
  useGetAstrologerRequestsQuery,
  useGetMyAstrologerRequestQuery,
  useGetAstrologerRequestQuery,
  useApproveAstrologerRequestMutation,
  useRejectAstrologerRequestMutation,
  useAllowReapplyMutation,
} = astrologerApi;
