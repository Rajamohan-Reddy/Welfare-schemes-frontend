import { baseApi } from "./baseApi";

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query({
      query: (params = {}) => ({
        url: "/audit-logs",
        params,
      }),
      providesTags: ["AuditLogs"],
      transformResponse: (response) => response?.data ?? response,
    }),
    getRecentAuditLogs: builder.query({
      query: () => "/audit-logs/recent",
      providesTags: [{ type: "AuditLogs", id: "RECENT" }],
      transformResponse: (response) => response?.data ?? response,
    }),
    getApplicationAuditLogs: builder.query({
      query: (applicationId) => `/applications/${applicationId}/audit-logs`,
      providesTags: (_result, _error, applicationId) => [
        { type: "AuditLogs", id: applicationId },
      ],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
  useLazyGetAuditLogsQuery,
  useGetRecentAuditLogsQuery,
  useGetApplicationAuditLogsQuery,
} = reportsApi;
