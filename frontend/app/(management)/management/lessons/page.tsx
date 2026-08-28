'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLessons, useLessonMutations } from '@/hooks/useLessons';
import { useInstructorCourses, useCourses } from '@/hooks/useCourses';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import type { Lesson } from '@/types/lesson';

export default function ManagementLessonsPage() {
  const { user } = useAuth();
  const isContentManager = user?.role === 'content_manager' || user?.role === 'admin';
  const { courses: allCourses } = useCourses();
  const { courses: instructorCourses } = useInstructorCourses(isContentManager ? null : (user?.id ?? null));
  const { lessons, loading } = useLessons();
  const { remove, saving } = useLessonMutations();
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);

  const courses = isContentManager ? allCourses : instructorCourses;
  const courseIds = new Set(courses.map((c) => c.id));
  const filteredLessons = lessons.filter((l) => l.course && courseIds.has(l.course.id));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.documentId || String(deleteTarget.id));
      setDeleteTarget(null);
      window.location.reload();
    } catch {
      // handled in hook
    }
  };

  return (
    <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lessons</h1>
            <p className="text-muted-foreground">
              {isContentManager ? 'Manage all platform lessons' : 'Manage lessons for your courses'}
            </p>
          </div>
          <Button asChild>
            <Link href="/management/lessons/create"><Plus className="mr-2 h-4 w-4" /> Create Lesson</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-md bg-muted" />)}
          </div>
        ) : filteredLessons.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Layers className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No lessons yet.</p>
              <Button asChild className="mt-4">
                <Link href="/management/lessons/create"><Plus className="mr-2 h-4 w-4" /> Create Lesson</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.documentId || lesson.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">{lesson.course?.title || 'No course'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/management/lessons/${lesson.documentId || lesson.id}/edit`}>
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(lesson)} disabled={saving}>
                      <Trash2 className="mr-1 h-3 w-3" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
