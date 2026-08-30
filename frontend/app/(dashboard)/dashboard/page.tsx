'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { InstructorDashboard } from '@/components/dashboard/InstructorDashboard';
import { ContentManagerDashboard } from '@/components/dashboard/ContentManagerDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ROLE_ROUTES } from '@/lib/auth/roles';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.replace(ROLE_ROUTES.admin);
        return;
      }
      if (user.role === 'content_manager') {
        router.replace(ROLE_ROUTES.content_manager);
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Admins and manager/content-manager users are redirected to their role-specific dashboard
  if (user.role === 'admin' || user.role === 'content_manager') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      {user.role === 'student' && <StudentDashboard />}
      {user.role === 'instructor' && <InstructorDashboard />}
    </DashboardLayout>
  );
}
