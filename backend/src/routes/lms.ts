export default {
    routes: [
        { method: 'POST', path: '/lms/enroll', handler: 'global::lms.enroll', config: { policies: ['global::lms-authorization'] } },
        { method: 'POST', path: '/lms/progress', handler: 'global::lms.markProgress', config: { policies: ['global::lms-authorization'] } },
        { method: 'GET', path: '/lms/progress/course/:courseId', handler: 'global::lms.courseProgress', config: { policies: ['global::lms-authorization'] } },
        { method: 'POST', path: '/lms/quiz/:quizId/submit', handler: 'global::lms.submitQuiz', config: { policies: ['global::lms-authorization'] } },
        { method: 'GET', path: '/lms/stats', handler: 'global::lms.stats', config: { policies: ['global::lms-authorization'] } },
        { method: 'PUT', path: '/lms/users/:userId/role', handler: 'global::lms.changeRole', config: { policies: ['global::lms-authorization'] } },
    ],
};
