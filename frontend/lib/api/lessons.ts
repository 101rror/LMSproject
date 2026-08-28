import { apiFetch } from './client';
import type { Lesson, LessonFormData } from '@/types/lesson';

interface StrapiListResponse<T> {
  data: T[];
  meta?: { pagination?: { total: number } };
}

export async function fetchLessons(params?: { courseId?: string | number }): Promise<Lesson[]> {
  const queryParams: Record<string, string | number | boolean | undefined> = {
    'populate[course]': true,
    'pagination[pageSize]': 100,
  };
  if (params?.courseId) {
    queryParams['filters[course][id][$eq]'] = params.courseId;
  }
  const data = await apiFetch<StrapiListResponse<Lesson>>('/api/lessons', {
    params: queryParams,
  });
  return data.data || [];
}

export async function fetchLesson(id: string): Promise<Lesson | null> {
  const data = await apiFetch<{ data: Lesson }>(`/api/lessons/${id}`, {
    params: { 'populate[course]': true },
  });
  return data.data;
}

export async function createLesson(formData: LessonFormData): Promise<Lesson> {
  const data = await apiFetch<{ data: Lesson }>('/api/lessons', {
    method: 'POST',
    body: JSON.stringify({ data: formData }),
  });
  return data.data;
}

export async function updateLesson(id: string, formData: Partial<LessonFormData>): Promise<Lesson> {
  const data = await apiFetch<{ data: Lesson }>(`/api/lessons/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data: formData }),
  });
  return data.data;
}

export async function deleteLesson(id: string): Promise<void> {
  await apiFetch(`/api/lessons/${id}`, { method: 'DELETE' });
}
