'use strict';

const permissionsToGrant = {
  product: ['find', 'findOne'],
  new: ['find', 'findOne'],
  career: ['find', 'findOne'],
  contact: ['create'],
  'carrer-application': ['create'],
};

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  const publicRole = await app.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  for (const [controller, actions] of Object.entries(permissionsToGrant)) {
    for (const action of actions) {
      const actionId = `api::${controller}.${controller}.${action}`;
      const existing = await app.query('plugin::users-permissions.permission').findOne({
        where: { action: actionId, role: publicRole.id },
      });
      if (existing) {
        console.log(`Already granted: ${actionId}`);
        continue;
      }
      await app.query('plugin::users-permissions.permission').create({
        data: { action: actionId, role: publicRole.id },
      });
      console.log(`Granted: ${actionId}`);
    }
  }

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
