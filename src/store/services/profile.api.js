import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => "/profile/me",
      providesTags: ["Profile"],
      transformResponse: (response) => response?.data ?? response,
    }),
    updateMyProfile: builder.mutation({
      query: (payload) => ({
        url: "/profile/me",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Profile", "Auth"],
      transformResponse: (response) => response?.data ?? response,
    }),
    updateMyProfileImage: builder.mutation({
      query: (profileImage) => ({
        url: "/profile/photo",
        method: "PATCH",
        body: { profileImage },
      }),
      invalidatesTags: ["Profile", "Auth"],
      transformResponse: (response) => response?.data ?? response,
    }),
    changeMyPassword: builder.mutation({
      query: (payload) => ({
        url: "/profile/change-password",
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useLazyGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateMyProfileImageMutation,
  useChangeMyPasswordMutation,
} = profileApi;
