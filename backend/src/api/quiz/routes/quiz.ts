/**
 * quiz router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::quiz.quiz', { config: { find: { policies: ['global::lms-authorization'] }, findOne: { policies: ['global::lms-authorization'] }, create: { policies: ['global::lms-authorization'] }, update: { policies: ['global::lms-authorization'] }, delete: { policies: ['global::lms-authorization'] } } });
