type Context = any;
type User = any;

export const applicationRoles = ['admin', 'content_manager', 'instructor', 'student'] as const;
export type ApplicationRole = (typeof applicationRoles)[number];

export function roleOf(user: User): ApplicationRole | null {
    const type = String(user?.role?.type || '').toLowerCase().replace(/[ -]/g, '_');
    return applicationRoles.includes(type as ApplicationRole) ? (type as ApplicationRole) : null;
}

export function requireAuthenticatedUser(ctx: Context): User {
    if (!ctx.state?.user) {
        throw new Error('UNAUTHENTICATED');
    }
    return ctx.state.user;
}

export function requireRole(ctx: Context, roles: ApplicationRole[]): User {
    const user = requireAuthenticatedUser(ctx);
    if (!roles.includes(roleOf(user) as ApplicationRole)) {
        throw new Error('FORBIDDEN');
    }
    return user;
}

export function httpError(ctx: Context, code: number, message: string): never {
    if (code === 401) ctx.unauthorized(message);
    if (code === 403) ctx.forbidden(message);
    throw new Error(message);
}

export function relationId(value: any): string | number | undefined {
    if (value == null) return undefined;
    if (typeof value === 'object') return value.documentId ?? value.id;
    return value;
}

export async function findDocument(uid: string, id: string | number, populate: any = {}): Promise<any> {
    return strapi.documents(uid as any).findOne({ documentId: String(id), populate });
}

export async function courseForDocument(uid: string, id: string | number): Promise<any> {
    const entity = await findDocument(uid, id, { course: { populate: ['instructor'] }, quiz: { populate: { course: { populate: ['instructor'] } } } });
    if (!entity) return null;
    if (uid === 'api::course.course') return entity;
    if (uid === 'api::lesson.lesson' || uid === 'api::quiz.quiz') return entity.course;
    if (uid === 'api::quiz-question.quiz-question') return entity.quiz?.course;
    if (uid === 'api::lesson-progress.lesson-progress') return entity.lesson?.course;
    if (uid === 'api::quiz-result.quiz-result') return entity.quiz?.course;
    if (uid === 'api::enrollment.enrollment') return entity.course;
    return null;
}

export function isOwner(user: User, owner: any): boolean {
    return Boolean(owner && (owner.id === user.id || owner.documentId === user.documentId));
}
