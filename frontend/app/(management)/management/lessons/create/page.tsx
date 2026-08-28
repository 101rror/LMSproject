'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLessonMutations } from '@/hooks/useLessons';
import { useInstructorCourses, useCourses } from '@/hooks/useCourses';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LessonForm } from '@/components/lessons/LessonForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateLessonPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isContentManager = user?.role === 'content_manager' || user?.role === 'admin';
  const { courses: allCourses, loading: allLoading } = useCourses();
  const { courses: instructorCourses, loading: instLoading } = useInstructorCourses(isContentManager ? null : (user?.id ?? null));
  const { create } = useLessonMutations();

  const courses = isContentManager ? allCourses : instructorCourses;
  const loading = isContentManager ? allLoading : instLoading;

  const handleSubmit = async (data: { title: string; content?: string; video_url?: string; order?: number; course: number }) => {
    await create(data);
    router.push('/management/lessons');
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </DashboardLayout>
    );
  }

  if (courses.length === 0) {
    return (
      <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            You need to create a course before adding lessons.
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
      <div className="max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">Create Lesson</h1>
        <Card>
          <CardHeader><CardTitle className="text-lg">Lesson Details</CardTitle></CardHeader>
          <CardContent>
            <LessonForm courses={courses} onSubmit={handleSubmit} submitLabel="Create Lesson" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
