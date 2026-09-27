// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
// Import your slices
import authReducer from "./slices/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// ✅ Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
