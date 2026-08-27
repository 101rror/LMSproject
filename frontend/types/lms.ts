export type Course = { id: string; title: string; slug: string; description: string; category: string; level: string; lessons: number; duration: string; progress?: number; instructor: string; accent: string };
export type BlogPost = { id: string; title: string; excerpt: string; date: string; category: string; readTime: string };
export type User = { id: string; username: string; email: string; role: 'admin' | 'content_manager' | 'instructor' | 'student' };
