import { apiFetch } from './client';
import type { Quiz, QuizFormData } from '@/types/quiz';
import type { QuizQuestion, QuizQuestionFormData } from '@/types/quiz-question';

interface StrapiListResponse<T> {
  data: T[];
  meta?: { pagination?: { total: number } };
}

export async function fetchQuizzes(params?: { courseId?: string | number }): Promise<Quiz[]> {
  const queryParams: Record<string, string | number | boolean | undefined> = {
    'populate[course]': true,
    'populate[quiz_questions]': true,
    'pagination[pageSize]': 100,
  };
  if (params?.courseId) {
    queryParams['filters[course][id][$eq]'] = params.courseId;
  }
  const data = await apiFetch<StrapiListResponse<Quiz>>('/api/quizzes', {
    params: queryParams,
  });
  return data.data || [];
}

export async function fetchQuiz(id: string): Promise<Quiz | null> {
  const data = await apiFetch<{ data: Quiz }>(`/api/quizzes/${id}`, {
    params: {
      'populate[course]': true,
      'populate[quiz_questions]': true,
    },
  });
  return data.data;
}

export async function createQuiz(formData: QuizFormData): Promise<Quiz> {
  const data = await apiFetch<{ data: Quiz }>('/api/quizzes', {
    method: 'POST',
    body: JSON.stringify({ data: formData }),
  });
  return data.data;
}

export async function updateQuiz(id: string, formData: Partial<QuizFormData>): Promise<Quiz> {
  const data = await apiFetch<{ data: Quiz }>(`/api/quizzes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data: formData }),
  });
  return data.data;
}

export async function deleteQuiz(id: string): Promise<void> {
  await apiFetch(`/api/quizzes/${id}`, { method: 'DELETE' });
}

export async function createQuizQuestion(formData: QuizQuestionFormData): Promise<QuizQuestion> {
  const data = await apiFetch<{ data: QuizQuestion }>('/api/quiz-questions', {
    method: 'POST',
    body: JSON.stringify({ data: formData }),
  });
  return data.data;
}

export async function updateQuizQuestion(id: string, formData: Partial<QuizQuestionFormData>): Promise<QuizQuestion> {
  const data = await apiFetch<{ data: QuizQuestion }>(`/api/quiz-questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data: formData }),
  });
  return data.data;
}

export async function deleteQuizQuestion(id: string): Promise<void> {
  await apiFetch(`/api/quiz-questions/${id}`, { method: 'DELETE' });
}
