const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

function buildUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  }
  return url.toString();
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async get<T>(path: string, options?: FetchOptions): Promise<T> {
    const res = await fetch(buildUrl(path, options?.params), {
      method: "GET",
      headers: { "Content-Type": "application/json", ...getAuthHeaders(), ...options?.headers },
      credentials: "include",
      ...options,
    });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const isFormData = body instanceof FormData;
    const res = await fetch(buildUrl(path, options?.params), {
      method: "POST",
      headers: isFormData ? { ...getAuthHeaders(), ...options?.headers } as HeadersInit : { "Content-Type": "application/json", ...getAuthHeaders(), ...options?.headers },
      credentials: "include",
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
      ...options,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const isFormData = body instanceof FormData;
    const res = await fetch(buildUrl(path, options?.params), {
      method: "PUT",
      headers: isFormData ? { ...getAuthHeaders(), ...options?.headers } as HeadersInit : { "Content-Type": "application/json", ...getAuthHeaders(), ...options?.headers },
      credentials: "include",
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
      ...options,
    });
    return handleResponse<T>(res);
  },

  async delete<T>(path: string, options?: FetchOptions): Promise<T> {
    const res = await fetch(buildUrl(path, options?.params), {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...getAuthHeaders(), ...options?.headers },
      credentials: "include",
      ...options,
    });
    return handleResponse<T>(res);
  },
};
