'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchResults } from '@/lib/api/results';
import type { QuizResult } from '@/types/quiz-result';
import { ApiError } from '@/lib/api/client';

export function useResults(studentId: number | null) {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!studentId) { setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const data = await fetchResults(studentId);
      setResults(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { load(); }, [load]);

  return { results, loading, error, reload: load };
}
