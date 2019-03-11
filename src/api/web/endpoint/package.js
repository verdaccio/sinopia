/**
 * @prettier
 * @flow
 */

import _ from 'lodash';
import { addScope, addGravatarSupport, deleteProperties, sortByName, parseReadme, formatAuthor } from '../../../lib/utils';
import { allow } from '../../middleware';
import { DIST_TAGS, HEADER_TYPE, HEADERS, HTTP_STATUS } from '../../../lib/constants';
import { generateGravatarUrl } from '../../../utils/user';
import logger from '../../../lib/logger';
import type { Router } from 'express';
import type { IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler, $SidebarPackage } from '../../../../types';
import type { Config } from '@verdaccio/types';

const getOrder = (order = 'asc') => {
  return order === 'asc';
};

function addPackageWebApi(route: Router, storage: IStorageHandler, auth: IAuth, config: Config) {
  const can = allow(auth);

  const checkAllow = (name, remoteUser) =>
    new Promise((resolve, reject) => {
      try {
        auth.allow_access({ packageName: name }, remoteUser, (err, allowed) => {
          if (err) {
            resolve(false);
          } else {
            resolve(allowed);
          }
        });
      } catch (err) {
        reject(err);
      }
    });

  // Get list of all visible package
  route.get('/packages', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    storage.getLocalDatabase(async function(err, packages) {
      if (err) {
        throw err;
      }

      async function processPermissionsPackages(packages = []) {
        const permissions = [];
        const packgesCopy = packages.slice();
        for (const pkg of packgesCopy) {
          const pkgCopy = { ...pkg };
          pkgCopy.author = formatAuthor(pkg.author);
          try {
            if (await checkAllow(pkg.name, req.remote_user)) {
              if (config.web) {
                pkgCopy.author.avatar = generateGravatarUrl(pkgCopy.author.email, config.web.gravatar);
              }
              permissions.push(pkgCopy);
            }
          } catch (err) {
            logger.logger.error({ name: pkg.name, error: err }, 'permission process for @{name} has failed: @{error}');
            throw err;
          }
        }

        return permissions;
      }

      const { web } = config;
      // $FlowFixMe
      const order: boolean = config.web ? getOrder(web.sort_packages) : true;

      next(sortByName(await processPermissionsPackages(packages), order));
    });
  });

  // Get package readme
  route.get('/package/readme/(@:scope/)?:package/:version?', can('access'), function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const packageName = req.params.scope ? addScope(req.params.scope, req.params.package) : req.params.package;

    storage.getPackage({
      name: packageName,
      uplinksLook: true,
      req,
      callback: function(err, info) {
        if (err) {
          return next(err);
        }

        res.set(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_PLAIN);
        next(parseReadme(info.name, info.readme));
      },
    });
  });

  route.get('/sidebar/(@:scope/)?:package', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const packageName: string = req.params.scope ? addScope(req.params.scope, req.params.package) : req.params.package;

    storage.getPackage({
      name: packageName,
      uplinksLook: true,
      keepUpLinkData: true,
      req,
      callback: function(err: Error, info: $SidebarPackage) {
        if (_.isNil(err)) {
          let sideBarInfo: any = _.clone(info);
          sideBarInfo.latest = info.versions[info[DIST_TAGS].latest];
          sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
          sideBarInfo = deleteProperties(['readme', '_attachments', '_rev', 'name'], sideBarInfo);
          if (config.web) {
            sideBarInfo = addGravatarSupport(sideBarInfo, config.web.gravatar);
          } else {
            sideBarInfo = addGravatarSupport(sideBarInfo);
          }
          next(sideBarInfo);
        } else {
          res.status(HTTP_STATUS.NOT_FOUND);
          res.end();
        }
      },
    });
  });
}

export default addPackageWebApi;
