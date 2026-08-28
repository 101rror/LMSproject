'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useInstructorCourses, useCourses } from '@/hooks/useCourses';
import { fetchProgressForCourse } from '@/lib/api/progress';
import { fetchEnrollmentsByCourse } from '@/lib/api/enrollments';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/progress/ProgressBar';
import type { Course } from '@/types/course';
import type { LessonProgress } from '@/types/lesson-progress';
import type { Enrollment } from '@/types/enrollment';

interface StudentProgressRow {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  completed: number;
  total: number;
  percentage: number;
}

export default function ManagementProgressPage() {
  const { user } = useAuth();
  const isContentManager = user?.role === 'content_manager' || user?.role === 'admin';
  const { courses: allCourses } = useCourses();
  const { courses: instructorCourses } = useInstructorCourses(isContentManager ? null : (user?.id ?? null));
  const [rows, setRows] = useState<StudentProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  const courses = isContentManager ? allCourses : instructorCourses;

  useEffect(() => {
    const loadProgress = async () => {
      if (courses.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const allRows: StudentProgressRow[] = [];
      for (const course of courses) {
        try {
          const [progressList, enrollments] = await Promise.all([
            fetchProgressForCourse(course.id),
            fetchEnrollmentsByCourse(course.id),
          ]);
          const totalLessons = (course.lessons as unknown[])?.length || 0;
          for (const enrollment of enrollments) {
            const studentProgress = progressList.filter(
              (p) => p.student?.id === enrollment.student?.id && p.completed
            );
            const completed = studentProgress.length;
            const pct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
            allRows.push({
              studentName: enrollment.student?.username || 'Unknown',
              studentEmail: enrollment.student?.email || '',
              courseTitle: course.title,
              completed,
              total: totalLessons,
              percentage: pct,
            });
          }
        } catch {
          // skip courses with permission errors
        }
      }
      setRows(allRows);
      setLoading(false);
    };
    loadProgress();
  }, [courses]);

  return (
    <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Student Progress</h1>
          <p className="text-muted-foreground">
            {isContentManager ? 'View progress across all courses' : 'View progress of students in your courses'}
          </p>
        </div>

        {loading ? (
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        ) : rows.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No student progress data available.
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="w-48">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{row.studentName}</p>
                        <p className="text-xs text-muted-foreground">{row.studentEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{row.courseTitle}</TableCell>
                    <TableCell className="text-muted-foreground">{row.completed} / {row.total}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={row.percentage} size="sm" className="flex-1" />
                        <span className="text-xs font-medium">{row.percentage}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
