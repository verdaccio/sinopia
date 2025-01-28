import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { Auth } from '@verdaccio/auth';
import { createAnonymousRemoteUser } from '@verdaccio/config';
import { Config as IConfig } from '@verdaccio/types';

export default fp(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function (fastify: FastifyInstance, _opts: { config: IConfig; filters?: unknown }) {
    // ensure user remote is populated on every request
    fastify.addHook('onRequest', (request, _reply, done) => {
      request.userRemote = createAnonymousRemoteUser();
      done();
    });
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
