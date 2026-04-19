import { baseApi } from './baseApi';

export type ChatContentType = 'text' | 'image' | 'video';

export type ChatAstrologer = {
  id: number;
  userId: number;
  displayName: string;
  slug: string;
  persona: string | null;
  specialties: string[] | null;
  systemPrompt: string;
  coinsPerMinute: number;
  avatarUrl: string | null;
  maxResponseDelayMs: number;
  isActive: boolean;
  user?: { id: number; name: string; email: string; profileImage?: string | null };
};

export type ChatSession = {
  id: number;
  uuid: string;
  userId: number;
  aiAstrologerId: number;
  kundliProfileId: number;
  status: 'active' | 'paused' | 'ended';
  startedAt: string;
  endedAt: string | null;
  billedSeconds: number;
  nextBillAt: string;
  totalCoinsDebited: number;
  aiAstrologer?: ChatAstrologer;
};

export type ChatMessage = {
  id: number;
  sessionId: number;
  senderType: 'user' | 'astrologer' | 'system';
  senderId: number | null;
  contentType: 'text' | 'image' | 'video' | 'system';
  text: string | null;
  mediaId: number | null;
  createdAt: string;
  media?: { id: number; filePath?: string; mimeType?: string; fileName?: string } | null;
};

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatAstrologers: builder.query<{ isSuccess: boolean; data: ChatAstrologer[] }, void>({
      query: () => '/chat/astrologers',
      providesTags: ['Chat'],
    }),
    startChatSession: builder.mutation<
      { isSuccess: boolean; data: ChatSession },
      { aiAstrologerId: number; kundliProfileId: number }
    >({
      query: (body) => ({ url: '/chat/sessions', method: 'POST', body }),
      invalidatesTags: ['Chat'],
    }),
    getMyChatSessions: builder.query<{ isSuccess: boolean; data: ChatSession[] }, void>({
      query: () => '/chat/sessions',
      providesTags: ['Chat'],
    }),
    getChatSessionDetails: builder.query<{ isSuccess: boolean; data: ChatSession }, { sessionUuid: string }>({
      query: ({ sessionUuid }) => `/chat/sessions/${sessionUuid}`,
      providesTags: (_r, _e, arg) => [{ type: 'Chat', id: `session-${arg.sessionUuid}` }],
    }),
    endChatSession: builder.mutation<{ isSuccess: boolean; data: ChatSession }, { sessionUuid: string }>({
      query: ({ sessionUuid }) => ({ url: `/chat/sessions/${sessionUuid}/end`, method: 'POST' }),
      invalidatesTags: ['Chat'],
    }),
    getChatMessages: builder.query<{ isSuccess: boolean; data: ChatMessage[] }, { sessionUuid: string }>({
      query: ({ sessionUuid }) => `/chat/sessions/${sessionUuid}/messages`,
      providesTags: (_r, _e, arg) => [{ type: 'Chat', id: `messages-${arg.sessionUuid}` }],
    }),
    sendChatMessage: builder.mutation<
      { isSuccess: boolean; data: ChatMessage },
      { sessionUuid: string; contentType: ChatContentType; text?: string; mediaId?: number }
    >({
      query: ({ sessionUuid, ...body }) => ({
        url: `/chat/sessions/${sessionUuid}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Chat', id: `messages-${arg.sessionUuid}` },
        { type: 'Chat', id: `session-${arg.sessionUuid}` },
        'Chat',
        'Coins',
      ],
    }),
    getAdminChatAstrologers: builder.query<{ isSuccess: boolean; data: ChatAstrologer[] }, void>({
      query: () => '/admin/chat/astrologers',
      providesTags: ['AdminChat'],
    }),
    createAdminChatAstrologer: builder.mutation<{ isSuccess: boolean; data: ChatAstrologer }, Partial<ChatAstrologer> & { userId: number; displayName: string; slug: string; systemPrompt: string; coinsPerMinute: number }>({
      query: (body) => ({ url: '/admin/chat/astrologers', method: 'POST', body }),
      invalidatesTags: ['AdminChat', 'Chat'],
    }),
    updateAdminChatAstrologer: builder.mutation<
      { isSuccess: boolean; data: ChatAstrologer },
      { id: number; body: Partial<ChatAstrologer> }
    >({
      query: ({ id, body }) => ({ url: `/admin/chat/astrologers/${id}`, method: 'PUT', body }),
      invalidatesTags: ['AdminChat', 'Chat'],
    }),
    deleteAdminChatAstrologer: builder.mutation<{ isSuccess: boolean; data: { id: number } }, { id: number }>({
      query: ({ id }) => ({ url: `/admin/chat/astrologers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['AdminChat', 'Chat'],
    }),
  }),
});

export const {
  useGetChatAstrologersQuery,
  useStartChatSessionMutation,
  useGetMyChatSessionsQuery,
  useGetChatSessionDetailsQuery,
  useEndChatSessionMutation,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useGetAdminChatAstrologersQuery,
  useCreateAdminChatAstrologerMutation,
  useUpdateAdminChatAstrologerMutation,
  useDeleteAdminChatAstrologerMutation,
} = chatApi;
