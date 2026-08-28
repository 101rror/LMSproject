'use client';

import { useRouter } from 'next/navigation';
import { useBlogMutations } from '@/hooks/useBlog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BlogForm } from '@/components/blog/BlogForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { create } = useBlogMutations();

  const handleSubmit = async (data: { title: string; body: string; cover_image_url?: string }) => {
    await create(data);
    router.push('/management/blog');
  };

  return (
    <DashboardLayout allowedRoles={['content_manager', 'admin']}>
      <div className="max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">Create Blog Post</h1>
        <Card>
          <CardHeader><CardTitle className="text-lg">Post Details</CardTitle></CardHeader>
          <CardContent>
            <BlogForm onSubmit={handleSubmit} submitLabel="Create Post" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
