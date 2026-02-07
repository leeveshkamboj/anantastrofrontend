import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/lib/config';
import type { RootState } from '../store';

const baseUrl = config.apiBaseUrl;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state instead of localStorage
      const state = getState() as RootState;
      const token = state.auth.token;
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
  tagTypes: ['User', 'Auth', 'AstrologerRequests', 'Admin', 'AstrologerProfile', 'AstrologerProfiles', 'Languages', 'ExpertiseTags', 'Notifications', 'Currencies', 'Timezones', 'Kundlis', 'KundliGeneration'],
  endpoints: () => ({}), // No endpoints here - they will be injected by feature APIs
});

