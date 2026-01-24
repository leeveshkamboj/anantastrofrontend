import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/lib/config';

const baseUrl = config.apiBaseUrl;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Set auth token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
    validateStatus: (response, result) => {
      // Consider 201 as success
      return response.status < 300 || response.status === 201;
    },
  }),
  tagTypes: ['User', 'Auth', 'AstrologerRequests', 'Admin'],
  endpoints: () => ({}), // No endpoints here - they will be injected by feature APIs
});

