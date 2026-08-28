'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchPublishedPosts, fetchAllPosts, fetchPost,
  createPost, updatePost, deletePost, publishPost, unpublishPost
} from '@/lib/api/blog';
import type { BlogPost, BlogPostFormData } from '@/types/blog-post';
import { ApiError } from '@/lib/api/client';

export function usePublishedPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetchPublishedPosts();
      setPosts(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { posts, loading, error, reload: load };
}

export function useAllPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetchAllPosts();
      setPosts(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { posts, loading, error, reload: load };
}

export function usePost(id: string | null) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const data = await fetchPost(id);
      setPost(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load blog post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { post, loading, error, reload: load };
}

export function useBlogMutations() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: BlogPostFormData) => {
    setSaving(true); setError(null);
    try { return await createPost(data); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to create post'); throw e; }
    finally { setSaving(false); }
  }, []);

  const update = useCallback(async (id: string, data: Partial<BlogPostFormData>) => {
    setSaving(true); setError(null);
    try { return await updatePost(id, data); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to update post'); throw e; }
    finally { setSaving(false); }
  }, []);

  const remove = useCallback(async (id: string) => {
    setSaving(true); setError(null);
    try { await deletePost(id); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to delete post'); throw e; }
    finally { setSaving(false); }
  }, []);

  const publish = useCallback(async (id: string) => {
    setSaving(true); setError(null);
    try { return await publishPost(id); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to publish post'); throw e; }
    finally { setSaving(false); }
  }, []);

  const unpublish = useCallback(async (id: string) => {
    setSaving(true); setError(null);
    try { return await unpublishPost(id); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Failed to unpublish post'); throw e; }
    finally { setSaving(false); }
  }, []);

  return { create, update, remove, publish, unpublish, saving, error };
}
