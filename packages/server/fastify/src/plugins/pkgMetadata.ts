import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { Auth } from '@verdaccio/auth';
import { pluginUtils } from '@verdaccio/core';
import { Manifest } from '@verdaccio/types';

/**
 * TODO: use @verdaccio/tarball
 * return package version from tarball name
 * @param {String} name
 * @deprecated use @verdaccio/tarball
 * @returns {String}
 */
export function getVersionFromTarball(name: string): string | void {
  const groups = name.match(/.+-(\d.+)\.tgz/);

  return groups !== null ? groups[1] : undefined;
}

export default fp(
  async (fastify: FastifyInstance) => {
    fastify.addHook<{
      Params: { scope: string; name: string; filename?: string; version?: string; tag?: string };
      Body: Manifest;
    }>('onRequest', function (request, _reply, done) {
      // TODO: scope is not implemented yet
      const { scope, name, tag, filename } = request.params;
      const packageName = typeof scope === 'string' ? `@${scope}/${name}` : name;
      // version could be a param initially
      let packageVersion: string | undefined = request.params.version;
      // when request is tarball request version comes with the tarball
      // eg: http://localhost:4873/@angular/cli/-/cli-8.3.5.tgz
      if (filename && typeof packageVersion !== 'string') {
        packageVersion = getVersionFromTarball(filename) || undefined;
      }
      const pkgMetadata: pluginUtils.AuthPluginPackage = {
        packageName,
        packageVersion,
        tag,
      };

      request.pkgMetadata = pkgMetadata;

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

  // @ts-ignore
  interface FastifyRequest {
    pkgMetadata: pluginUtils.AuthPluginPackage;
  }
}
