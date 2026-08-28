import { apiFetch } from './client';
import type { LessonProgress } from '@/types/lesson-progress';

interface StrapiListResponse<T> {
  data: T[];
  meta?: { pagination?: { total: number } };
}

export async function fetchProgress(studentId: number, courseId?: number): Promise<LessonProgress[]> {
  const params: Record<string, string | number | boolean | undefined> = {
    'filters[student][id][$eq]': studentId,
    'populate[lesson]': true,
    'populate[course]': true,
    'pagination[pageSize]': 100,
  };
  if (courseId) {
    params['filters[course][id][$eq]'] = courseId;
  }
  const data = await apiFetch<StrapiListResponse<LessonProgress>>('/api/lesson-progresses', {
    params,
  });
  return data.data || [];
}

export async function fetchProgressForCourse(courseId: number): Promise<LessonProgress[]> {
  const data = await apiFetch<StrapiListResponse<LessonProgress>>('/api/lesson-progresses', {
    params: {
      'filters[course][id][$eq]': courseId,
      'populate[student]': true,
      'populate[lesson]': true,
      'pagination[pageSize]': 100,
    },
  });
  return data.data || [];
}

export async function markLessonComplete(
  studentId: number,
  lessonId: number,
  courseId: number
): Promise<LessonProgress> {
  // Check if progress already exists
  const existing = await apiFetch<StrapiListResponse<LessonProgress>>('/api/lesson-progresses', {
    params: {
      'filters[student][id][$eq]': studentId,
      'filters[lesson][id][$eq]': lessonId,
    },
  });

  if (existing.data?.length > 0) {
    const id = existing.data[0].documentId || String(existing.data[0].id);
    const data = await apiFetch<{ data: LessonProgress }>(`/api/lesson-progresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { completed: true } }),
    });
    return data.data;
  }

  const data = await apiFetch<{ data: LessonProgress }>('/api/lesson-progresses', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        student: studentId,
        lesson: lessonId,
        course: courseId,
        completed: true,
      },
    }),
  });
  return data.data;
}

export async function calculateCourseProgress(
  studentId: number,
  courseId: number,
  totalLessons: number
): Promise<number> {
  if (totalLessons === 0) return 0;
  const progress = await fetchProgress(studentId, courseId);
  const completed = progress.filter((p) => p.completed).length;
  return Math.round((completed / totalLessons) * 100);
}
