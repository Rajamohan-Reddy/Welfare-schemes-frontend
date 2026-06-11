import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query({
      query: () => "/auth/admins",
      providesTags: [{ type: "Users", id: "ADMINS" }],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
    getOfficers: builder.query({
      query: () => "/auth/officers",
      providesTags: [{ type: "Users", id: "OFFICERS" }],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
    createAdmin: builder.mutation({
      query: (payload) => ({
        url: "/auth/create-admin",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Users", id: "ADMINS" }],
    }),
    createOfficer: builder.mutation({
      query: (payload) => ({
        url: "/auth/create-officer",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Users", id: "OFFICERS" }],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/auth/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["Users"],
    }),
    getAllUsers: builder.query({
      query: (params = {}) => ({
        url: "/users",
        params,
      }),
      providesTags: [{ type: "Users", id: "ALL" }],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
    getApplicationsByStatus: builder.query({
      query: ({ status, page = 1, limit = 20 }) => ({
        url: "/admin/applications",
        params: { status, page, limit },
      }),
      providesTags: ["Applications"],
      transformResponse: (response) => response?.data ?? response,
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useLazyGetAdminsQuery,
  useGetOfficersQuery,
  useLazyGetOfficersQuery,
  useCreateAdminMutation,
  useCreateOfficerMutation,
  useUpdateUserStatusMutation,
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useGetApplicationsByStatusQuery,
  useLazyGetApplicationsByStatusQuery,
} = adminApi;
