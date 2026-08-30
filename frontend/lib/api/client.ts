const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.VERCEL_ENV ? '' : 'http://localhost:1337');

const TOKEN_KEY = 'cps_jwt_token';
const USER_KEY = 'cps_user_data';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setUser(user: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser<T>(): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export interface ApiOptions extends RequestInit {
  auth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { auth = true, params, ...init } = options;

  let url = `${API_URL}${path}`;
  if (params) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        search.append(key, String(value));
      }
    }
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init.headers as Record<string, string>) || {}),
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    removeToken();
  }

  if (!res.ok) {
    let errorData: { error?: { message?: string; details?: unknown } };
    try {
      errorData = await res.json();
    } catch {
      throw new ApiError(res.status, 'Network error');
    }
    const message =
      errorData?.error?.message || `Request failed (${res.status})`;
    throw new ApiError(res.status, message, errorData?.error?.details);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export class ApiError extends Error {
  details?: unknown;
  constructor(
    public status: number,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
  }
}

export function hasToken(): boolean {
  return !!getToken();
}

export function getStoredSession<T>(): T | null {
  return getStoredUser<T>();
}

export { API_URL };
