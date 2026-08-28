import { apiFetch } from './client';
import type { Course, CourseFormData } from '@/types/course';

interface StrapiListResponse<T> {
  data: T[];
  meta?: { pagination?: { total: number; page: number; pageSize: number; pageCount: number } };
}

export async function fetchCourses(params?: {
  page?: number;
  pageSize?: number;
}): Promise<Course[]> {
  const data = await apiFetch<StrapiListResponse<Course>>('/api/courses', {
    params: {
      'populate[instructor]': true,
      'populate[lessons]': true,
      'pagination[page]': params?.page || 1,
      'pagination[pageSize]': params?.pageSize || 100,
    },
  });
  return data.data || [];
}

export async function fetchCourse(id: string): Promise<Course | null> {
  const data = await apiFetch<StrapiListResponse<Course>>(`/api/courses/${id}`, {
    params: {
      'populate[instructor]': true,
      'populate[lessons]': true,
    },
  });
  // Strapi v5 may return { data: Course } directly
  if (Array.isArray(data.data)) {
    return data.data[0] || null;
  }
  return (data as unknown as Course) || null;
}

export async function fetchCourseByDocumentId(documentId: string): Promise<Course | null> {
  const data = await apiFetch<StrapiListResponse<Course>>('/api/courses', {
    params: {
      'filters[documentId][$eq]': documentId,
      'populate[instructor]': true,
      'populate[lessons]': true,
    },
  });
  return data.data?.[0] || null;
}

export async function createCourse(formData: CourseFormData): Promise<Course> {
  const data = await apiFetch<{ data: Course }>('/api/courses', {
    method: 'POST',
    body: JSON.stringify({ data: formData }),
  });
  return data.data;
}

export async function updateCourse(id: string, formData: Partial<CourseFormData>): Promise<Course> {
  const data = await apiFetch<{ data: Course }>(`/api/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data: formData }),
  });
  return data.data;
}

export async function deleteCourse(id: string): Promise<void> {
  await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
}

export async function fetchInstructorCourses(instructorId: number): Promise<Course[]> {
  const data = await apiFetch<StrapiListResponse<Course>>('/api/courses', {
    params: {
      'filters[instructor][id][$eq]': instructorId,
      'populate[instructor]': true,
      'populate[lessons]': true,
    },
  });
  return data.data || [];
}
