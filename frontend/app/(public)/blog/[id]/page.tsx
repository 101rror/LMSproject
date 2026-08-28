'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { fetchPost } from '@/lib/api/blog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { BlogPost } from '@/types/blog-post';

export default function BlogPostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost(id)
      .then((p) => {
        if (!p || !p.publishedAt) {
          setError('Post not found or not published');
        } else {
          setPost(p);
        }
      })
      .catch(() => setError('Failed to load blog post'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-destructive">{error || 'Post not found'}</p>
          <Button asChild className="mt-4"><Link href="/blog">Back to Blog</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</Link>
        </Button>

        {post.cover_image_url && (
          <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}

        <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          {post.author && <span>By {post.author.username}</span>}
          {post.createdAt && (
            <>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </>
          )}
        </div>

        <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
          {post.body}
        </div>
      </article>
    </div>
  );
}
