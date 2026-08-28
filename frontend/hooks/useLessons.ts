'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchLessons, createLesson, updateLesson, deleteLesson } from '@/lib/api/lessons';
import type { Lesson, LessonFormData } from '@/types/lesson';
import { ApiError } from '@/lib/api/client';

export function useLessons(courseId?: string | number) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetchLessons({ courseId });
      setLessons(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  return { lessons, loading, error, reload: load };
}

export function useLessonMutations() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: LessonFormData) => {
    setSaving(true); setError(null);
    try { return await createLesson(data); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to create lesson'); throw e; }
    finally { setSaving(false); }
  }, []);

  const update = useCallback(async (id: string, data: Partial<LessonFormData>) => {
    setSaving(true); setError(null);
    try { return await updateLesson(id, data); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to update lesson'); throw e; }
    finally { setSaving(false); }
  }, []);

  const remove = useCallback(async (id: string) => {
    setSaving(true); setError(null);
    try { await deleteLesson(id); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to delete lesson'); throw e; }
    finally { setSaving(false); }
  }, []);

  return { create, update, remove, saving, error };
}
