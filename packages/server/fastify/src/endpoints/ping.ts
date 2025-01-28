import { FastifyInstance } from 'fastify';

import { logger } from '@verdaccio/logger';

async function pingRoute(fastify: FastifyInstance) {
  fastify.get('/-/ping', () => {
    logger.http('ping');
    return {};
  });
}

export default pingRoute;
