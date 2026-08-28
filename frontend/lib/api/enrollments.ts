import { apiFetch } from './client';
import type { Enrollment } from '@/types/enrollment';

interface StrapiListResponse<T> {
  data: T[];
  meta?: { pagination?: { total: number } };
}

export async function fetchEnrollments(studentId?: number): Promise<Enrollment[]> {
  const params: Record<string, string | number | boolean | undefined> = {
    'populate[student]': true,
    'populate[course]': true,
    'pagination[pageSize]': 100,
  };
  if (studentId) {
    params['filters[student][id][$eq]'] = studentId;
  }
  const data = await apiFetch<StrapiListResponse<Enrollment>>('/api/enrollments', {
    params,
  });
  return data.data || [];
}

export async function fetchEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
  const data = await apiFetch<StrapiListResponse<Enrollment>>('/api/enrollments', {
    params: {
      'filters[course][id][$eq]': courseId,
      'populate[student]': true,
      'populate[course]': true,
      'pagination[pageSize]': 100,
    },
  });
  return data.data || [];
}

export async function createEnrollment(studentId: number, courseId: number): Promise<Enrollment> {
  const data = await apiFetch<{ data: Enrollment }>('/api/enrollments', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        student: studentId,
        course: courseId,
      },
    }),
  });
  return data.data;
}

export async function deleteEnrollment(id: string): Promise<void> {
  await apiFetch(`/api/enrollments/${id}`, { method: 'DELETE' });
}

export async function checkEnrollment(studentId: number, courseId: number): Promise<Enrollment | null> {
  const data = await apiFetch<StrapiListResponse<Enrollment>>('/api/enrollments', {
    params: {
      'filters[student][id][$eq]': studentId,
      'filters[course][id][$eq]': courseId,
      'populate[course]': true,
    },
  });
  return data.data?.[0] || null;
}
