'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAllPosts, useBlogMutations } from '@/hooks/useBlog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Newspaper, Eye, EyeOff } from 'lucide-react';
import type { BlogPost } from '@/types/blog-post';

export default function ManagementBlogPage() {
  const { posts, loading, error } = useAllPosts();
  const { remove, publish, unpublish, saving } = useBlogMutations();
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.documentId || String(deleteTarget.id));
      setDeleteTarget(null);
      window.location.reload();
    } catch {
      // handled in hook
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      if (post.publishedAt) {
        await unpublish(post.documentId || String(post.id));
      } else {
        await publish(post.documentId || String(post.id));
      }
      window.location.reload();
    } catch {
      // handled in hook
    }
  };

  return (
    <DashboardLayout allowedRoles={['content_manager', 'admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">Manage blog posts and publications</p>
          </div>
          <Button asChild>
            <Link href="/management/blog/create"><Plus className="mr-2 h-4 w-4" /> Create Post</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-md bg-muted" />)}
          </div>
        ) : error ? (
          <Card><CardContent className="py-4 text-destructive">{error}</CardContent></Card>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Newspaper className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No blog posts yet.</p>
              <Button asChild className="mt-4">
                <Link href="/management/blog/create"><Plus className="mr-2 h-4 w-4" /> Create Post</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.documentId || post.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{post.title}</p>
                      <Badge variant={post.publishedAt ? 'default' : 'secondary'}>
                        {post.publishedAt ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {post.author?.username || 'Unknown'} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleTogglePublish(post)} disabled={saving}>
                      {post.publishedAt ? <><EyeOff className="mr-1 h-3 w-3" /> Unpublish</> : <><Eye className="mr-1 h-3 w-3" /> Publish</>}
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/management/blog/${post.documentId || post.id}/edit`}>
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(post)} disabled={saving}>
                      <Trash2 className="mr-1 h-3 w-3" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
