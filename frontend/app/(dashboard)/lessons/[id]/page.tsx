'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { fetchLesson } from '@/lib/api/lessons';
import { markLessonComplete } from '@/lib/api/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Video } from 'lucide-react';
import type { Lesson } from '@/types/lesson';

export default function LessonViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchLesson(id)
      .then(setLesson)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleMarkComplete = async () => {
    if (!user || !lesson?.course?.id) return;
    setCompleting(true);
    try {
      await markLessonComplete(user.id, lesson.id, lesson.course.id);
      setCompleted(true);
    } catch {
      // ignore
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['student']}>
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
      <DashboardLayout allowedRoles={['student']}>
        <p>Lesson not found.</p>
        <Button asChild className="mt-4"><Link href="/my-courses">Back to My Courses</Link></Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={lesson.course ? `/my-courses/${lesson.course.documentId || lesson.course.id}` : '/my-courses'}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          {lesson.course && (
            <p className="text-muted-foreground">{lesson.course.title}</p>
          )}
        </div>

        {lesson.video_url && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Video className="h-5 w-5" /> Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                {lesson.video_url.includes('youtube') || lesson.video_url.includes('youtu.be') ? (
                  <iframe
                    src={lesson.video_url}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={lesson.video_url} controls className="h-full w-full" />
                )}
              </div>
              <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-primary underline">
                Open video in new tab
              </a>
            </CardContent>
          </Card>
        )}

        {lesson.content && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Lesson Content</CardTitle></CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-muted-foreground">{lesson.content}</div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-3">
          {completed ? (
            <Badge className="gap-1 bg-green-600 hover:bg-green-600">
              <CheckCircle2 className="h-4 w-4" /> Lesson Completed
            </Badge>
          ) : (
            <Button onClick={handleMarkComplete} disabled={completing}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {completing ? 'Saving...' : 'Mark as Complete'}
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
