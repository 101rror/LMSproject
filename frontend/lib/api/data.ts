import type { BlogPost, Course } from '@/types/lms';

export const courses: Course[] = [
    { id: '1', title: 'The Creative Strategist', slug: 'creative-strategist', description: 'Learn to turn a good idea into a clear, compelling direction.', category: 'Design thinking', level: 'Intermediate', lessons: 12, duration: '4h 20m', instructor: 'Maya Chen', accent: 'bg-[#dcebe1]' },
    { id: '2', title: 'Make Space for Focus', slug: 'make-space-for-focus', description: 'A practical reset for your attention, habits, and working rhythm.', category: 'Productivity', level: 'Beginner', lessons: 8, duration: '2h 45m', instructor: 'Jon Bell', accent: 'bg-[#f2d9bf]' },
    { id: '3', title: 'Writing with Texture', slug: 'writing-with-texture', description: 'Find your voice and make every sentence feel like it belongs.', category: 'Communication', level: 'Intermediate', lessons: 10, duration: '3h 10m', instructor: 'Ari Okafor', accent: 'bg-[#d8e2eb]' },
    { id: '4', title: 'Build Better Questions', slug: 'build-better-questions', description: 'The deceptively powerful skill behind better research and decisions.', category: 'Research', level: 'Advanced', lessons: 9, duration: '3h 40m', instructor: 'Priya Shah', accent: 'bg-[#ead8df]' },
];
export const posts: BlogPost[] = [
    { id: '1', title: 'The value of a slower first draft', excerpt: 'Why giving ideas room to be unfinished often leads to better work.', date: 'Aug 18, 2026', category: 'Learning notes', readTime: '4 min read' },
    { id: '2', title: 'A field guide to useful feedback', excerpt: 'Specific, kind, and actionable: the three qualities that make feedback land.', date: 'Aug 04, 2026', category: 'Practice', readTime: '6 min read' },
    { id: '3', title: 'Learning in public, gently', excerpt: 'Small rituals for sharing progress without turning growth into performance.', date: 'Jul 21, 2026', category: 'Community', readTime: '5 min read' },
];
