'use client';

import { Header } from '@/components/layout/Header';
import { usePublishedPosts } from '@/hooks/useBlog';
import { BlogList } from '@/components/blog/BlogList';

export default function BlogPage() {
  const { posts, loading, error } = usePublishedPosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">Articles and updates from CPS Academy</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />)}
          </div>
        ) : error ? (
          <div className="rounded-md border border-destructive/50 p-4 text-destructive">{error}</div>
        ) : (
          <BlogList posts={posts} emptyMessage="No published blog posts yet" />
        )}
      </div>
    </div>
  );
}
