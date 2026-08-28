'use client';

import Link from 'next/link';
import { useCourses } from '@/hooks/useCourses';
import { useLessons } from '@/hooks/useLessons';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useAllPosts } from '@/hooks/useBlog';
import { fetchUsers, fetchEnrollments } from '@/lib/api/users';
import { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/StatisticsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, HelpCircle, Layers, Newspaper, Plus, Users } from 'lucide-react';
import type { StrapiUser } from '@/types/user';

export function AdminDashboard() {
  const { courses } = useCourses();
  const { lessons } = useLessons();
  const { quizzes } = useQuizzes();
  const { posts } = useAllPosts();
  const [users, setUsers] = useState<StrapiUser[]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => {});
    fetchEnrollments().then((e) => setEnrollmentCount(e.length)).catch(() => {});
  }, []);

  const roleCounts: Record<string, number> = {};
  users.forEach((u) => {
    const role = Array.isArray(u.role) ? u.role[0]?.name : u.role?.name;
    const name = role || 'Unknown';
    roleCounts[name] = (roleCounts[name] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Full platform overview and management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={users.length} icon={Users} />
        <StatCard title="Total Courses" value={courses.length} icon={BookOpen} />
        <StatCard title="Total Lessons" value={lessons.length} icon={Layers} />
        <StatCard title="Total Enrollments" value={enrollmentCount} icon={GraduationCap} />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Users by Role</h2>
        <Card>
          <CardContent className="py-4">
            {Object.entries(roleCounts).length === 0 ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {Object.entries(roleCounts).map(([role, count]) => (
                  <Badge key={role} variant="secondary" className="text-sm">
                    {role}: {count}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild><Link href="/admin/users"><Users className="mr-1 h-4 w-4" /> Manage Users</Link></Button>
          <Button asChild><Link href="/admin/courses"><BookOpen className="mr-1 h-4 w-4" /> View Courses</Link></Button>
          <Button asChild><Link href="/admin/statistics"><Plus className="mr-1 h-4 w-4" /> Statistics</Link></Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Platform Summary</h2>
          </div>
          <div className="space-y-3">
            <Card><CardContent className="flex items-center justify-between py-4"><span className="font-medium">Quizzes</span><Badge variant="secondary">{quizzes.length}</Badge></CardContent></Card>
            <Card><CardContent className="flex items-center justify-between py-4"><span className="font-medium">Blog Posts</span><Badge variant="secondary">{posts.length}</Badge></CardContent></Card>
            <Card><CardContent className="flex items-center justify-between py-4"><span className="font-medium">Lessons</span><Badge variant="secondary">{lessons.length}</Badge></CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  );
}
