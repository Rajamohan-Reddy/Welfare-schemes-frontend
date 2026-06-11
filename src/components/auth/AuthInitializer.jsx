import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { API_BASE_URL } from "../../store/services/baseApi";
import {
  setCredentials,
  setInitialized,
  logout,
} from "../../store/slices/auth.slice";

async function fetchWithCredentials(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  return json?.data ?? json;
}

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        const refreshResponse = await fetch(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (!refreshResponse.ok) {
          if (!cancelled) {
            dispatch(logout());
          }
          return;
        }

        let user = await fetchWithCredentials(`${API_BASE_URL}/auth/me`);

        if (!user) {
          if (!cancelled) {
            dispatch(logout());
          }
          return;
        }

        try {
          const profile = await fetchWithCredentials(`${API_BASE_URL}/profile/me`);
          if (!cancelled && profile?.profileImage) {
            user = { ...user, profileImage: profile.profileImage };
          }
        } catch {
          // Profile fetch is optional during init
        }

        if (!cancelled) {
          dispatch(setCredentials(user));
        }
      } catch {
        if (!cancelled) {
          dispatch(logout());
        }
      } finally {
        if (!cancelled) {
          dispatch(setInitialized(true));
        }
      }
    };

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return children;
}

export default AuthInitializer;
