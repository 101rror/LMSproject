'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useProgress } from '@/hooks/useProgress';
import { useCourses } from '@/hooks/useCourses';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Course, Lesson } from '@/types/course';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const { enrollments, loading } = useEnrollments(user?.id ?? null);
  const { progress } = useProgress(user?.id ?? null);
  const { courses } = useCourses();

  const enrolledCourses = enrollments
    .map((e) => courses.find((c) => c.id === e.course?.id))
    .filter(Boolean) as Course[];

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">Courses you are enrolled in</p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />)}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">You haven&apos;t enrolled in any courses yet.</p>
              <Button asChild className="mt-4"><Link href="/courses">Browse Courses</Link></Button>
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
    </DashboardLayout>
  );
}
