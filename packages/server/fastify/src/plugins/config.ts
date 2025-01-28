import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { Config as AppConfig } from '@verdaccio/config';
import { ConfigYaml, Config as IConfig } from '@verdaccio/types';

export default fp(
  async function (fastify: FastifyInstance, opts: { config: ConfigYaml }) {
    const { config } = opts;
    const configInstance: IConfig = new AppConfig(Object.assign({}, config) as any);
    fastify.decorate('configInstance', configInstance);
  },
  {
    fastify: '>=4.x',
  }
);

declare module 'fastify' {
  // @ts-ignore
  interface FastifyInstance {
    configInstance: IConfig;
  }
}
