import { useSelector, useDispatch } from "react-redux";
import {
  setCredentials,
  logout as logoutAction,
  updateUserProfile,
} from "../store/slices/auth.slice";
import { useLogoutMutation } from "../store/services/auth.api";
import { baseApi } from "../store/services/baseApi";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [logoutMutation] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Clear client state even if server logout fails
    } finally {
      dispatch(logoutAction());
      dispatch(baseApi.util.resetApiState());
    }
  };

  const setUser = (user) => {
    dispatch(setCredentials(user));
  };

  const patchUser = (updates) => {
    dispatch(updateUserProfile(updates));
  };

  return {
    user: auth.user,
    role: auth.role,
    permissions: auth.permissions,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    initialized: auth.initialized,
    logout,
    setUser,
    patchUser,
  };
};

export default useAuth;
