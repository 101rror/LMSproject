'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchEnrollments, createEnrollment, checkEnrollment, fetchEnrollmentsByCourse } from '@/lib/api/enrollments';
import type { Enrollment } from '@/types/enrollment';
import { ApiError } from '@/lib/api/client';

export function useEnrollments(studentId: number | null) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!studentId) { setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const data = await fetchEnrollments(studentId);
      setEnrollments(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { load(); }, [load]);

  const enroll = useCallback(async (courseId: number) => {
    if (!studentId) return;
    const enrollment = await createEnrollment(studentId, courseId);
    setEnrollments((prev) => [...prev, enrollment]);
    return enrollment;
  }, [studentId]);

  return { enrollments, loading, error, enroll, reload: load };
}

export function useEnrollmentStatus(studentId: number | null, courseId: number | null) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    if (!studentId || !courseId) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await checkEnrollment(studentId, courseId);
      setEnrollment(data);
    } catch {
      setEnrollment(null);
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  useEffect(() => { check(); }, [check]);

  return { enrollment, loading, reload: check };
}

export function useCourseEnrollments(courseId: number | null) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!courseId) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await fetchEnrollmentsByCourse(courseId);
      setEnrollments(data);
    } catch {
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  return { enrollments, loading, reload: load };
}
