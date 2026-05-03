import { baseApi } from './baseApi';

export type TranslateApiResponse = {
  translatedText: string;
  cached: boolean;
  fallback: boolean;
};

export const translationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    translateText: builder.mutation<
      TranslateApiResponse,
      { text: string; source: string; target: string }
    >({
      query: (body) => ({
        url: '/translate',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useTranslateTextMutation } = translationApi;
