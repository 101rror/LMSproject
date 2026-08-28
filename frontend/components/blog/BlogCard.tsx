'use client';

import Link from 'next/link';
import type { BlogPost } from '@/types/blog-post';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: BlogPost;
  href?: string;
}

export function BlogCard({ post, href }: BlogCardProps) {
  const link = href || `/blog/${post.documentId || post.id}`;

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      {post.cover_image_url && (
        <Link href={link}>
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      )}
      <CardHeader>
        <Link href={link}>
          <CardTitle className="line-clamp-2 hover:underline">{post.title}</CardTitle>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {post.author && <span>By {post.author.username}</span>}
          {post.createdAt && (
            <>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {post.body}
        </p>
      </CardContent>
    </Card>
  );
}
