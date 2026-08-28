'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { fetchCourseByDocumentId } from '@/lib/api/courses';
import { useCourseMutations } from '@/hooks/useCourses';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseForm } from '@/components/courses/CourseForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Course } from '@/types/course';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const { update } = useCourseMutations();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseByDocumentId(id)
      .then(setCourse)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: { title: string; description: string; short_description?: string; thumbnail_url?: string; price?: number }) => {
    await update(id, data);
    router.push('/management/courses');
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
        <p>Course not found.</p>
      </DashboardLayout>
    );
  }

  // Instructor can only edit their own courses
  if (user?.role === 'instructor' && course.instructor?.id !== user.id) {
    return (
      <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
        <p className="text-destructive">You can only edit your own courses.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
      <div className="max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">Edit Course</h1>
        <Card>
          <CardHeader><CardTitle className="text-lg">{course.title}</CardTitle></CardHeader>
          <CardContent>
            <CourseForm
              initialData={{
                title: course.title,
                description: course.description,
                short_description: course.short_description,
                thumbnail_url: course.thumbnail_url,
                price: course.price,
              }}
              onSubmit={handleSubmit}
              submitLabel="Update Course"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
