'use client';

import Link from 'next/link';
import type { Course } from '@/types/course';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Layers } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  href?: string;
  footer?: React.ReactNode;
}

export function CourseCard({ course, href, footer }: CourseCardProps) {
  const link = href || `/courses/${course.documentId || course.id}`;
  const lessonCount = Array.isArray(course.lessons) ? course.lessons.length : 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      {course.thumbnail_url && (
        <Link href={link}>
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      )}
      <CardHeader>
        <Link href={link}>
          <CardTitle className="line-clamp-2 hover:underline">{course.title}</CardTitle>
        </Link>
        {course.instructor && (
          <p className="text-sm text-muted-foreground">
            By {course.instructor.username}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {course.short_description || course.description}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <Layers className="h-3 w-3" />
            {lessonCount} lessons
          </Badge>
        </div>
      </CardContent>
      {footer && <CardFooter className="gap-2">{footer}</CardFooter>}
    </Card>
  );
}
