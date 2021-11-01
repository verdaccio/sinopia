import { Router } from 'express';
import _ from 'lodash';
import mime from 'mime';

import { IAuth } from '@verdaccio/auth';
import { VerdaccioError, constants } from '@verdaccio/core';
import { allow, media } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Package } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

export default function (route: Router, auth: IAuth, storage: Storage): void {
  const can = allow(auth);
  const tag_package_version = function (
    req: $RequestExtend,
    res: $ResponseExtend,
    next: $NextFunctionVer
  ): $NextFunctionVer {
    if (_.isString(req.body) === false) {
      return next('route');
    }

    const tags = {};
    tags[req.params.tag] = req.body;
    storage.mergeTags(req.params.package, tags, function (err: Error): $NextFunctionVer {
      if (err) {
        return next(err);
      }
      res.status(constants.HTTP_STATUS.CREATED);
      return next({ ok: constants.API_MESSAGE.TAG_ADDED });
    });
  };

  // tagging a package.
  route.put('/:package/:tag', can('publish'), media(mime.getType('json')), tag_package_version);

  route.post(
    '/-/package/:package/dist-tags/:tag',
    can('publish'),
    media(mime.getType('json')),
    tag_package_version
  );

  route.put(
    '/-/package/:package/dist-tags/:tag',
    can('publish'),
    media(mime.getType('json')),
    tag_package_version
  );

  route.delete(
    '/-/package/:package/dist-tags/:tag',
    can('publish'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      const tags = {};
      tags[req.params.tag] = null;
      storage.mergeTags(req.params.package, tags, function (err: VerdaccioError): $NextFunctionVer {
        if (err) {
          return next(err);
        }
        res.status(constants.HTTP_STATUS.CREATED);
        return next({
          ok: constants.API_MESSAGE.TAG_REMOVED,
        });
      });
    }
  );

  route.get(
    '/-/package/:package/dist-tags',
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      storage.getPackage({
        name: req.params.package,
        uplinksLook: true,
        req,
        callback: function (err: VerdaccioError, info: Package): $NextFunctionVer {
          if (err) {
            return next(err);
          }

          next(info[constants.DIST_TAGS]);
        },
      });
    }
  );

  route.post(
    '/-/package/:package/dist-tags',
    can('publish'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      storage.mergeTags(
        req.params.package,
        req.body,
        function (err: VerdaccioError): $NextFunctionVer {
          if (err) {
            return next(err);
          }
          res.status(constants.HTTP_STATUS.CREATED);
          return next({
            ok: constants.API_MESSAGE.TAG_UPDATED,
          });
        }
      );
    }
  );
}
