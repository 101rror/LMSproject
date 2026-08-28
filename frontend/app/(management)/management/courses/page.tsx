'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useInstructorCourses, useCourseMutations, useCourses } from '@/hooks/useCourses';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseForm } from '@/components/courses/CourseForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import type { Course } from '@/types/course';

export default function ManagementCoursesPage() {
  const { user } = useAuth();
  const isContentManager = user?.role === 'content_manager' || user?.role === 'admin';
  const { courses: allCourses, loading: allLoading } = useCourses();
  const { courses: instructorCourses, loading: instLoading } = useInstructorCourses(isContentManager ? null : (user?.id ?? null));
  const { remove, saving } = useCourseMutations();
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [editTarget, setEditTarget] = useState<Course | null>(null);

  const courses = isContentManager ? allCourses : instructorCourses;
  const loading = isContentManager ? allLoading : instLoading;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.documentId || String(deleteTarget.id));
      setDeleteTarget(null);
      window.location.reload();
    } catch {
      // error handled in hook
    }
  };

  return (
    <DashboardLayout allowedRoles={['instructor', 'content_manager', 'admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-muted-foreground">
              {isContentManager ? 'Manage all platform courses' : 'Manage your courses'}
            </p>
          </div>
          <Button asChild>
            <Link href="/management/courses/create"><Plus className="mr-2 h-4 w-4" /> Create Course</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-md bg-muted" />)}
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <BookOpen className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No courses yet. Create your first course to get started.</p>
              <Button asChild className="mt-4">
                <Link href="/management/courses/create"><Plus className="mr-2 h-4 w-4" /> Create Course</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <Card key={course.documentId || course.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {(course.lessons as unknown[])?.length || 0} lessons
                      {course.instructor && ` • ${course.instructor.username}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/management/courses/${course.documentId || course.id}/edit`}>
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(course)} disabled={saving}>
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
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
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
