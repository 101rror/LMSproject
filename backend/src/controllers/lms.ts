import { courseForDocument, findDocument, relationId, requireRole, roleOf } from '../utils/lms-auth';

const userRoles = ['admin', 'content_manager', 'instructor', 'student'] as const;

function fail(ctx: any, error: Error): any {
    if (error.message === 'UNAUTHENTICATED') return ctx.unauthorized('Authentication is required.');
    if (error.message === 'FORBIDDEN') return ctx.forbidden('You do not have permission for this operation.');
    throw error;
}

export default {
    async enroll(ctx: any) {
        try {
            const user = requireRole(ctx, ['student']);
            const courseId = relationId(ctx.request.body?.data?.course ?? ctx.request.body?.course);
            if (!courseId) return ctx.badRequest('course is required.');
            const course = await findDocument('api::course.course', courseId);
            if (!course) return ctx.notFound('Course not found.');
            const existing = await strapi.documents('api::enrollment.enrollment').findMany({
                filters: { user: { id: user.id }, course: { documentId: String(courseId) } },
            });
            if (existing.length) return ctx.conflict('Student is already enrolled in this course.');
            const enrollment = await strapi.documents('api::enrollment.enrollment').create({
                data: { enrolledAt: new Date().toISOString(), user: { connect: [user.id] }, course: { connect: [courseId] } } as any,
            });
            return ctx.created(enrollment);
        } catch (error: any) { return fail(ctx, error); }
    },

    async markProgress(ctx: any) {
        try {
            const user = requireRole(ctx, ['student']);
            const lessonId = relationId(ctx.request.body?.data?.lesson ?? ctx.request.body?.lesson);
            if (!lessonId) return ctx.badRequest('lesson is required.');
            const lesson = await findDocument('api::lesson.lesson', lessonId, { course: true });
            if (!lesson) return ctx.notFound('Lesson not found.');
            const enrolled = await strapi.documents('api::enrollment.enrollment').findMany({ filters: { user: { id: user.id }, course: { documentId: String(relationId(lesson.course)) } } });
            if (!enrolled.length) return ctx.forbidden('Student is not enrolled in this course.');
            const existing = await strapi.documents('api::lesson-progress.lesson-progress').findMany({ filters: { user: { id: user.id }, lesson: { documentId: String(lessonId) } } });
            const data = { isCompleted: Boolean(ctx.request.body?.data?.isCompleted ?? ctx.request.body?.isCompleted ?? true), completedAt: new Date().toISOString() };
            const progress = existing[0]
                ? await strapi.documents('api::lesson-progress.lesson-progress').update({ documentId: existing[0].documentId, data })
                : await strapi.documents('api::lesson-progress.lesson-progress').create({ data: { ...data, user: { connect: [user.id] }, lesson: { connect: [lessonId] } } as any });
            return ctx.send(progress);
        } catch (error: any) { return fail(ctx, error); }
    },

    async courseProgress(ctx: any) {
        try {
            const user = requireRole(ctx, ['admin', 'content_manager', 'instructor', 'student']);
            const course = await findDocument('api::course.course', ctx.params.courseId, { lessons: true, instructor: true });
            if (!course) return ctx.notFound('Course not found.');
            if (roleOf(user) === 'instructor' && course.instructor?.id !== user.id) return ctx.forbidden('Course does not belong to this instructor.');
            const lessons = course.lessons || [];
            const progress = await strapi.documents('api::lesson-progress.lesson-progress').findMany({ filters: { user: { id: user.id }, lesson: { course: { documentId: String(ctx.params.courseId) } } } });
            const completed = progress.filter((item: any) => item.isCompleted).length;
            return ctx.send({ course: course.documentId, completedLessons: completed, totalLessons: lessons.length, percentage: lessons.length ? (completed / lessons.length) * 100 : 0 });
        } catch (error: any) { return fail(ctx, error); }
    },

    async submitQuiz(ctx: any) {
        try {
            const user = requireRole(ctx, ['student']);
            const quiz = await findDocument('api::quiz.quiz', ctx.params.quizId, { questions: true, course: true });
            if (!quiz) return ctx.notFound('Quiz not found.');
            const enrolled = await strapi.documents('api::enrollment.enrollment').findMany({ filters: { user: { id: user.id }, course: { documentId: String(relationId(quiz.course)) } } });
            if (!enrolled.length) return ctx.forbidden('Student is not enrolled in this course.');
            const answers = ctx.request.body?.data?.answers ?? ctx.request.body?.answers;
            if (!answers || typeof answers !== 'object') return ctx.badRequest('answers must be an object.');
            const questions = quiz.questions || [];
            if (!questions.length || questions.some((question: any) => !answers[question.documentId] && !answers[question.id])) return ctx.badRequest('An answer is required for every question.');
            const score = questions.reduce((total: number, question: any) => total + (String(answers[question.documentId] ?? answers[question.id]).toUpperCase() === question.correctAnswer ? 1 : 0), 0);
            const result = await strapi.documents('api::quiz-result.quiz-result').create({ data: { score, totalQuestions: questions.length, percentage: (score / questions.length) * 100, submittedAt: new Date().toISOString(), user: { connect: [user.id] }, quiz: { connect: [ctx.params.quizId] } } as any });
            return ctx.send({ result, score, totalQuestions: questions.length, percentage: (score / questions.length) * 100 });
        } catch (error: any) { return fail(ctx, error); }
    },

    async stats(ctx: any) {
        try {
            requireRole(ctx, ['admin']);
            const roles = await strapi.db.query('plugin::users-permissions.role').findMany({ select: ['type'] });
            const users = await strapi.db.query('plugin::users-permissions.user').count();
            const courses = await strapi.db.query('api::course.course').count();
            const enrollments = await strapi.db.query('api::enrollment.enrollment').count();
            const usersPerRole = roles.reduce((counts: Record<string, number>, role: any) => { counts[role.type] = (counts[role.type] || 0) + 1; return counts; }, {});
            return ctx.send({ totalUsers: users, usersPerRole, totalCourses: courses, totalEnrollments: enrollments });
        } catch (error: any) { return fail(ctx, error); }
    },

    async changeRole(ctx: any) {
        try {
            requireRole(ctx, ['admin']);
            const requestedRole = String(ctx.request.body?.data?.role ?? ctx.request.body?.role ?? '').toLowerCase().replace(/[ -]/g, '_');
            if (!userRoles.includes(requestedRole as any)) return ctx.badRequest('Invalid application role.');
            const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: requestedRole } });
            if (!role) return ctx.badRequest('Application role has not been initialized.');
            const user = await strapi.db.query('plugin::users-permissions.user').update({ where: { id: ctx.params.userId }, data: { role: role.id } });
            return ctx.send({ id: user.id, role: requestedRole });
        } catch (error: any) { return fail(ctx, error); }
    },
};
