'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { fetchCourseByDocumentId } from '@/lib/api/courses';
import { useEnrollmentStatus } from '@/hooks/useEnrollments';
import { useProgress } from '@/hooks/useProgress';
import { useQuizzes } from '@/hooks/useQuizzes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/progress/ProgressBar';
import { ArrowLeft, CheckCircle2, Play, HelpCircle, Lock } from 'lucide-react';
import type { Course } from '@/types/course';
import type { Lesson } from '@/types/lesson';

export default function MyCourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const { enrollment } = useEnrollmentStatus(user?.id ?? null, course?.id ?? null);
  const { progress, markComplete, reload: reloadProgress } = useProgress(user?.id ?? null, course?.id ?? undefined);
  const { quizzes } = useQuizzes(course?.id);

  useEffect(() => {
    fetchCourseByDocumentId(id)
      .then(setCourse)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['student']}>
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout allowedRoles={['student']}>
        <p>Course not found.</p>
        <Button asChild className="mt-4"><Link href="/my-courses">Back to My Courses</Link></Button>
      </DashboardLayout>
    );
  }

  if (!enrollment) {
    return (
      <DashboardLayout allowedRoles={['student']}>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">You are not enrolled in this course.</p>
            <Button asChild className="mt-4"><Link href={`/courses/${id}`}>View Course</Link></Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const lessons = (course.lessons || []) as Lesson[];
  const completedLessonIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.lesson?.id).filter(Boolean)
  );
  const completedCount = completedLessonIds.size;
  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  // Sequential lesson access: a lesson is locked if the previous one is not completed
  const isLessonLocked = (index: number) => {
    if (index === 0) return false;
    return !completedLessonIds.has(lessons[index - 1]?.id);
  };

  const handleMarkComplete = async (lessonId: number) => {
    await markComplete(lessonId, course.id);
    await reloadProgress();
  };

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-courses"><ArrowLeft className="mr-2 h-4 w-4" /> Back to My Courses</Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="mt-1 text-muted-foreground">{course.short_description || course.description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{completedCount} of {lessons.length} lessons completed</span>
              <span className="font-semibold">{pct}%</span>
            </div>
            <ProgressBar value={pct} size="md" />
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-xl font-bold">Lessons</h2>
          {lessons.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No lessons available yet.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const completed = completedLessonIds.has(lesson.id);
                const locked = isLessonLocked(index);
                return (
                  <Card key={lesson.documentId || lesson.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          {completed && (
                            <p className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 className="h-3 w-3" /> Completed
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {locked ? (
                          <Badge variant="secondary"><Lock className="mr-1 h-3 w-3" /> Locked</Badge>
                        ) : (
                          <>
                            <Button size="sm" asChild>
                              <Link href={`/lessons/${lesson.documentId || lesson.id}`}>
                                <Play className="mr-1 h-3 w-3" /> View
                              </Link>
                            </Button>
                            {!completed && (
                              <Button size="sm" variant="outline" onClick={() => handleMarkComplete(lesson.id)}>
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Mark Complete
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {quizzes.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-bold">Quizzes</h2>
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <Card key={quiz.documentId || quiz.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{quiz.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {Array.isArray(quiz.quiz_questions) ? quiz.quiz_questions.length : 0} questions
                        </p>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/quizzes/${quiz.documentId || quiz.id}`}>
                        <Play className="mr-1 h-3 w-3" /> Take Quiz
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
