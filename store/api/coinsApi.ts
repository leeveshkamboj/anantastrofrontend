import { baseApi } from './baseApi';

export type ServiceKey = 'kundli' | 'matchmaking' | 'horoscope';

export interface ServiceCoinCostRow {
  serviceKey: string;
  coinCost: number;
}

export interface CoinPlanPublic {
  id: number;
  name: string;
  coinQuantity: number;
  pricePaise: number;
  originalPricePaise: number | null;
  discountLabel: string | null;
  currency: string;
  sortOrder: number;
  costPerCoinPaise: number;
}

export interface WalletResponse {
  isSuccess: boolean;
  data: { balance: number };
}

export interface CreateOrderResponse {
  isSuccess: boolean;
  data: {
    orderId: string;
    amountPaise: number;
    currency: string;
    keyId: string;
    plan: { id: number; name: string; coinQuantity: number };
  };
}

export const coinsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceCoinCosts: builder.query<{ isSuccess: boolean; data: ServiceCoinCostRow[] }, void>({
      query: () => '/coins/service-costs',
      providesTags: ['Coins'],
    }),
    getCoinPlansPublic: builder.query<{ isSuccess: boolean; data: CoinPlanPublic[] }, void>({
      query: () => '/coins/plans',
      providesTags: ['CoinPlans'],
    }),
    getMyWallet: builder.query<WalletResponse, void>({
      query: () => '/coins/me/wallet',
      providesTags: ['Coins'],
    }),
    getMyCoinTransactions: builder.query<
      {
        isSuccess: boolean;
        data: {
          total: number;
          items: Array<{
            id: number;
            delta: number;
            balanceAfter: number;
            type: string;
            referenceType: string | null;
            referenceId: string | null;
            metadata: Record<string, unknown> | null;
            createdAt: string;
          }>;
        };
      },
      { limit?: number; offset?: number }
    >({
      query: (params) => ({
        url: '/coins/me/transactions',
        params: { limit: params.limit, offset: params.offset },
      }),
      providesTags: ['Coins'],
    }),
    getMyPaymentHistory: builder.query<
      {
        isSuccess: boolean;
        data: Array<{
          id: number;
          razorpayOrderId: string;
          amountPaise: number;
          currency: string;
          coinsToCredit: number;
          coinsCredited: number;
          status: string;
          createdAt: string;
        }>;
      },
      void
    >({
      query: () => '/coins/me/payments',
      providesTags: ['Coins'],
    }),
    createCoinCheckoutOrder: builder.mutation<CreateOrderResponse, { planId: number }>({
      query: (body) => ({
        url: '/coins/checkout/order',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Coins'],
    }),
    getAdminCoinSettings: builder.query<
      { isSuccess: boolean; data: { signupBonusCoins: number; defaultInrPerCoinPaise: number } },
      void
    >({
      query: () => '/admin/coins/settings',
      providesTags: ['AdminCoins'],
    }),
    patchAdminCoinSettings: builder.mutation<
      { isSuccess: boolean; data: { signupBonusCoins: number; defaultInrPerCoinPaise: number } },
      { signupBonusCoins?: number; defaultInrPerCoinPaise?: number }
    >({
      query: (body) => ({ url: '/admin/coins/settings', method: 'PATCH', body }),
      invalidatesTags: ['AdminCoins'],
    }),
    getAdminServiceCoinCosts: builder.query<
      { isSuccess: boolean; data: Array<{ id: number; serviceKey: string; coinCost: number }> },
      void
    >({
      query: () => '/admin/coins/service-costs',
      providesTags: ['AdminCoins', 'Coins'],
    }),
    putAdminServiceCoinCost: builder.mutation<
      { isSuccess: boolean; data: { id: number; serviceKey: string; coinCost: number } },
      { serviceKey: string; coinCost: number }
    >({
      query: ({ serviceKey, coinCost }) => ({
        url: `/admin/coins/service-costs/${encodeURIComponent(serviceKey)}`,
        method: 'PUT',
        body: { coinCost },
      }),
      invalidatesTags: ['AdminCoins', 'Coins'],
    }),
    getAdminCoinPlans: builder.query<
      {
        isSuccess: boolean;
        data: Array<{
          id: number;
          name: string;
          coinQuantity: number;
          pricePaise: number;
          originalPricePaise: number | null;
          discountLabel: string | null;
          currency: string;
          isActive: boolean;
          sortOrder: number;
        }>;
      },
      void
    >({
      query: () => '/admin/coins/plans',
      providesTags: ['AdminCoins', 'CoinPlans'],
    }),
    createAdminCoinPlan: builder.mutation<
      { isSuccess: boolean; data: unknown },
      {
        name: string;
        coinQuantity: number;
        pricePaise: number;
        originalPricePaise?: number;
        discountLabel?: string;
        currency?: string;
        isActive?: boolean;
        sortOrder?: number;
      }
    >({
      query: (body) => ({ url: '/admin/coins/plans', method: 'POST', body }),
      invalidatesTags: ['AdminCoins', 'CoinPlans'],
    }),
    patchAdminCoinPlan: builder.mutation<
      { isSuccess: boolean; data: unknown },
      { id: number; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({ url: `/admin/coins/plans/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['AdminCoins', 'CoinPlans'],
    }),
    deleteAdminCoinPlan: builder.mutation<{ isSuccess: boolean; data: { message: string } }, number>({
      query: (id) => ({ url: `/admin/coins/plans/${id}`, method: 'DELETE' }),
      invalidatesTags: ['AdminCoins', 'CoinPlans'],
    }),
    adminAdjustUserCoins: builder.mutation<
      { isSuccess: boolean; data: { balanceAfter: number } },
      { userId: number; delta: number; note?: string }
    >({
      query: ({ userId, delta, note }) => ({
        url: `/admin/coins/users/${userId}/adjust`,
        method: 'POST',
        body: { delta, note },
      }),
      invalidatesTags: ['AdminCoins', 'Coins', 'User'],
    }),
  }),
});

export const {
  useGetServiceCoinCostsQuery,
  useGetCoinPlansPublicQuery,
  useGetMyWalletQuery,
  useGetMyCoinTransactionsQuery,
  useGetMyPaymentHistoryQuery,
  useCreateCoinCheckoutOrderMutation,
  useGetAdminCoinSettingsQuery,
  usePatchAdminCoinSettingsMutation,
  useGetAdminServiceCoinCostsQuery,
  usePutAdminServiceCoinCostMutation,
  useGetAdminCoinPlansQuery,
  useCreateAdminCoinPlanMutation,
  usePatchAdminCoinPlanMutation,
  useDeleteAdminCoinPlanMutation,
  useAdminAdjustUserCoinsMutation,
} = coinsApi;
