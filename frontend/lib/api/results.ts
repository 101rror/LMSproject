import { apiFetch } from './client';
import type { QuizResult } from '@/types/quiz-result';

interface StrapiListResponse<T> {
  data: T[];
  meta?: { pagination?: { total: number } };
}

export async function fetchResults(studentId?: number): Promise<QuizResult[]> {
  const params: Record<string, string | number | boolean | undefined> = {
    'populate[student]': true,
    'populate[quiz]': true,
    'populate[quiz][populate][course]': true,
    'pagination[pageSize]': 100,
  };
  if (studentId) {
    params['filters[student][id][$eq]'] = studentId;
  }
  const data = await apiFetch<StrapiListResponse<QuizResult>>('/api/quiz-results', {
    params,
  });
  return data.data || [];
}

export async function createQuizResult(
  studentId: number,
  quizId: number,
  score: number,
  totalQuestions: number
): Promise<QuizResult> {
  const data = await apiFetch<{ data: QuizResult }>('/api/quiz-results', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        student: studentId,
        quiz: quizId,
        score,
        total_questions: totalQuestions,
      },
    }),
  });
  return data.data;
}
