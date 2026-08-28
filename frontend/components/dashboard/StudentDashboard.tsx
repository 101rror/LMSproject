'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useResults } from '@/hooks/useResults';
import { useProgress } from '@/hooks/useProgress';
import { useCourses } from '@/hooks/useCourses';
import { StatCard } from '@/components/admin/StatisticsCards';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, BookOpen, CheckCircle2, GraduationCap, TrendingUp } from 'lucide-react';
import type { Course, Lesson } from '@/types/course';
import type { LessonProgress } from '@/types/lesson-progress';

export function StudentDashboard() {
  const { user } = useAuth();
  const { enrollments, loading: enrollLoading } = useEnrollments(user?.id ?? null);
  const { results, loading: resultsLoading } = useResults(user?.id ?? null);
  const { progress } = useProgress(user?.id ?? null);
  const { courses } = useCourses();

  if (enrollLoading || resultsLoading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const enrolledCourses = enrollments
    .map((e) => courses.find((c) => c.id === e.course?.id))
    .filter(Boolean) as Course[];

  const completedLessons = progress.filter((p) => p.completed).length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score / r.total_questions) * 100, 0) / results.length)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.username}!</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Enrolled Courses" value={enrolledCourses.length} icon={GraduationCap} />
        <StatCard title="Completed Lessons" value={completedLessons} icon={CheckCircle2} />
        <StatCard title="Quizzes Taken" value={results.length} icon={Award} />
        <StatCard title="Average Score" value={`${avgScore}%`} icon={TrendingUp} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Continue Learning</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
        {enrolledCourses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              You haven&apos;t enrolled in any courses yet. <Link href="/courses" className="text-primary underline">Browse courses</Link> to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => {
              const lessons = (course.lessons || []) as Lesson[];
              const totalLessons = lessons.length;
              const completedForCourse = progress.filter(
                (p) => p.completed && p.course?.id === course.id
              ).length;
              const pct = totalLessons > 0 ? Math.round((completedForCourse / totalLessons) * 100) : 0;
              return (
                <ProgressCard
                  key={course.documentId || course.id}
                  course={course}
                  percentage={pct}
                  completedLessons={completedForCourse}
                  totalLessons={totalLessons}
                  href={`/my-courses/${course.documentId || course.id}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold">Recent Quiz Results</h2>
          <div className="rounded-md border">
            {results.slice(0, 5).map((r) => (
              <div key={r.documentId || r.id} className="flex items-center justify-between border-b p-4 last:border-0">
                <div>
                  <p className="font-medium">{r.quiz?.title || 'Quiz'}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.quiz?.course?.title || ''} • {new Date(r.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{r.score} / {r.total_questions}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((r.score / r.total_questions) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
