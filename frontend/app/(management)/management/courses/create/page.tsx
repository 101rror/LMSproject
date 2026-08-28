'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCourseMutations } from '@/hooks/useCourses';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseForm } from '@/components/courses/CourseForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { create } = useCourseMutations();

  const handleSubmit = async (data: { title: string; description: string; short_description?: string; thumbnail_url?: string; price?: number }) => {
    const courseData: Record<string, unknown> = { ...data };
    if (user?.role === 'instructor') {
      courseData.instructor = user.id;
    }
    await create(courseData as never);
    router.push('/management/courses');
  };

  return (
    <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
      <div className="max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">Create Course</h1>
        <Card>
          <CardHeader><CardTitle className="text-lg">Course Details</CardTitle></CardHeader>
          <CardContent>
            <CourseForm onSubmit={handleSubmit} submitLabel="Create Course" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
