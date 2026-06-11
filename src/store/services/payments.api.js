import { baseApi } from "./baseApi";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: () => "/payments",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Payments", id: _id })),
              { type: "Payments", id: "LIST" },
            ]
          : [{ type: "Payments", id: "LIST" }],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
    getPaymentById: builder.query({
      query: (paymentId) => `/payments/${paymentId}`,
      providesTags: (_result, _error, paymentId) => [
        { type: "Payments", id: paymentId },
      ],
      transformResponse: (response) => response?.data ?? response,
    }),
    releasePayment: builder.mutation({
      query: (applicationId) => ({
        url: `/payments/release/${applicationId}`,
        method: "POST",
      }),
      invalidatesTags: ["Payments", "Applications", "Dashboard"],
    }),
    getPaymentsAnalytics: builder.query({
      query: () => "/payments/analytics",
      providesTags: [{ type: "Payments", id: "ANALYTICS" }],
      transformResponse: (response) => response?.data ?? response,
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useLazyGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useReleasePaymentMutation,
  useGetPaymentsAnalyticsQuery,
  useLazyGetPaymentsAnalyticsQuery,
} = paymentsApi;
