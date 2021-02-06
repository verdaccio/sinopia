import buildDebug from 'debug';
import _ from 'lodash';
import {
  formatAuthor,
  convertDistRemoteToLocalTarballUrls,
  getLocalRegistryTarballUri,
  isVersionValid,
} from '@verdaccio/utils';
import sanitizyReadme from '@verdaccio/readme';
import { sortByName, formatAuthor, getLocalRegistryTarballUri } from '@verdaccio/utils';

import { allow, $RequestExtend, $ResponseExtend, $NextFunctionVer } from '@verdaccio/middleware';
import { logger } from '@verdaccio/logger';
import { Router } from 'express';
import { IAuth } from '@verdaccio/auth';
import { IStorageHandler } from '@verdaccio/store';
import { Config, Package, RemoteUser, Version } from '@verdaccio/types';

import { addGravatarSupport, AuthorAvatar, parseReadme } from '../web-utils';
import { generateGravatarUrl } from '../user';
import { deleteProperties, addScope, sortByName } from '../web-utils2';
import { addGravatarSupport, AuthorAvatar, parseReadme } from '../utils/web-utils';
import { AuthorAvatar } from '../utils/web-utils';
import { generateGravatarUrl } from '../utils/user';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

const getOrder = (order = 'asc') => {
  return order === 'asc';
};

export type PackageExt = Package & { author: AuthorAvatar; dist?: { tarball: string } };

const debug = buildDebug('verdaccio:web:api:package');

function addPackageWebApi(
  route: Router,
  storage: IStorageHandler,
  auth: IAuth,
  config: Config
): void {
  debug('initialized package web api');
  const checkAllow = (name: string, remoteUser: RemoteUser): Promise<boolean> =>
    new Promise((resolve, reject): void => {
      try {
        auth.allow_access({ packageName: name }, remoteUser, (err, allowed): void => {
          if (err) {
            resolve(false);
          }
          resolve(allowed);
        });
      } catch (err) {
        reject(err);
      }
    });

  // Get list of all visible package
  route.get(
    '/packages',
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      debug('hit package web api %o');
      storage.getLocalDatabase(async function (err, packages): Promise<void> {
        if (err) {
          throw err;
        }
        async function processPackages(packages: PackageExt[] = []): Promise<PackageExt[]> {
          const permissions: PackageExt[] = [];
          const packagesToProcess = packages.slice();
          debug('process packages %o', packagesToProcess);
          for (const pkg of packagesToProcess) {
            const pkgCopy = { ...pkg };
            pkgCopy.author = formatAuthor(pkg.author);
            try {
              if (await checkAllow(pkg.name, req.remote_user)) {
                if (config.web) {
                  pkgCopy.author.avatar = generateGravatarUrl(
                    pkgCopy.author.email,
                    config.web.gravatar
                  );
                }
                if (!_.isNil(pkgCopy.dist) && !_.isNull(pkgCopy.dist.tarball)) {
                  pkgCopy.dist.tarball = getLocalRegistryTarballUri(
                    pkgCopy.dist.tarball,
                    pkg.name,
                    req,
                    config.url_prefix
                  );
                }
                permissions.push(pkgCopy);
              }
            } catch (err) {
              debug('process packages error %o', err);
              logger.logger.error(
                { name: pkg.name, error: err },
                'permission process for @{name} has failed: @{error}'
              );
              throw err;
            }
          }

          return permissions;
        }

        const order = getOrder(config?.web?.sort_packages);
        debug('order %o', order);

        try {
          next(sortByName(await processPackages(packages), order));
        } catch (error) {
          next(error);
        }
      });
    }
  );
}

export default addPackageWebApi;
