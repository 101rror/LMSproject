'use client';

import Link from 'next/link';
import { useCourses } from '@/hooks/useCourses';
import { useLessons } from '@/hooks/useLessons';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useAllPosts } from '@/hooks/useBlog';
import { StatCard } from '@/components/admin/StatisticsCards';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, HelpCircle, Layers, Newspaper, Plus } from 'lucide-react';

export function ContentManagerDashboard() {
  const { courses, loading: cLoading } = useCourses();
  const { lessons, loading: lLoading } = useLessons();
  const { quizzes, loading: qLoading } = useQuizzes();
  const { posts, loading: bLoading } = useAllPosts();

  const loading = cLoading || lLoading || qLoading || bLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Content Manager Dashboard</h1>
        <p className="text-muted-foreground">Manage platform content across courses and blog</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Courses" value={loading ? '...' : courses.length} icon={BookOpen} />
        <StatCard title="Total Lessons" value={loading ? '...' : lessons.length} icon={Layers} />
        <StatCard title="Total Quizzes" value={loading ? '...' : quizzes.length} icon={HelpCircle} />
        <StatCard title="Blog Posts" value={loading ? '...' : posts.length} icon={Newspaper} />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild><Link href="/management/courses/create"><Plus className="mr-1 h-4 w-4" /> Create Course</Link></Button>
          <Button asChild><Link href="/management/lessons/create"><Plus className="mr-1 h-4 w-4" /> Create Lesson</Link></Button>
          <Button asChild><Link href="/management/quizzes/create"><Plus className="mr-1 h-4 w-4" /> Create Quiz</Link></Button>
          <Button asChild><Link href="/management/blog/create"><Plus className="mr-1 h-4 w-4" /> Create Blog Post</Link></Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Courses</h2>
            <Button variant="outline" size="sm" asChild><Link href="/management/courses">View All</Link></Button>
          </div>
          <div className="space-y-3">
            {courses.slice(0, 4).map((c) => (
              <Card key={c.documentId || c.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <span className="font-medium">{c.title}</span>
                  <Button size="sm" variant="outline" asChild><Link href={`/management/courses/${c.documentId || c.id}/edit`}>Edit</Link></Button>
                </CardContent>
              </Card>
            ))}
            {courses.length === 0 && <Card><CardContent className="py-8 text-center text-muted-foreground">No courses yet</CardContent></Card>}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Blog Posts</h2>
            <Button variant="outline" size="sm" asChild><Link href="/management/blog">View All</Link></Button>
          </div>
          <div className="space-y-3">
            {posts.slice(0, 4).map((p) => (
              <Card key={p.documentId || p.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <span className="font-medium">{p.title}</span>
                    <p className="text-xs text-muted-foreground">{p.publishedAt ? 'Published' : 'Draft'}</p>
                  </div>
                  <Button size="sm" variant="outline" asChild><Link href={`/management/blog/${p.documentId || p.id}/edit`}>Edit</Link></Button>
                </CardContent>
              </Card>
            ))}
            {posts.length === 0 && <Card><CardContent className="py-8 text-center text-muted-foreground">No blog posts yet</CardContent></Card>}
          </div>
        </div>
      </div>
    </div>
  );
}
