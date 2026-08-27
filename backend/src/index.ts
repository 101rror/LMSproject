// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    const roles = [
      ['admin', 'Admin'],
      ['content_manager', 'Content Manager'],
      ['instructor', 'Instructor'],
      ['student', 'Student'],
    ];

    for (const [type, name] of roles) {
      const existing = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type } });
      if (!existing) {
        await strapi.db.query('plugin::users-permissions.role').create({
          data: { name, type, description: `${name} application role` },
        });
      }
    }
  },
};
