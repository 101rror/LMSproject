import { apiFetch, setToken, setUser, removeToken, getToken, getStoredUser } from './client';
import type { AuthResponse, StrapiUser, SessionUser, UserRole } from '@/types/user';
import { normalizeRole } from '@/lib/auth/roles';

export async function login(email: string, password: string): Promise<SessionUser> {
  const data = await apiFetch<AuthResponse>('/api/auth/local', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ identifier: email, password }),
  });

  setToken(data.jwt);
  const sessionUser = toSessionUser(data.user);
  setUser(sessionUser);
  return sessionUser;
}

export async function register(username: string, email: string, password: string): Promise<SessionUser> {
  const data = await apiFetch<AuthResponse>('/api/auth/local/register', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ username, email, password }),
  });

  setToken(data.jwt);
  const sessionUser = toSessionUser(data.user);
  setUser(sessionUser);
  return sessionUser;
}

export async function fetchCurrentUser(): Promise<SessionUser | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const data = await apiFetch<StrapiUser>('/api/users/me', {
      params: { populate: 'role' },
    });
    const sessionUser = toSessionUser(data);
    setUser(sessionUser);
    return sessionUser;
  } catch {
    removeToken();
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // ignore network errors on logout
  }
  removeToken();
}

export function getStoredSession(): SessionUser | null {
  return getStoredUser<SessionUser>();
}

export function hasToken(): boolean {
  return !!getToken();
}

function toSessionUser(user: StrapiUser): SessionUser {
  let rawRole: string | undefined;
  if (Array.isArray(user.role)) {
    rawRole = user.role[0]?.type || user.role[0]?.name;
  } else {
    rawRole = user.role?.type || user.role?.name;
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: normalizeRole(rawRole),
    rawRole,
  };
}
