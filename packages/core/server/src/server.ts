import buildDebug from 'debug';
import fastify from 'fastify';

import { Config as AppConfig, createAnonymousRemoteUser } from '@verdaccio/config';
import { Config as IConfig, RemoteUser } from '@verdaccio/types';

import distTags from './endpoints/dist-tags';
import manifest from './endpoints/package';
import ping from './endpoints/ping';
import search from './endpoints/search';
import tarball from './endpoints/tarball';
import user from './endpoints/user';
import whoami from './endpoints/whoami';
import authPlugin from './plugins/auth';
import configPlugin from './plugins/config';
import coreUtils from './plugins/coreUtils';
import storagePlugin from './plugins/storage';
import login from './routes/web/api/login';
import readme from './routes/web/api/readme';
import sidebar from './routes/web/api/sidebar';

const debug = buildDebug('verdaccio:fastify');

async function startServer({ logger, config }) {
  // eslint-disable-next-line prettier/prettier
  const configInstance: IConfig = new AppConfig(Object.assign({}, config));
  debug('start server');
  const fastifyInstance = fastify({ logger });
  fastifyInstance.decorateRequest<RemoteUser>('userRemote', createAnonymousRemoteUser());
  fastifyInstance.register(coreUtils);
  fastifyInstance.register(configPlugin, { config });
  fastifyInstance.register(storagePlugin, { config: configInstance });
  fastifyInstance.register(authPlugin, { config: configInstance });

  // api
  fastifyInstance.register((instance, opts, done) => {
    instance.register(ping);
    instance.register(user, { prefix: '/-/user' });
    instance.register(search);
    instance.register(whoami);
    instance.register(manifest);
    instance.register(tarball);
    instance.register(distTags);
    instance.register(readme, { prefix: '/-/verdaccio' });
    instance.register(sidebar, { prefix: '/-/verdaccio' });
    instance.register(login, { prefix: '/-/verdaccio' });

    done();
  });

  // web
  fastifyInstance.register((instance, opts, done) => {
    instance.register(ping, { prefix: '/web' });
    done();
  });

  return fastifyInstance;
}

declare module 'fastify' {
  interface FastifyRequest {
    userRemote: RemoteUser;
  }
}

export default startServer;
