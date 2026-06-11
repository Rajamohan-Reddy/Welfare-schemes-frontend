import { createSlice } from "@reduxjs/toolkit";

const ROLE_PERMISSIONS = {
  CITIZEN: {
    canBrowseSchemes: true,
    canApply: true,
    canTrackApplications: true,
  },
  OFFICER: {
    canVerify: true,
    canReviewApplications: true,
  },
  ADMIN: {
    canManageStaff: true,
    canManageSchemes: true,
    canManagePayments: true,
    canViewReports: true,
  },
};

const initialState = {
  user: null,
  role: null,
  permissions: {},
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const user = action.payload;
      state.user = user;
      state.isAuthenticated = !!user;
      state.role = user?.role || null;
      state.permissions = user?.role
        ? ROLE_PERMISSIONS[user.role] || {}
        : {};
      state.error = null;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.permissions = {};
      state.isAuthenticated = false;
      state.error = null;
    },
    setInitialized(state, action) {
      state.initialized = action.payload;
    },
    updateUserProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setCredentials,
  setLoading,
  setError,
  clearError,
  logout,
  setInitialized,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
