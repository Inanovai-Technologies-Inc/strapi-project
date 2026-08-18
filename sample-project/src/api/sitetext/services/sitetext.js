'use strict';

/**
 * sitetext service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sitetext.sitetext');
