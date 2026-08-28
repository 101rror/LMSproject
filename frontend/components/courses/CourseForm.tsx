'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CourseFormData } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: CourseFormData) => Promise<void>;
  submitLabel?: string;
}

export function CourseForm({ initialData, onSubmit, submitLabel = 'Save Course' }: CourseFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    short_description: initialData?.short_description || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    price: initialData?.price || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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
        <Label htmlFor="short_description">Short Description</Label>
        <Input
          id="short_description"
          value={form.short_description}
          onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          placeholder="Brief summary shown on course cards"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={6}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
        <Input
          id="thumbnail_url"
          value={form.thumbnail_url}
          onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
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
