'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useInstructorCourses } from '@/hooks/useCourses';
import { useLessons } from '@/hooks/useLessons';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useCourseEnrollments } from '@/hooks/useEnrollments';
import { StatCard } from '@/components/admin/StatisticsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, HelpCircle, Layers, Plus, Users } from 'lucide-react';
import { useState } from 'react';

export function InstructorDashboard() {
  const { user } = useAuth();
  const { courses, loading } = useInstructorCourses(user?.id ?? null);
  const { lessons } = useLessons();
  const { quizzes } = useQuizzes();
  const [totalStudents, setTotalStudents] = useState(0);

  // Count students across instructor's courses
  const courseIds = courses.map((c) => c.id);
  const instructorLessons = lessons.filter((l) => l.course && courseIds.includes(l.course.id));
  const instructorQuizzes = quizzes.filter((q) => q.course && courseIds.includes(q.course.id));

  // Fetch enrollments for each course
  const { enrollments } = useCourseEnrollments(courseIds[0] ?? null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
        <p className="text-muted-foreground">Manage your courses and track student progress</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Courses" value={courses.length} icon={BookOpen} />
        <StatCard title="Total Lessons" value={instructorLessons.length} icon={Layers} />
        <StatCard title="Total Quizzes" value={instructorQuizzes.length} icon={HelpCircle} />
        <StatCard title="Total Students" value={enrollments.length} icon={Users} />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/management/courses/create"><Plus className="mr-1 h-4 w-4" /> Create Course</Link>
          </Button>
          <Button asChild>
            <Link href="/management/lessons/create"><Plus className="mr-1 h-4 w-4" /> Create Lesson</Link>
          </Button>
          <Button asChild>
            <Link href="/management/quizzes/create"><Plus className="mr-1 h-4 w-4" /> Create Quiz</Link>
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">My Courses</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/management/courses">View All</Link>
          </Button>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-md bg-muted" />)}
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              You haven&apos;t created any courses yet. <Link href="/management/courses/create" className="text-primary underline">Create your first course</Link>.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <Card key={course.documentId || course.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {(course.lessons as unknown[])?.length || 0} lessons
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/management/courses/${course.documentId || course.id}/edit`}>Edit</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
