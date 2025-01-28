import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { logger } from '@verdaccio/logger';
import { Storage } from '@verdaccio/store';
import { Config as IConfig } from '@verdaccio/types';

export default fp(
  async function (fastify: FastifyInstance, opts: { config: IConfig; filters?: unknown }) {
    const { config } = opts;
    const storage: Storage = new Storage(config, logger);
    // @ts-ignore
    await storage.init(config, []);
    fastify.decorate('storage', storage);
  },
  {
    fastify: '>=4.x',
  }
);

declare module 'fastify' {
  // @ts-ignore
  interface FastifyInstance {
    storage: Storage;
  }
}
