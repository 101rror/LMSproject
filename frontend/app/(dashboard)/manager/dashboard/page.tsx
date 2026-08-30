'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';

export default function ManagerDashboardPage() {
    return (
        <DashboardLayout>
            <StudentDashboard />
        </DashboardLayout>
    );
}
