import { apiFetch } from './client';
import { fetchEnrollments as fetchAllEnrollments } from './enrollments';
import type { StrapiUser, UserRole } from '@/types/user';

export const fetchEnrollments = fetchAllEnrollments;

interface StrapiListResponse<T> {
  data: T[];
  meta?: { pagination?: { total: number } };
}

export async function fetchUsers(): Promise<StrapiUser[]> {
  const data = await apiFetch<StrapiUser[]>('/api/users', {
    params: { populate: 'role' },
  });
  return Array.isArray(data) ? data : [];
}

export async function fetchUser(id: number): Promise<StrapiUser | null> {
  const data = await apiFetch<StrapiUser>(`/api/users/${id}`, {
    params: { populate: 'role' },
  });
  return data;
}

interface UpdateUserData {
  role?: number;
}

export async function updateUserRole(userId: number, roleId: number): Promise<StrapiUser> {
  const data = await apiFetch<StrapiUser>(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ role: roleId } as UpdateUserData),
  });
  return data;
}

export async function fetchRoles(): Promise<{ id: number; name: string; type: string }[]> {
  const data = await apiFetch<{ id: number; name: string; type: string }[]>('/api/users-permissions/roles');
  return Array.isArray(data) ? data : [];
}

export function getUserRoleName(user: StrapiUser): string {
  if (Array.isArray(user.role)) {
    return user.role[0]?.name || 'Unknown';
  }
  return user.role?.name || 'Unknown';
}

export function getUserRoleType(user: StrapiUser): UserRole {
  let raw: string | undefined;
  if (Array.isArray(user.role)) {
    raw = user.role[0]?.type || user.role[0]?.name;
  } else {
    raw = user.role?.type || user.role?.name;
  }
  const r = (raw || '').toLowerCase();
  if (r === 'admin' || r === 'super_admin' || r.includes('admin')) return 'admin';
  if (r.includes('content') || r.includes('manager')) return 'content_manager';
  if (r.includes('instructor') || r.includes('teacher')) return 'instructor';
  return 'student';
}
