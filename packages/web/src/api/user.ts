import _ from 'lodash';
import buildDebug from 'debug';
import { Router, Response, Request } from 'express';

import { Config, RemoteUser, JWTSignOptions } from '@verdaccio/types';

import { API_ERROR, APP_ERROR, HTTP_STATUS } from '@verdaccio/commons-api';
import { IAuth } from '@verdaccio/auth';
import { validatePassword, ErrorCode } from '@verdaccio/utils';
import { $NextFunctionVer } from './package';

const debug = buildDebug('verdaccio:web:api:user');

function addUserAuthApi(route: Router, auth: IAuth, config: Config): void {
  route.post('/login', function (req: Request, res: Response, next: $NextFunctionVer): void {
    const { username, password } = req.body;
    debug('authenticate %o', username);
    auth.authenticate(username, password, async (err, user: RemoteUser): Promise<void> => {
      if (err) {
        const errorCode = err.message ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.INTERNAL_ERROR;
        debug('error authenticate %o', errorCode);
        next(ErrorCode.getCode(errorCode, err.message));
      } else {
        req.remote_user = user;
        const jWTSignOptions: JWTSignOptions = config.security.web.sign;

        next({
          token: await auth.jwtEncrypt(user, jWTSignOptions),
          username: req.remote_user.name,
        });
      }
    });
  });

  if (config?.flags?.changePassword === true) {
    route.put(
      '/reset_password',
      function (req: Request, res: Response, next: $NextFunctionVer): void {
        if (_.isNil(req.remote_user.name)) {
          res.status(HTTP_STATUS.UNAUTHORIZED);
          return next({
            // FUTURE: update to a more meaningful message
            message: API_ERROR.MUST_BE_LOGGED,
          });
        }

        const { password } = req.body;
        const { name } = req.remote_user;

        if (validatePassword(password.new) === false) {
          auth.changePassword(
            name as string,
            password.old,
            password.new,
            (err, isUpdated): void => {
              if (_.isNil(err) && isUpdated) {
                next({
                  ok: true,
                });
              } else {
                return next(ErrorCode.getInternalError(API_ERROR.INTERNAL_SERVER_ERROR));
              }
            }
          );
        } else {
          return next(ErrorCode.getCode(HTTP_STATUS.BAD_REQUEST, APP_ERROR.PASSWORD_VALIDATION));
        }
      }
    );
  }
}

export default addUserAuthApi;
