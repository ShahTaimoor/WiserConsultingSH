// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, googleLogin, forgotPasswordRequest, resetPasswordRequest, LoginResponse, RegisterResponse, GoogleLoginResponse, ForgotPasswordResponse, ResetPasswordResponse, User } from "./authService";
import { handleApiError } from "@/utils/apiError";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const userFromStorage =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  loading: false,
  error: null,
  success: null,
};

// ✅ Thunks
export const login = createAsyncThunk<LoginResponse, { email: string; password: string }, { rejectValue: string }>(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      return await loginUser(email, password);
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(handleApiError(err, 'Login failed'));
    }
  }
);

export const register = createAsyncThunk<RegisterResponse, { name: string; email: string; password: string }, { rejectValue: string }>(
  "auth/register",
  async ({ name, email, password }, thunkAPI) => {
    try {
      return await registerUser(name, email, password);
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(handleApiError(err, 'Registration failed'));
    }
  }
);

export const googleAuth = createAsyncThunk<GoogleLoginResponse, string, { rejectValue: string }>(
  "auth/google",
  async (accessToken, thunkAPI) => {
    try {
      return await googleLogin(accessToken);
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(handleApiError(err, 'Google authentication failed'));
    }
  }
);

export const forgotPassword = createAsyncThunk<ForgotPasswordResponse, string, { rejectValue: string }>(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      return await forgotPasswordRequest(email);
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(handleApiError(err, 'Failed to send reset email'));
    }
  }
);

export const resetPassword = createAsyncThunk<ResetPasswordResponse, { token: string; password: string }, { rejectValue: string }>(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      return await resetPasswordRequest(token, password);
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(handleApiError(err, 'Failed to reset password'));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.success = "Login successful!";
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Fulfilled cases
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.success = "Login successful!";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Registration successful!";
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.success = "Google login successful!";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Reset email sent!';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Password reset successfully!';
      })
      // Shared Matchers
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action: import('@reduxjs/toolkit').PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload || "An error occurred";
        }
      );
  },
});

export const { logout, setUser, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
