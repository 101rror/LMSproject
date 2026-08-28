'use client';

import type { Course } from '@/types/course';
import { CourseCard } from './CourseCard';

interface CourseListProps {
  courses: Course[];
  emptyMessage?: string;
  footer?: (course: Course) => React.ReactNode;
}

export function CourseList({ courses, emptyMessage = 'No courses found', footer }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.documentId || course.id}
          course={course}
          footer={footer?.(course)}
        />
      ))}
    </div>
  );
}
