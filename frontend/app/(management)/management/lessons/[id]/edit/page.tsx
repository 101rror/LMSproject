'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { fetchLesson } from '@/lib/api/lessons';
import { useLessonMutations } from '@/hooks/useLessons';
import { useInstructorCourses, useCourses } from '@/hooks/useCourses';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LessonForm } from '@/components/lessons/LessonForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Lesson } from '@/types/lesson';

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const isContentManager = user?.role === 'content_manager' || user?.role === 'admin';
  const { courses: allCourses } = useCourses();
  const { courses: instructorCourses } = useInstructorCourses(isContentManager ? null : (user?.id ?? null));
  const { update } = useLessonMutations();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const courses = isContentManager ? allCourses : instructorCourses;

  useEffect(() => {
    fetchLesson(id)
      .then(setLesson)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: { title: string; content?: string; video_url?: string; order?: number; course: number }) => {
    await update(id, data);
    router.push('/management/lessons');
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
      <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
        <p>Lesson not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
      <div className="max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">Edit Lesson</h1>
        <Card>
          <CardHeader><CardTitle className="text-lg">{lesson.title}</CardTitle></CardHeader>
          <CardContent>
            <LessonForm
              courses={courses}
              initialData={{
                title: lesson.title,
                content: lesson.content,
                video_url: lesson.video_url,
                order: lesson.order,
                course: lesson.course?.id,
              }}
              onSubmit={handleSubmit}
              submitLabel="Update Lesson"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
