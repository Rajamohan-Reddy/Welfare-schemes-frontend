import axios from "axios";
import { toast } from "react-hot-toast";

import { clearAuthStorage, getAccessToken } from "../utils/storage";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthStorage();
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export const API_BASE_URL = baseURL;

export default api;
