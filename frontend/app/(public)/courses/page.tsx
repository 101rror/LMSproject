'use client';

import { Header } from '@/components/layout/Header';
import { useCourses } from '@/hooks/useCourses';
import { CourseList } from '@/components/courses/CourseList';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function CoursesPage() {
  const { courses, loading, error } = useCourses();
  const [search, setSearch] = useState('');

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.short_description || c.description).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Browse Courses</h1>
          <p className="text-muted-foreground">Discover courses to advance your skills</p>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />)}
          </div>
        ) : error ? (
          <div className="rounded-md border border-destructive/50 p-4 text-destructive">{error}</div>
        ) : (
          <CourseList courses={filtered} emptyMessage="No courses match your search" />
        )}
      </div>
    </div>
  );
}
