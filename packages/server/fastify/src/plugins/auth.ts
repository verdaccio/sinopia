import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { Auth } from '@verdaccio/auth';
import { logger } from '@verdaccio/logger';
import { Config as IConfig } from '@verdaccio/types';

export default fp(
  async function (fastify: FastifyInstance, opts: { config: IConfig; filters?: unknown }) {
    const { config } = opts;
    const auth = new Auth(config, logger);
    await auth.init();
    fastify.decorate('auth', auth);
  },
  {
    fastify: '>=4.x',
  }
);

declare module 'fastify' {
  // @ts-ignore
  interface FastifyInstance {
    auth: Auth;
  }
}
