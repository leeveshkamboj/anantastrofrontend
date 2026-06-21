import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/lib/config';

const baseUrl = config.apiBaseUrl;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => headers,
    validateStatus: (response, result) => {
      // Consider 201 as success
      return response.status < 300 || response.status === 201;
    },
  }),
  tagTypes: ['User', 'Auth', 'AstrologerRequests', 'Admin', 'AstrologerProfile', 'AstrologerProfiles', 'Languages', 'ExpertiseTags', 'Notifications', 'Currencies', 'Timezones', 'Kundlis', 'KundliGeneration', 'MatchmakingReport', 'HoroscopeReport', 'Coins', 'CoinPlans', 'AdminCoins', 'Chat', 'AdminChat'],
  endpoints: () => ({}), // No endpoints here - they will be injected by feature APIs
});

