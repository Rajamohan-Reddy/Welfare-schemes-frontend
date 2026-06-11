import { baseApi } from "./baseApi";

export const schemesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchemes: builder.query({
      query: () => "/schemes",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Schemes", id: _id })),
              { type: "Schemes", id: "LIST" },
            ]
          : [{ type: "Schemes", id: "LIST" }],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
    getSchemeById: builder.query({
      query: (id) => `/schemes/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Schemes", id }],
      transformResponse: (response) => response?.data ?? response,
    }),
    getAllCategories: builder.query({
      query: () => "/scheme-categories",
      providesTags: [{ type: "Schemes", id: "CATEGORIES" }],
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
    createScheme: builder.mutation({
      query: (payload) => ({
        url: "/schemes",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Schemes", id: "LIST" }, "Dashboard"],
    }),
    updateScheme: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/schemes/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Schemes", id },
        { type: "Schemes", id: "LIST" },
      ],
    }),
    deleteScheme: builder.mutation({
      query: (id) => ({
        url: `/schemes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Schemes", id: "LIST" }, "Dashboard"],
    }),
    createSchemeCategory: builder.mutation({
      query: (payload) => ({
        url: "/scheme-categories",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Schemes", id: "CATEGORIES" }],
    }),
    updateSchemeCategory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/scheme-categories/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [{ type: "Schemes", id: "CATEGORIES" }],
    }),
    deleteSchemeCategory: builder.mutation({
      query: (id) => ({
        url: `/scheme-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Schemes", id: "CATEGORIES" }],
    }),
  }),
});

export const {
  useGetAllSchemesQuery,
  useLazyGetAllSchemesQuery,
  useGetSchemeByIdQuery,
  useLazyGetSchemeByIdQuery,
  useGetAllCategoriesQuery,
  useLazyGetAllCategoriesQuery,
  useCreateSchemeMutation,
  useUpdateSchemeMutation,
  useDeleteSchemeMutation,
  useCreateSchemeCategoryMutation,
  useUpdateSchemeCategoryMutation,
  useDeleteSchemeCategoryMutation,
} = schemesApi;
