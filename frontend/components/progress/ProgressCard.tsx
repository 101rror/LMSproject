'use client';

import type { Course } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Layers } from 'lucide-react';

interface ProgressCardProps {
  course: Course;
  percentage: number;
  completedLessons: number;
  totalLessons: number;
  href?: string;
}

export function ProgressCard({ course, percentage, completedLessons, totalLessons, href }: ProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {course.short_description || course.description}
        </p>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Layers className="h-3 w-3" />
            {completedLessons} of {totalLessons} lessons
          </span>
          <span className="font-semibold">{percentage}%</span>
        </div>
        <ProgressBar value={percentage} size="sm" />
        {href && (
          <Button asChild className="mt-4 w-full" size="sm">
            <Link href={href}>Continue Learning</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
