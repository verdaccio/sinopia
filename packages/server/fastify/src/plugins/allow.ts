import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { Auth } from '@verdaccio/auth';
import { pluginUtils } from '@verdaccio/core';
import { RemoteUser } from '@verdaccio/types';

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
  async (fastify: FastifyInstance, opts: { type: string }) => {
    // ensure user remote is populated on every request
    fastify.addHook('preValidation', async function (request) {
      const remote: RemoteUser = request.userRemote;

      switch (opts.type) {
        case 'access':
          return new Promise((resolve, reject) => {
            return fastify.auth.allow_access(request.pkgMetadata, remote, (err, allowed) => {
              if (err) {
                return reject(err);
              }
              if (allowed === true) {
                return resolve();
              }
              return reject(fastify.errorUtils.getForbidden());
            });
          });
        case 'publish':
          return new Promise((resolve, reject) => {
            return fastify.auth.allow_publish(request.pkgMetadata, remote, (err, allowed) => {
              if (err) {
                return reject(err);
              }
              if (allowed === true) {
                return resolve();
              }
              return reject(fastify.errorUtils.getForbidden());
            });
          });
        case 'unpublish':
          return new Promise((resolve, reject) => {
            return fastify.auth.allow_unpublish(request.pkgMetadata, remote, (err, allowed) => {
              if (err) {
                return reject(err);
              }
              if (allowed === true) {
                return resolve();
              }
              return reject(fastify.errorUtils.getForbidden());
            });
          });
        default:
      }
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
    // TODO: scope not caugh yet.
    pkgScope?: string;
  }
}
