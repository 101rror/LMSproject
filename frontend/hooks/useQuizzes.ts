'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchQuizzes, fetchQuiz, createQuiz, updateQuiz, deleteQuiz,
  createQuizQuestion, updateQuizQuestion, deleteQuizQuestion
} from '@/lib/api/quizzes';
import type { Quiz, QuizFormData } from '@/types/quiz';
import type { QuizQuestion, QuizQuestionFormData } from '@/types/quiz-question';
import { ApiError } from '@/lib/api/client';

export function useQuizzes(courseId?: string | number) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetchQuizzes({ courseId });
      setQuizzes(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  return { quizzes, loading, error, reload: load };
}

export function useQuiz(id: string | null) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const data = await fetchQuiz(id);
      setQuiz(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { quiz, loading, error, reload: load };
}

export function useQuizMutations() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: QuizFormData) => {
    setSaving(true); setError(null);
    try { return await createQuiz(data); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to create quiz'); throw e; }
    finally { setSaving(false); }
  }, []);

  const update = useCallback(async (id: string, data: Partial<QuizFormData>) => {
    setSaving(true); setError(null);
    try { return await updateQuiz(id, data); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to update quiz'); throw e; }
    finally { setSaving(false); }
  }, []);

  const remove = useCallback(async (id: string) => {
    setSaving(true); setError(null);
    try { await deleteQuiz(id); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to delete quiz'); throw e; }
    finally { setSaving(false); }
  }, []);

  const addQuestion = useCallback(async (data: QuizQuestionFormData) => {
    setSaving(true); setError(null);
    try { return await createQuizQuestion(data); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to add question'); throw e; }
    finally { setSaving(false); }
  }, []);

  const updateQuestion = useCallback(async (id: string, data: Partial<QuizQuestionFormData>) => {
    setSaving(true); setError(null);
    try { return await updateQuizQuestion(id, data); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to update question'); throw e; }
    finally { setSaving(false); }
  }, []);

  const removeQuestion = useCallback(async (id: string) => {
    setSaving(true); setError(null);
    try { await deleteQuizQuestion(id); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to delete question'); throw e; }
    finally { setSaving(false); }
  }, []);

  return { create, update, remove, addQuestion, updateQuestion, removeQuestion, saving, error };
}
