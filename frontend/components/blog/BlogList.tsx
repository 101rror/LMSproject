'use client';

import type { BlogPost } from '@/types/blog-post';
import { BlogCard } from './BlogCard';

interface BlogListProps {
  posts: BlogPost[];
  emptyMessage?: string;
}

export function BlogList({ posts, emptyMessage = 'No blog posts found' }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.documentId || post.id} post={post} />
      ))}
    </div>
  );
}
