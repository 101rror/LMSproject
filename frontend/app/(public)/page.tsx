'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { useCourses } from '@/hooks/useCourses';
import { usePublishedPosts } from '@/hooks/useBlog';
import { CourseList } from '@/components/courses/CourseList';
import { BlogList } from '@/components/blog/BlogList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, BookOpen, Award, TrendingUp, ArrowRight, Newspaper } from 'lucide-react';

export default function HomePage() {
  const { courses, loading } = useCourses();
  const { posts, loading: postsLoading } = usePublishedPosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-secondary px-4 py-1.5 text-sm font-medium">
              <GraduationCap className="h-4 w-4" />
              Professional Learning Platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Learn Without Limits
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Master new skills with expert-led courses, interactive lessons, and quizzes.
              Track your progress and achieve your learning goals.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/courses">Browse Courses <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Expert-Led Courses</h3>
                <p className="text-sm text-muted-foreground">
                  Learn from industry professionals with structured, comprehensive course content.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Interactive Quizzes</h3>
                <p className="text-sm text-muted-foreground">
                  Test your knowledge with quizzes and get instant results and feedback.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your learning journey with detailed progress tracking and results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Featured Courses</h2>
              <p className="text-muted-foreground">Explore our available courses</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/courses">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />)}
            </div>
          ) : (
            <CourseList courses={courses.slice(0, 6)} emptyMessage="No courses available yet" />
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Latest from the Blog</h2>
              <p className="text-muted-foreground">Articles and updates from CPS Academy</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          {postsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />)}
            </div>
          ) : (
            <BlogList posts={posts.slice(0, 3)} emptyMessage="No blog posts yet" />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
          <p className="mt-4 text-muted-foreground">
            Join CPS Academy today and take your first step towards mastering new skills.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
