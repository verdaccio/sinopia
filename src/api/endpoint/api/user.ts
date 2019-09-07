import _ from 'lodash';
import Cookies from 'cookies';

import { ErrorCode } from '../../../lib/utils';
import { API_ERROR, API_MESSAGE, HTTP_STATUS } from '../../../lib/constants';
import { createRemoteUser, createSessionToken, getApiToken, getAuthenticatedMessage, validatePassword } from '../../../lib/auth-utils';
import { logger } from '../../../lib/logger';

import { Config, RemoteUser } from '@verdaccio/types';
import { Response, Router } from 'express';
import { $RequestExtend, $ResponseExtend, $NextFunctionVer, IAuth } from '../../../../types';

export default function(route: Router, auth: IAuth, config: Config): void {
  route.get('/-/user/:org_couchdb_user', function(req: $RequestExtend, res: Response, next: $NextFunctionVer): void {
    res.status(HTTP_STATUS.OK);
    next({
      ok: getAuthenticatedMessage(req.remote_user.name),
    });
  });

  route.put('/-/user/:org_couchdb_user/:_rev?/:revision?', function(req: $RequestExtend, res: Response, next: $NextFunctionVer): void {
    const { name, password } = req.body;
    const remoteName = req.remote_user.name;

    if (_.isNil(remoteName) === false && _.isNil(name) === false && remoteName === name) {
      auth.authenticate(name, password, async function callbackAuthenticate(err, user): Promise<void> {
        if (err) {
          logger.trace({ name, err }, 'authenticating for user @{username} failed. Error: @{err.message}');
          return next(ErrorCode.getCode(HTTP_STATUS.UNAUTHORIZED, API_ERROR.BAD_USERNAME_PASSWORD));
        }

        const restoredRemoteUser: RemoteUser = createRemoteUser(name, user.groups || []);
        const token = await getApiToken(auth, config, restoredRemoteUser, password);

        res.status(HTTP_STATUS.CREATED);

        return next({
          ok: getAuthenticatedMessage(req.remote_user.name),
          token,
        });
      });
    } else {
      if (validatePassword(password) === false) {
        // eslint-disable-next-line new-cap
        return next(ErrorCode.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.PASSWORD_SHORT()));
      }

      auth.add_user(name, password, async function(err, user): Promise<void> {
        if (err) {
          if (err.status >= HTTP_STATUS.BAD_REQUEST && err.status < HTTP_STATUS.INTERNAL_ERROR) {
            // With npm registering is the same as logging in,
            // and npm accepts only an 409 error.
            // So, changing status code here.
            return next(ErrorCode.getCode(err.status, err.message) || ErrorCode.getConflict(err.message));
          }
          return next(err);
        }

        const token = name && password ? await getApiToken(auth, config, user, password) : undefined;

        req.remote_user = user;
        res.status(HTTP_STATUS.CREATED);
        return next({
          ok: `user '${req.body.name}' created`,
          token,
        });
      });
    }
  });

  route.delete('/-/user/token/*', function(req: $RequestExtend, res: Response, next: $NextFunctionVer): void {
    res.status(HTTP_STATUS.OK);
    next({
      ok: API_MESSAGE.LOGGED_OUT,
    });
  });

  // placeholder 'cause npm require to be authenticated to publish
  // we do not do any real authentication yet
  route.post('/_session', Cookies.express(), function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    res.cookies.set('AuthSession', String(Math.random()), createSessionToken());

    next({
      ok: true,
      name: 'somebody',
      roles: [],
    });
  });
}
