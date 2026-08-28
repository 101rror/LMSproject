'use client';

import type { Lesson } from '@/types/lesson';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Play, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

interface LessonCardProps {
  lesson: Lesson;
  completed?: boolean;
  locked?: boolean;
  href?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkComplete?: () => void;
  index?: number;
}

export function LessonCard({
  lesson, completed, locked, href, onEdit, onDelete, onMarkComplete, index
}: LessonCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {index !== undefined && (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                {index + 1}
              </span>
            )}
            <div>
              <CardTitle className="text-base">{lesson.title}</CardTitle>
              {lesson.course && (
                <p className="text-xs text-muted-foreground">{lesson.course.title}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {completed && (
              <Badge className="gap-1 bg-green-600 hover:bg-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </Badge>
            )}
            {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {lesson.video_url && (
          <p className="mb-2 text-sm text-muted-foreground">Video: {lesson.video_url}</p>
        )}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {lesson.content || 'No content available'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {href && !locked && (
            <Button size="sm" asChild>
              <Link href={href}>
                <Play className="mr-1 h-3 w-3" />
                View Lesson
              </Link>
            </Button>
          )}
          {onMarkComplete && !completed && !locked && (
            <Button size="sm" variant="outline" onClick={onMarkComplete}>
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Mark Complete
            </Button>
          )}
          {onEdit && (
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
