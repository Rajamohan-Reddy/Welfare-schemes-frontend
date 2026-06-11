import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import { baseApi } from "./services/baseApi";
import "./services/index";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;
