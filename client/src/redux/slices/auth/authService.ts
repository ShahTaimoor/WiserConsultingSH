// src/features/auth/authService.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  role?: number;
  phone?: string;
  address?: string;
  city?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

export interface GoogleLoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Safely derive the base URL for the health check.
 * Uses URL constructor to avoid the broken .replace('/api','') approach
 * which breaks URLs where the domain doesn't end with /api.
 */
const getBaseUrl = (): string => {
  try {
    const url = new URL(API_URL);
    return `${url.protocol}//${url.host}`;
  } catch {
    // Fallback for relative/malformed URLs
    return API_URL.replace(/\/api.*$/, '');
  }
};

// ✅ Test backend connection
const testConnection = async (): Promise<boolean> => {
  try {
    const baseUrl = getBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

// ✅ Login request
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Health check is non-blocking: a failed ping is just a warning,
    // not an error. The actual login request will fail with a proper
    // message if the server is truly unreachable.
    const isConnected = await testConnection();
    if (!isConnected) {

    }

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }

    const responseData = await response.json();
    const user = responseData.data?.user || responseData.user;
    const token = responseData.data?.token || responseData.token;

    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    }

    return {
      success: responseData.success || true,
      message: responseData.message,
      user,
      token,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// ✅ Register request
export const registerUser = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || 'Registration failed');
    }

    const data: RegisterResponse = await res.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// ✅ Google OAuth login
export const googleLogin = async (accessToken: string): Promise<GoogleLoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/google/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
      throw new Error(errorData.message || 'Authentication failed');
    }

    const responseData = await response.json();
    const user = responseData.data?.user || responseData.user;
    const token = responseData.data?.token || responseData.token;

    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    }

    return {
      success: responseData.success || true,
      message: responseData.message,
      user,
      token,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// ✅ Forgot password - sends reset email
export const forgotPasswordRequest = async (email: string): Promise<ForgotPasswordResponse> => {
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset email');
    }

    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server.');
    }
    throw error;
  }
};

// ✅ Reset password - sets new password using token
export const resetPasswordRequest = async (token: string, password: string): Promise<ResetPasswordResponse> => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }

    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server.');
    }
    throw error;
  }
};
