'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useQuizzes, useQuizMutations } from '@/hooks/useQuizzes';
import { useInstructorCourses, useCourses } from '@/hooks/useCourses';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QuizList } from '@/components/quizzes/QuizList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Plus, HelpCircle } from 'lucide-react';
import type { Quiz } from '@/types/quiz';

export default function ManagementQuizzesPage() {
  const { user } = useAuth();
  const isContentManager = user?.role === 'content_manager' || user?.role === 'admin';
  const { courses: allCourses } = useCourses();
  const { courses: instructorCourses } = useInstructorCourses(isContentManager ? null : (user?.id ?? null));
  const { quizzes, loading } = useQuizzes();
  const { remove, saving } = useQuizMutations();
  const [deleteTarget, setDeleteTarget] = useState<Quiz | null>(null);

  const courses = isContentManager ? allCourses : instructorCourses;
  const courseIds = new Set(courses.map((c) => c.id));
  const filteredQuizzes = quizzes.filter((q) => q.course && courseIds.has(q.course.id));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.documentId || String(deleteTarget.id));
      setDeleteTarget(null);
      window.location.reload();
    } catch {
      // handled in hook
    }
  };

  return (
    <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quizzes</h1>
            <p className="text-muted-foreground">
              {isContentManager ? 'Manage all platform quizzes' : 'Manage quizzes for your courses'}
            </p>
          </div>
          <Button asChild>
            <Link href="/management/quizzes/create"><Plus className="mr-2 h-4 w-4" /> Create Quiz</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-md bg-muted" />)}
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <HelpCircle className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No quizzes yet.</p>
              <Button asChild className="mt-4">
                <Link href="/management/quizzes/create"><Plus className="mr-2 h-4 w-4" /> Create Quiz</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <QuizList
            quizzes={filteredQuizzes}
            onEdit={(quiz) => window.location.href = `/management/quizzes/${quiz.documentId || quiz.id}/edit`}
            onDelete={(quiz) => setDeleteTarget(quiz)}
            manageQuestionsHref={(quiz) => `/management/quizzes/${quiz.documentId || quiz.id}/edit`}
          />
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This will also delete all questions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={saving}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
