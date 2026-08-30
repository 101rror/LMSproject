import { courseForDocument, relationId, roleOf } from '../utils/lms-auth';

const managedRoles = ['admin', 'content_manager'];

function getRequestBody(ctx: any): any {
    return ctx.request?.body?.data ?? ctx.request?.body ?? {};
}

function getRequestUserId(ctx: any): any {
    const body = getRequestBody(ctx);
    return relationId(body?.user ?? body?.userId ?? body?.data?.user ?? body?.data?.userId);
}

function getQueryUserId(ctx: any): any {
    const filters = ctx.request?.query?.filters ?? {};
    const userFilter = filters.user ?? filters['user'];
    if (!userFilter) return undefined;
    if (typeof userFilter === 'object') {
        return relationId(userFilter.id ?? userFilter.documentId ?? userFilter.$eq);
    }
    return relationId(userFilter);
}

async function getCourseFromContext(ctx: any, fallbackResource?: string): Promise<any> {
    const body = getRequestBody(ctx);
    const candidateId = relationId(
        body?.course ??
        body?.courseId ??
        body?.lesson?.course ??
        body?.quiz?.course ??
        ctx.params?.courseId ??
        ctx.params?.id ??
        ctx.params?.documentId
    );

    if (candidateId) {
        return courseForDocument('api::course.course', candidateId);
    }

    if (fallbackResource) {
        const resourceId = relationId(ctx.params?.id ?? ctx.params?.documentId);
        if (resourceId) {
            return courseForDocument(fallbackResource, resourceId);
        }
    }

    return null;
}

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

    if (!user) {
        if (path.startsWith('/api/courses') && method === 'GET') return true;
        if (path.startsWith('/api/blog-posts') && method === 'GET') return true;
        return false;
    }

    if (!role) return false;

    if (path === '/api/users/me' || path.startsWith('/api/users/me')) return true;
    if (path.startsWith('/api/users')) return role === 'admin';
    if (path.includes('/lms/stats')) return role === 'admin';
    if (path.includes('/lms/users/') && path.includes('/role')) return role === 'admin';

    const match = path.match(/^\/api\/([^/]+)(?:\/([^/]+))?/);
    const resource = match?.[1];
    const id = match?.[2];

    if (!resource) return true;

    if (resource === 'blog-posts') {
        if (method === 'GET') return true;
        return managedRoles.includes(role);
    }

    if (resource === 'courses') {
        if (method === 'GET') return true;
        if (managedRoles.includes(role)) return true;

        if (role !== 'instructor') return false;
        if (method === 'POST') return true;

        const courseId = id ?? relationId(getRequestBody(ctx)?.course ?? getRequestBody(ctx)?.courseId);
        if (!courseId) return false;

        const course = await courseForDocument('api::course.course', courseId);
        return Boolean(course?.instructor && course.instructor.id === user.id);
    }

    if (resource === 'lessons') {
        if (managedRoles.includes(role)) return true;

        if (role === 'instructor') {
            if (method === 'POST') {
                const courseId = relationId(getRequestBody(ctx)?.course ?? getRequestBody(ctx)?.courseId);
                if (!courseId) return false;
                const course = await courseForDocument('api::course.course', courseId);
                return Boolean(course?.instructor && course.instructor.id === user.id);
            }

            if (!id) return false;
            const course = await courseForDocument('api::lesson.lesson', id);
            return Boolean(course?.instructor && course.instructor.id === user.id);
        }

        if (role === 'student') {
            if (method !== 'GET') return false;
            if (!id) return false;
            const course = await courseForDocument('api::lesson.lesson', id);
            if (!course) return false;

            const enrollment = await strapi.documents('api::enrollment.enrollment').findMany({
                filters: {
                    user: { id: user.id },
                    course: { documentId: String(course.documentId ?? course.id) },
                },
            });

            return enrollment.length > 0;
        }

        return false;
    }

    if (resource === 'quizzes' || resource === 'quiz-questions') {
        if (managedRoles.includes(role)) return true;

        if (role === 'instructor') {
            if (method === 'POST') {
                const courseId = relationId(getRequestBody(ctx)?.course ?? getRequestBody(ctx)?.courseId ?? getRequestBody(ctx)?.quiz?.course);
                if (!courseId) return false;
                const course = await courseForDocument('api::course.course', courseId);
                return Boolean(course?.instructor && course.instructor.id === user.id);
            }

            if (!id) return false;
            const targetUid = resource === 'quizzes' ? 'api::quiz.quiz' : 'api::quiz-question.quiz-question';
            const course = await courseForDocument(targetUid, id);
            return Boolean(course?.instructor && course.instructor.id === user.id);
        }

        if (role === 'student') {
            if (method !== 'GET') return false;
            if (!id) return false;
            const targetUid = resource === 'quizzes' ? 'api::quiz.quiz' : 'api::quiz-question.quiz-question';
            const course = await courseForDocument(targetUid, id);
            if (!course) return false;

            const enrollment = await strapi.documents('api::enrollment.enrollment').findMany({
                filters: {
                    user: { id: user.id },
                    course: { documentId: String(course.documentId ?? course.id) },
                },
            });

            return enrollment.length > 0;
        }

        return false;
    }

    if (resource === 'enrollments') {
        if (managedRoles.includes(role)) return true;
        if (role !== 'student') return false;

        if (method === 'POST') {
            const requestedUserId = getRequestUserId(ctx);
            return requestedUserId == null || Number(requestedUserId) === Number(user.id);
        }

        if (method === 'GET') {
            const userId = getQueryUserId(ctx);
            return userId == null || Number(userId) === Number(user.id);
        }

        return false;
    }

    if (resource === 'lesson-progress' || resource === 'quiz-results') {
        if (managedRoles.includes(role)) return true;

        if (role === 'student') {
            if (method === 'GET') {
                const userId = getQueryUserId(ctx);
                return userId == null || Number(userId) === Number(user.id);
            }

            const requestedUserId = getRequestUserId(ctx);
            return requestedUserId == null || Number(requestedUserId) === Number(user.id);
        }

        if (role === 'instructor') {
            if (method === 'GET') {
                const userId = getQueryUserId(ctx);
                if (userId != null && Number(userId) !== Number(user.id)) {
                    return false;
                }
                return true;
            }
            return false;
        }

        return false;
    }

    return true;
};
