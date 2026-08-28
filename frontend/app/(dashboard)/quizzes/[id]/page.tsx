'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { fetchQuiz } from '@/lib/api/quizzes';
import { createQuizResult } from '@/lib/api/results';
import { QuizPlayer } from '@/components/quizzes/QuizPlayer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Quiz } from '@/types/quiz';

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz(id)
      .then(setQuiz)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (_answers: number[], score: number, totalQuestions: number) => {
    if (!user || !quiz) return;
    try {
      await createQuizResult(user.id, quiz.id, score, totalQuestions);
    } catch {
      // non-fatal
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['student']}>
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return (
      <DashboardLayout allowedRoles={['student']}>
        <p>Quiz not found.</p>
        <Button asChild className="mt-4"><Link href="/my-courses">Back to My Courses</Link></Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/results"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Results</Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          {quiz.description && <p className="text-muted-foreground">{quiz.description}</p>}
        </div>

        <QuizPlayer quiz={quiz} onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}
