'use client';

import type { Lesson } from '@/types/lesson';
import { LessonCard } from './LessonCard';

interface LessonListProps {
  lessons: Lesson[];
  emptyMessage?: string;
  completedIds?: Set<number>;
  onEdit?: (lesson: Lesson) => void;
  onDelete?: (lesson: Lesson) => void;
  onMarkComplete?: (lesson: Lesson) => void;
  lessonHrefBase?: string;
}

export function LessonList({
  lessons, emptyMessage = 'No lessons found',
  completedIds, onEdit, onDelete, onMarkComplete, lessonHrefBase
}: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson, index) => (
        <LessonCard
          key={lesson.documentId || lesson.id}
          lesson={lesson}
          index={index}
          completed={completedIds?.has(lesson.id)}
          href={lessonHrefBase ? `${lessonHrefBase}/${lesson.documentId || lesson.id}` : undefined}
          onEdit={onEdit ? () => onEdit(lesson) : undefined}
          onDelete={onDelete ? () => onDelete(lesson) : undefined}
          onMarkComplete={onMarkComplete ? () => onMarkComplete(lesson) : undefined}
        />
      ))}
    </div>
  );
}
