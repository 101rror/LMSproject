'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatisticsCards, StatCard } from '@/components/admin/StatisticsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, GraduationCap, Layers, HelpCircle, Newspaper, Award, TrendingUp } from 'lucide-react';
import { fetchUsers, fetchEnrollments } from '@/lib/api/users';
import { useCourses } from '@/hooks/useCourses';
import { useLessons } from '@/hooks/useLessons';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useAllPosts } from '@/hooks/useBlog';
import { fetchResults } from '@/lib/api/results';
import type { StrapiUser } from '@/types/user';
import type { QuizResult } from '@/types/quiz-result';

export default function AdminStatisticsPage() {
  const { courses } = useCourses();
  const { lessons } = useLessons();
  const { quizzes } = useQuizzes();
  const { posts } = useAllPosts();
  const [users, setUsers] = useState<StrapiUser[]>([]);
  const [enrollments, setEnrollments] = useState<number>(0);
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => {});
    fetchEnrollments().then((e) => setEnrollments(e.length)).catch(() => {});
    fetchResults().then(setResults).catch(() => {});
  }, []);

  const roleCounts: Record<string, number> = {};
  users.forEach((u) => {
    const role = Array.isArray(u.role) ? u.role[0]?.name : u.role?.name;
    const name = role || 'Unknown';
    roleCounts[name] = (roleCounts[name] || 0) + 1;
  });

  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score / r.total_questions) * 100, 0) / results.length)
    : 0;

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Platform Statistics</h1>
          <p className="text-muted-foreground">Overview of platform activity and growth</p>
        </div>

        <StatisticsCards
          stats={[
            { title: 'Total Users', value: users.length, icon: Users },
            { title: 'Total Courses', value: courses.length, icon: BookOpen },
            { title: 'Total Enrollments', value: enrollments, icon: GraduationCap },
            { title: 'Avg Quiz Score', value: `${avgScore}%`, icon: TrendingUp },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Lessons" value={lessons.length} icon={Layers} />
          <StatCard title="Total Quizzes" value={quizzes.length} icon={HelpCircle} />
          <StatCard title="Blog Posts" value={posts.length} icon={Newspaper} />
          <StatCard title="Quiz Results" value={results.length} icon={Award} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(roleCounts).length === 0 ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(roleCounts).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <Badge variant="secondary">{role}</Badge>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${users.length > 0 ? (count / users.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-lg">Content Overview</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /> Courses</span>
                <Badge variant="secondary">{courses.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Layers className="h-4 w-4 text-muted-foreground" /> Lessons</span>
                <Badge variant="secondary">{lessons.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-muted-foreground" /> Quizzes</span>
                <Badge variant="secondary">{quizzes.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Newspaper className="h-4 w-4 text-muted-foreground" /> Blog Posts</span>
                <Badge variant="secondary">{posts.length}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Engagement</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground" /> Enrollments</span>
                <Badge variant="secondary">{enrollments}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Award className="h-4 w-4 text-muted-foreground" /> Quiz Results</span>
                <Badge variant="secondary">{results.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" /> Avg Score</span>
                <Badge variant="secondary">{avgScore}%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
