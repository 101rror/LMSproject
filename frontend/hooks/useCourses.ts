'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchCourses, fetchInstructorCourses, createCourse, updateCourse, deleteCourse } from '@/lib/api/courses';
import type { Course, CourseFormData } from '@/types/course';
import { ApiError } from '@/lib/api/client';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { courses, loading, error, reload: load };
}

export function useInstructorCourses(instructorId: number | null) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!instructorId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInstructorCourses(instructorId);
      setCourses(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [instructorId]);

  useEffect(() => { load(); }, [load]);

  return { courses, loading, error, reload: load };
}

export function useCourseMutations() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: CourseFormData) => {
    setSaving(true); setError(null);
    try { return await createCourse(data); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to create course'); throw e; }
    finally { setSaving(false); }
  }, []);

  const update = useCallback(async (id: string, data: Partial<CourseFormData>) => {
    setSaving(true); setError(null);
    try { return await updateCourse(id, data); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to update course'); throw e; }
    finally { setSaving(false); }
  }, []);

  const remove = useCallback(async (id: string) => {
    setSaving(true); setError(null);
    try { await deleteCourse(id); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to delete course'); throw e; }
    finally { setSaving(false); }
  }, []);

  return { create, update, remove, saving, error };
}
