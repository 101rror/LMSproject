'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchProgress, markLessonComplete, calculateCourseProgress, fetchProgressForCourse } from '@/lib/api/progress';
import type { LessonProgress } from '@/types/lesson-progress';
import { ApiError } from '@/lib/api/client';

export function useProgress(studentId: number | null, courseId?: number) {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!studentId) { setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const data = await fetchProgress(studentId, courseId);
      setProgress(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  useEffect(() => { load(); }, [load]);

  const markComplete = useCallback(async (lessonId: number, cId: number) => {
    if (!studentId) return;
    const result = await markLessonComplete(studentId, lessonId, cId);
    setProgress((prev) => {
      const existing = prev.find((p) => p.lesson?.id === lessonId);
      if (existing) {
        return prev.map((p) => (p.lesson?.id === lessonId ? { ...p, completed: true } : p));
      }
      return [...prev, result];
    });
    return result;
  }, [studentId]);

  return { progress, loading, error, markComplete, reload: load };
}

export function useCourseProgress(studentId: number | null, courseId: number, totalLessons: number) {
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!studentId || totalLessons === 0) { setLoading(false); return; }
    setLoading(true);
    try {
      const pct = await calculateCourseProgress(studentId, courseId, totalLessons);
      setPercentage(pct);
    } catch {
      setPercentage(0);
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId, totalLessons]);

  useEffect(() => { load(); }, [load]);

  return { percentage, loading, reload: load };
}

export function useCourseProgressAll(courseId: number | null) {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!courseId) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await fetchProgressForCourse(courseId);
      setProgress(data);
    } catch {
      setProgress([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  return { progress, loading, reload: load };
}
