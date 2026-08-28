'use client';

import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useQuizzes, useQuizMutations } from '@/hooks/useQuizzes';
import { QuizList } from '@/components/quizzes/QuizList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Plus, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { Quiz } from '@/types/quiz';

export default function AdminQuizzesPage() {
  const { quizzes, loading, error } = useQuizzes();
  const { remove, saving } = useQuizMutations();
  const [deleteTarget, setDeleteTarget] = useState<Quiz | null>(null);

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
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quizzes</h1>
            <p className="text-muted-foreground">Manage all platform quizzes</p>
          </div>
          <Button asChild>
            <Link href="/management/quizzes/create"><Plus className="mr-2 h-4 w-4" /> Create Quiz</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-md bg-muted" />)}
          </div>
        ) : error ? (
          <Card><CardContent className="py-4 text-destructive">{error}</CardContent></Card>
        ) : quizzes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <HelpCircle className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No quizzes yet.</p>
            </CardContent>
          </Card>
        ) : (
          <QuizList
            quizzes={quizzes}
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
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This will also delete all questions.
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
