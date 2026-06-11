import { baseApi } from "./baseApi";

export const verificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingQueue: builder.query({
      query: () => "/verifications/pending",
      providesTags: [{ type: "Verifications", id: "PENDING" }],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
    getDocumentVerifiedQueue: builder.query({
      query: () => "/verifications/document-verified",
      providesTags: [{ type: "Verifications", id: "DOCUMENT_VERIFIED" }],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
    getFieldVerifiedQueue: builder.query({
      query: () => "/verifications/field-verified",
      providesTags: [{ type: "Verifications", id: "FIELD_VERIFIED" }],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
    documentVerify: builder.mutation({
      query: ({ applicationId, ...payload }) => ({
        url: `/verifications/${applicationId}/document-verify`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Verifications", "Applications", "Dashboard"],
    }),
    fieldVerify: builder.mutation({
      query: ({ applicationId, ...payload }) => ({
        url: `/verifications/${applicationId}/field-verify`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Verifications", "Applications", "Dashboard"],
    }),
    approveApplication: builder.mutation({
      query: ({ applicationId, ...payload }) => ({
        url: `/verifications/${applicationId}/approve`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Verifications", "Applications", "Dashboard", "Payments"],
    }),
    rejectApplication: builder.mutation({
      query: ({ applicationId, ...payload }) => ({
        url: `/verifications/${applicationId}/reject`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Verifications", "Applications", "Dashboard"],
    }),
  }),
});

export const {
  useGetPendingQueueQuery,
  useLazyGetPendingQueueQuery,
  useGetDocumentVerifiedQueueQuery,
  useLazyGetDocumentVerifiedQueueQuery,
  useGetFieldVerifiedQueueQuery,
  useLazyGetFieldVerifiedQueueQuery,
  useDocumentVerifyMutation,
  useFieldVerifyMutation,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
} = verificationApi;
