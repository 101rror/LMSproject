import type { UserRole } from '@/types/user';

export function normalizeRole(rawRole: string | undefined): UserRole {
  if (!rawRole) return 'student';

  const r = rawRole.toLowerCase();

  if (r === 'admin' || r === 'super_admin' || r.includes('admin')) {
    return 'admin';
  }
  if (r.includes('content') || r.includes('manager')) {
    return 'content_manager';
  }
  if (r.includes('instructor') || r.includes('teacher')) {
    return 'instructor';
  }
  return 'student';
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  content_manager: 'Content Manager',
  instructor: 'Instructor',
  student: 'Student',
};

export const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/admin',
  content_manager: '/manager/dashboard',
  instructor: '/dashboard',
  student: '/dashboard',
};

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin';
}

export function canManageBlog(role: UserRole): boolean {
  return role === 'admin' || role === 'content_manager';
}

export function canManageCourses(role: UserRole): boolean {
  return role === 'admin' || role === 'content_manager' || role === 'instructor';
}

export function canCreateCourse(role: UserRole): boolean {
  return canManageCourses(role);
}

export function canEditCourse(
  role: UserRole,
  courseOwnerId?: number | null,
  currentUserId?: number | null
): boolean {
  if (role === 'admin' || role === 'content_manager') return true;
  if (role === 'instructor') return Boolean(currentUserId) && (!courseOwnerId || courseOwnerId === currentUserId);
  return false;
}

export function canDeleteCourse(
  role: UserRole,
  courseOwnerId?: number | null,
  currentUserId?: number | null
): boolean {
  return canEditCourse(role, courseOwnerId, currentUserId);
}

export function canManageLessons(role: UserRole): boolean {
  return role === 'admin' || role === 'content_manager' || role === 'instructor';
}

export function canManageQuizzes(role: UserRole): boolean {
  return role === 'admin' || role === 'content_manager' || role === 'instructor';
}

export function canViewAllProgress(role: UserRole): boolean {
  return role === 'admin' || role === 'content_manager';
}

export function canViewOwnProgress(role: UserRole): boolean {
  return role === 'instructor';
}

export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}
