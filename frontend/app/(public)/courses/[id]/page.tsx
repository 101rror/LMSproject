'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { fetchCourseByDocumentId } from '@/lib/api/courses';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollmentStatus } from '@/hooks/useEnrollments';
import { createEnrollment } from '@/lib/api/enrollments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Layers, GraduationCap, ArrowLeft, Play } from 'lucide-react';
import type { Course } from '@/types/course';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseByDocumentId(id)
      .then(setCourse)
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  const { enrollment, loading: enrollLoading } = useEnrollmentStatus(
    user?.id ?? null,
    course?.id ?? null
  );

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!course) return;
    setEnrolling(true);
    try {
      await createEnrollment(user.id, course.id);
      router.push(`/my-courses/${course.documentId || course.id}`);
    } catch {
      setError('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <p className="text-destructive">{error || 'Course not found'}</p>
          <Button asChild className="mt-4"><Link href="/courses">Back to Courses</Link></Button>
        </div>
      </div>
    );
  }

  const lessonCount = Array.isArray(course.lessons) ? course.lessons.length : 0;
  const isEnrolled = !!enrollment;
  const isStudent = user?.role === 'student';
  const canManage = user?.role === 'admin' || user?.role === 'content_manager' || (user?.role === 'instructor' && course.instructor?.id === user.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/courses"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses</Link>
        </Button>

        {course.thumbnail_url && (
          <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          {course.instructor && (
            <p className="mt-2 text-muted-foreground">
              By <span className="font-medium text-foreground">{course.instructor.username}</span>
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1">
              <Layers className="h-3 w-3" /> {lessonCount} lessons
            </Badge>
            {course.price !== undefined && course.price > 0 && (
              <Badge variant="secondary">${course.price}</Badge>
            )}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">About this course</CardTitle></CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-muted-foreground">{course.description}</p>
          </CardContent>
        </Card>

        {/* Actions based on role */}
        <div className="flex flex-wrap gap-3">
          {isStudent && isEnrolled && (
            <Button asChild size="lg">
              <Link href={`/my-courses/${course.documentId || course.id}`}>
                <Play className="mr-2 h-4 w-4" /> Continue Learning
              </Link>
            </Button>
          )}
          {isStudent && !isEnrolled && (
            <Button size="lg" onClick={handleEnroll} disabled={enrolling || enrollLoading}>
              <GraduationCap className="mr-2 h-4 w-4" />
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          )}
          {!user && (
            <Button size="lg" asChild><Link href="/login">Login to Enroll</Link></Button>
          )}
          {canManage && (
            <Button variant="outline" asChild>
              <Link href={`/management/courses/${course.documentId || course.id}/edit`}>Edit Course</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
