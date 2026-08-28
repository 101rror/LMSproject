'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

export default function AdminPage() {
  return (
    <DashboardLayout allowedRoles={['admin']}>
      <AdminDashboard />
    </DashboardLayout>
  );
}
