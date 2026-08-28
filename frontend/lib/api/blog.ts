import { apiFetch } from './client';
import type { BlogPost, BlogPostFormData } from '@/types/blog-post';

interface StrapiListResponse<T> {
  data: T[];
  meta?: { pagination?: { total: number } };
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const data = await apiFetch<StrapiListResponse<BlogPost>>('/api/blog-posts', {
    auth: false,
    params: {
      'filters[publishedAt][$notNull]': true,
      'populate[author]': true,
      'pagination[pageSize]': 100,
      sort: 'createdAt:desc',
    },
  });
  return data.data || [];
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  const data = await apiFetch<StrapiListResponse<BlogPost>>('/api/blog-posts', {
    params: {
      'populate[author]': true,
      'pagination[pageSize]': 100,
      sort: 'createdAt:desc',
    },
  });
  return data.data || [];
}

export async function fetchPost(id: string): Promise<BlogPost | null> {
  const data = await apiFetch<{ data: BlogPost }>(`/api/blog-posts/${id}`, {
    params: { 'populate[author]': true },
  });
  return data.data;
}

export async function createPost(formData: BlogPostFormData): Promise<BlogPost> {
  const data = await apiFetch<{ data: BlogPost }>('/api/blog-posts', {
    method: 'POST',
    body: JSON.stringify({ data: formData }),
  });
  return data.data;
}

export async function updatePost(id: string, formData: Partial<BlogPostFormData>): Promise<BlogPost> {
  const data = await apiFetch<{ data: BlogPost }>(`/api/blog-posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data: formData }),
  });
  return data.data;
}

export async function publishPost(id: string): Promise<BlogPost> {
  const data = await apiFetch<{ data: BlogPost }>(`/api/blog-posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  });
  return data.data;
}

export async function unpublishPost(id: string): Promise<BlogPost> {
  const data = await apiFetch<{ data: BlogPost }>(`/api/blog-posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data: { publishedAt: null } }),
  });
  return data.data;
}

export async function deletePost(id: string): Promise<void> {
  await apiFetch(`/api/blog-posts/${id}`, { method: 'DELETE' });
}
