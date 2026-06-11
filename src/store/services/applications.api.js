import { baseApi } from "./baseApi";

export const applicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    applyScheme: builder.mutation({
      query: (payload) => ({
        url: "/applications",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Applications", "Dashboard", "Notifications"],
    }),
    getMyApplications: builder.query({
      query: () => "/applications/my-applications",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Applications", id: _id })),
              { type: "Applications", id: "MY_LIST" },
            ]
          : [{ type: "Applications", id: "MY_LIST" }],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
    getApplicationById: builder.query({
      query: (id) => `/applications/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Applications", id }],
      transformResponse: (response) => response?.data ?? response,
    }),
    getApplicationTimeline: builder.query({
      query: (applicationId) =>
        `/application-tracking/${applicationId}/timeline`,
      providesTags: (_result, _error, applicationId) => [
        { type: "Applications", id: `TIMELINE_${applicationId}` },
      ],
      transformResponse: (response) => response?.data ?? response,
    }),
  }),
});

export const {
  useApplySchemeMutation,
  useGetMyApplicationsQuery,
  useLazyGetMyApplicationsQuery,
  useGetApplicationByIdQuery,
  useLazyGetApplicationByIdQuery,
  useGetApplicationTimelineQuery,
  useLazyGetApplicationTimelineQuery,
} = applicationsApi;
