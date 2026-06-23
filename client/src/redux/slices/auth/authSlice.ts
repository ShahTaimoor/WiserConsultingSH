// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, googleLogin, forgotPasswordRequest, resetPasswordRequest, LoginResponse, RegisterResponse, GoogleLoginResponse, ForgotPasswordResponse, ResetPasswordResponse, User } from "./authService";

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
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk<RegisterResponse, { name: string; email: string; password: string }, { rejectValue: string }>(
  "auth/register",
  async ({ name, email, password }, thunkAPI) => {
    try {
      return await registerUser(name, email, password);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const googleAuth = createAsyncThunk<GoogleLoginResponse, string, { rejectValue: string }>(
  "auth/google",
  async (accessToken, thunkAPI) => {
    try {
      return await googleLogin(accessToken);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google authentication failed';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const forgotPassword = createAsyncThunk<ForgotPasswordResponse, string, { rejectValue: string }>(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      return await forgotPasswordRequest(email);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const resetPassword = createAsyncThunk<ResetPasswordResponse, { token: string; password: string }, { rejectValue: string }>(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      return await resetPasswordRequest(token, password);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      return thunkAPI.rejectWithValue(errorMessage);
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
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.success = "Login successful!";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Registration successful!";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });

    // Google Auth
    builder
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.success = "Google login successful!";
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google authentication failed";
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Reset email sent!';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send reset email';
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Password reset successfully!';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reset password';
      });
  },
});

export const { logout, setUser, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
