'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPostFormData } from '@/types/blog-post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BlogFormProps {
  initialData?: Partial<BlogPostFormData>;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  submitLabel?: string;
}

export function BlogForm({ initialData, onSubmit, submitLabel = 'Save Post' }: BlogFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BlogPostFormData>({
    title: initialData?.title || '',
    body: initialData?.body || '',
    cover_image_url: initialData?.cover_image_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cover_image_url">Cover Image URL</Label>
        <Input
          id="cover_image_url"
          value={form.cover_image_url}
          onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Body *</Label>
        <Textarea
          id="body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={12}
          required
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
