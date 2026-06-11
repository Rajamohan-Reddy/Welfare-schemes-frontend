import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOfficerDashboard: builder.query({
      query: () => "/dashboard/officer",
      providesTags: ["Dashboard"],
      transformResponse: (response) => response?.data ?? response,
    }),
    getAdminDashboard: builder.query({
      query: () => "/dashboard/admin",
      providesTags: ["Dashboard"],
      transformResponse: (response) => response?.data ?? response,
    }),
    getCitizenDashboard: builder.query({
      query: () => "/dashboard/citizen",
      providesTags: ["Dashboard"],
      transformResponse: (response) => response?.data ?? response,
    }),
    getApplicationStatusChart: builder.query({
      query: () => "/dashboard/application-status-chart",
      providesTags: ["Dashboard"],
      transformResponse: (response) => response?.data ?? response,
    }),
    getMonthlyApplicationsChart: builder.query({
      query: () => "/dashboard/monthly-applications-chart",
      providesTags: ["Dashboard"],
      transformResponse: (response) => response?.data ?? response,
    }),
    getSchemeWiseApplications: builder.query({
      query: () => "/dashboard/scheme-wise-applications",
      providesTags: ["Dashboard"],
      transformResponse: (response) => response?.data ?? response,
    }),
    getDashboardAnalytics: builder.query({
      query: () => "/dashboard/analytics",
      providesTags: ["Dashboard"],
      transformResponse: (response) => response?.data ?? response,
    }),
  }),
});

export const {
  useGetOfficerDashboardQuery,
  useLazyGetOfficerDashboardQuery,
  useGetAdminDashboardQuery,
  useLazyGetAdminDashboardQuery,
  useGetCitizenDashboardQuery,
  useLazyGetCitizenDashboardQuery,
  useGetApplicationStatusChartQuery,
  useLazyGetApplicationStatusChartQuery,
  useGetMonthlyApplicationsChartQuery,
  useLazyGetMonthlyApplicationsChartQuery,
  useGetSchemeWiseApplicationsQuery,
  useLazyGetSchemeWiseApplicationsQuery,
  useGetDashboardAnalyticsQuery,
  useLazyGetDashboardAnalyticsQuery,
} = dashboardApi;
