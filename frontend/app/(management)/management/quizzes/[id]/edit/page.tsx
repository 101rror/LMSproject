'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { fetchQuiz } from '@/lib/api/quizzes';
import { useQuizMutations } from '@/hooks/useQuizzes';
import { useInstructorCourses, useCourses } from '@/hooks/useCourses';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QuizForm } from '@/components/quizzes/QuizForm';
import { QuizQuestionForm } from '@/components/quizzes/QuizQuestionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import type { Quiz } from '@/types/quiz';
import type { QuizQuestion } from '@/types/quiz-question';

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const isContentManager = user?.role === 'content_manager' || user?.role === 'admin';
  const { courses: allCourses } = useCourses();
  const { courses: instructorCourses } = useInstructorCourses(isContentManager ? null : (user?.id ?? null));
  const { update, addQuestion, removeQuestion, saving } = useQuizMutations();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const courses = isContentManager ? allCourses : instructorCourses;

  const reload = () => {
    fetchQuiz(id).then(setQuiz).catch(() => {});
  };

  useEffect(() => {
    fetchQuiz(id)
      .then(setQuiz)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data: { title: string; description?: string; course: number }) => {
    await update(id, data);
    reload();
  };

  const handleAddQuestion = async (data: { question: string; options: string[]; correct_answer: number; quiz: number }) => {
    await addQuestion(data);
    setShowQuestionForm(false);
    reload();
  };

  const handleDeleteQuestion = async (question: QuizQuestion) => {
    try {
      await removeQuestion(question.documentId || String(question.id));
      reload();
    } catch {
      // handled in hook
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return (
      <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
        <p>Quiz not found.</p>
      </DashboardLayout>
    );
  }

  const questions = (quiz.quiz_questions || []) as QuizQuestion[];

  return (
    <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
      <div className="max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold">Edit Quiz</h1>

        <Card>
          <CardHeader><CardTitle className="text-lg">Quiz Details</CardTitle></CardHeader>
          <CardContent>
            <QuizForm
              courses={courses}
              initialData={{
                title: quiz.title,
                description: quiz.description,
                course: quiz.course?.id,
              }}
              onSubmit={handleUpdate}
              submitLabel="Update Quiz"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Questions <Badge variant="secondary" className="ml-2">{questions.length}</Badge>
              </CardTitle>
              {!showQuestionForm && (
                <Button size="sm" onClick={() => setShowQuestionForm(true)}>
                  <Plus className="mr-1 h-4 w-4" /> Add Question
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showQuestionForm && (
              <div className="rounded-md border p-4">
                <h3 className="mb-3 font-semibold">New Question</h3>
                <QuizQuestionForm
                  quizId={quiz.id}
                  onSubmit={handleAddQuestion}
                  submitLabel="Add Question"
                  onCancel={() => setShowQuestionForm(false)}
                />
              </div>
            )}

            {questions.length === 0 && !showQuestionForm ? (
              <p className="py-8 text-center text-muted-foreground">No questions yet. Add your first question.</p>
            ) : (
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div key={q.id} className="rounded-md border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{index + 1}. {q.question}</p>
                        <ul className="mt-2 space-y-1">
                          {q.options.map((opt, optIndex) => (
                            <li
                              key={optIndex}
                              className={`text-sm ${optIndex === q.correct_answer ? 'font-semibold text-green-600' : 'text-muted-foreground'}`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {opt}
                              {optIndex === q.correct_answer && ' (Correct)'}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteQuestion(q)} disabled={saving}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
