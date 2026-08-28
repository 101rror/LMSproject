'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LessonFormData } from '@/types/lesson';
import type { Course } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

interface LessonFormProps {
  initialData?: Partial<LessonFormData>;
  courses: Course[];
  onSubmit: (data: LessonFormData) => Promise<void>;
  submitLabel?: string;
}

export function LessonForm({ initialData, courses, onSubmit, submitLabel = 'Save Lesson' }: LessonFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<LessonFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    video_url: initialData?.video_url || '',
    order: initialData?.order || 0,
    course: initialData?.course || (courses[0]?.id ?? 0),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.course) {
      setError('Title and course are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lesson');
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
        <Label htmlFor="course">Course *</Label>
        <Select
          value={String(form.course)}
          onValueChange={(v) => setForm({ ...form, course: Number(v) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={8}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="video_url">Video URL</Label>
        <Input
          id="video_url"
          value={form.video_url}
          onChange={(e) => setForm({ ...form, video_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="order">Order</Label>
        <Input
          id="order"
          type="number"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
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
