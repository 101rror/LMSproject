'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchPost } from '@/lib/api/blog';
import { useBlogMutations } from '@/hooks/useBlog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BlogForm } from '@/components/blog/BlogForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost } from '@/types/blog-post';

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { update } = useBlogMutations();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost(id)
      .then(setPost)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: { title: string; body: string; cover_image_url?: string }) => {
    await update(id, data);
    router.push('/management/blog');
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['content_manager', 'admin']}>
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </DashboardLayout>
    );
  }

  if (!post) {
    return (
      <DashboardLayout allowedRoles={['content_manager', 'admin']}>
        <p>Post not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['content_manager', 'admin']}>
      <div className="max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">Edit Blog Post</h1>
        <Card>
          <CardHeader><CardTitle className="text-lg">{post.title}</CardTitle></CardHeader>
          <CardContent>
            <BlogForm
              initialData={{
                title: post.title,
                body: post.body,
                cover_image_url: post.cover_image_url,
              }}
              onSubmit={handleSubmit}
              submitLabel="Update Post"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
