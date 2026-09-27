// Small fetch wrapper for the admin panel.
// Auth is handled by the httpOnly cookie, so every request sends credentials.

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function adminFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(isFormData || !init.body ? {} : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || (data && data.success === false)) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return (data?.data ?? data) as T;
}

export const isImageUrl = (value?: string) =>
  !!value && (value.startsWith("http") || value.startsWith("/") || value.startsWith("blob:") || value.startsWith("data:"));
