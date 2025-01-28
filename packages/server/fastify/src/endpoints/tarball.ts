import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';

import { HEADERS, HEADER_TYPE } from '@verdaccio/core';

import allow from '../plugins/allow';
import pkgMetadata from '../plugins/pkgMetadata';

const debug = buildDebug('verdaccio:fastify:tarball');

interface ParamsInterface {
  package: string;
  filename: string;
}

async function tarballRoute(fastify: FastifyInstance) {
  fastify.register(pkgMetadata);
  fastify.register(allow, { type: 'access' });

  fastify.get<{ Params: ParamsInterface }>('/:package/-/:filename', async (request, reply) => {
    const { package: pkg, filename } = request.params;
    debug('stream tarball for %s@%s', pkg, filename);
    const abort = new AbortController();
    const stream = (await fastify.storage.getTarball(pkg, filename, {
      signal: abort.signal,
      // enableRemote: true,
    })) as any;

    stream.on('content-length', (size: number) => {
      reply.header(HEADER_TYPE.CONTENT_LENGTH, size);
    });

    // https://nodejs.org/dist/latest-v18.x/docs/api/http.html#event-close
    request.socket.on('close', () => {
      abort.abort();
    });

    return stream;
  });

  interface ScopeParamsInterface {
    filename: string;
    scope: string;
    name: string;
  }

  fastify.get<{ Params: ScopeParamsInterface }>(
    '/:scope/:name/-/:filename',
    async (request, reply) => {
      const abort = new AbortController();
      const { scope, name, filename } = request.params;
      const scopedPackage = `${scope}/${name}`;
      debug('stream scope tarball for %s@%s', scopedPackage, filename);
      const stream = (await fastify.storage.getTarball(scopedPackage, filename, {
        signal: abort.signal,
        // enableRemote: true,
      })) as any;

      stream.on('content-length', (size: number) => {
        reply.header(HEADER_TYPE.CONTENT_LENGTH, size);
      });

      // https://nodejs.org/dist/latest-v18.x/docs/api/http.html#event-close
      request.socket.on('close', () => {
        abort.abort();
      });

      reply.header(HEADERS.CONTENT_TYPE, HEADERS.OCTET_STREAM);
      return stream;
    }
  );
}

export default tarballRoute;
