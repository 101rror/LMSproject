'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuizMutations } from '@/hooks/useQuizzes';
import { useInstructorCourses, useCourses } from '@/hooks/useCourses';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QuizForm } from '@/components/quizzes/QuizForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateQuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isContentManager = user?.role === 'content_manager' || user?.role === 'admin';
  const { courses: allCourses, loading: allLoading } = useCourses();
  const { courses: instructorCourses, loading: instLoading } = useInstructorCourses(isContentManager ? null : (user?.id ?? null));
  const { create } = useQuizMutations();

  const courses = isContentManager ? allCourses : instructorCourses;
  const loading = isContentManager ? allLoading : instLoading;

  const handleSubmit = async (data: { title: string; description?: string; course: number }) => {
    const quiz = await create(data);
    router.push(`/management/quizzes/${quiz.documentId || quiz.id}/edit`);
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
            You need to create a course before adding quizzes.
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
      <div className="max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">Create Quiz</h1>
        <Card>
          <CardHeader><CardTitle className="text-lg">Quiz Details</CardTitle></CardHeader>
          <CardContent>
            <QuizForm courses={courses} onSubmit={handleSubmit} submitLabel="Create Quiz" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
