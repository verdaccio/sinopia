import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';

import { stringUtils } from '@verdaccio/core';
import { Storage } from '@verdaccio/store';
import { Manifest, Version } from '@verdaccio/types';

import allow from '../plugins/allow';
import pkgMetadata from '../plugins/pkgMetadata';

const debug = buildDebug('verdaccio:fastify:api:sidebar');
export type $SidebarPackage = Manifest & { latest: Version };

interface ParamsInterface {
  name: string;
  version: string;
}

async function manifestRoute(fastify: FastifyInstance) {
  fastify.register(pkgMetadata);
  fastify.register(allow, { type: 'access' });

  fastify.get<{ Params: ParamsInterface }>('/:name', async (request) => {
    const { name } = request.params;
    const storage = fastify.storage;
    debug('pkg name %s ', name);
    // @ts-ignore
    const abbreviated =
      stringUtils.getByQualityPriorityValue(request.headers['accept']) ===
      Storage.ABBREVIATED_HEADER;
    const data = await storage?.getPackageByOptions({
      name,
      // @ts-ignore
      uplinksLook: true,
      requestOptions: {
        protocol: request.protocol,
        headers: request.headers as any,
        host: request.hostname,
        // @ts-ignore
        username: request?.userRemote?.name,
      },
      abbreviated,
    });
    return data;
  });

  interface QueryInterface {
    write: string;
  }

  fastify.get<{ Params: ParamsInterface; Querystring: QueryInterface }>(
    '/:name/:version',
    async (request) => {
      const { name, version } = request.params;
      const storage = fastify.storage;
      const write = request.query.write === 'true';
      debug('pkg name %s, with version / tag: %s ', name, version);
      const requestOptions = {
        protocol: request.protocol,
        headers: request.headers as any,
        host: request.hostname,
        remoteAddress: request.socket.remoteAddress,
        byPassCache: write,
      };
      const data = await storage?.getPackageByOptions({
        name,
        version,
        uplinksLook: true,
        requestOptions,
      });
      return data;
    }
  );
}

export default manifestRoute;
