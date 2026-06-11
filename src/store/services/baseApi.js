import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-hot-toast";

import { logout } from "../slices/auth.slice";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { endpoint }) => {
    if (endpoint === "uploadFile") {
      headers.delete("Content-Type");
      return headers;
    }
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

const AUTH_SKIP_REFRESH = ["/auth/login", "/auth/register", "/auth/refresh-token"];

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "string" ? args : args?.url;

  if (
    result.error?.status === 401 &&
    requestUrl &&
    !AUTH_SKIP_REFRESH.includes(requestUrl)
  ) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else if (requestUrl !== "/auth/me") {
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
      toast.error("Session expired. Please login again.");
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
  tagTypes: [
    "Auth",
    "Profile",
    "Schemes",
    "Applications",
    "Verifications",
    "Payments",
    "Users",
    "Notifications",
    "Dashboard",
    "Reports",
    "AuditLogs",
  ],
});

export default baseApi;
