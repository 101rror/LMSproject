import { courseForDocument, relationId, roleOf, requireAuthenticatedUser } from '../utils/lms-auth';

const managedRoles = ['admin', 'content_manager'];
const instructorRoles = ['admin', 'content_manager', 'instructor'];

export default async (policyContext: any) => {
    const ctx = policyContext;
    const user = ctx.state?.user;
    const path = String(ctx.request.path || '');
    const method = String(ctx.request.method || 'GET').toUpperCase();
    const role = roleOf(user);

    if (path.startsWith('/api/blog-posts') && method === 'GET') {
        ctx.query = ctx.query || {};
        ctx.query.filters = { ...(ctx.query.filters || {}), publishedAt: { $notNull: true } };
        return true;
    }

    if (!user) return false;
    if (!role) return false;

    if (path.startsWith('/api/users')) return role === 'admin';
    if (path.includes('/lms/stats')) return role === 'admin';

    const match = path.match(/^\/api\/([^/]+)(?:\/([^/]+))?/);
    const resource = match?.[1];
    const id = match?.[2];

    if (!resource) return true;
    if (resource === 'blog-posts') return managedRoles.includes(role) && method !== 'GET';
    if (resource === 'courses') {
        if (method === 'GET') return true;
        if (managedRoles.includes(role)) return true;
        if (role !== 'instructor' || !id) return false;
        const course = await courseForDocument('api::course.course', id);
        return Boolean(course?.instructor && course.instructor.id === user.id);
    }

    const ownedResources = ['lessons', 'quizzes', 'quiz-questions'];
    if (ownedResources.includes(resource)) {
        if (method === 'GET' && role === 'student') return true;
        if (managedRoles.includes(role)) return true;
        if (role !== 'instructor' || !id) return false;
        const uid = resource === 'lessons' ? 'api::lesson.lesson' : resource === 'quizzes' ? 'api::quiz.quiz' : 'api::quiz-question.quiz-question';
        const course = await courseForDocument(uid, id);
        return Boolean(course?.instructor && course.instructor.id === user.id);
    }

    if (resource === 'enrollments' || resource === 'lesson-progress' || resource === 'quiz-results') {
        return ['admin', 'content_manager', 'instructor', 'student'].includes(role);
    }

    return true;
};
