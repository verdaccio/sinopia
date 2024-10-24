import { randomUUID } from 'crypto';
import { Request, Response, Router } from 'express';
import { isUUID } from 'validator';

import { Auth, getApiToken } from '@verdaccio/auth';
import { createRemoteUser } from '@verdaccio/config';
import { HEADERS, HTTP_STATUS, errorUtils } from '@verdaccio/core';
import { Storage } from '@verdaccio/store';
import { Config, RemoteUser } from '@verdaccio/types';
import { getAuthenticatedMessage } from '@verdaccio/utils';

import { $NextFunctionVer } from '../../types/custom';

function addNpmLoginApi(route: Router, auth: Auth, storage: Storage, config: Config): void {
  route.post('/-/v1/login', function (req: Request, res: Response): void {
    const sessionId = randomUUID();
    res.status(200).json({
      loginUrl: 'http://localhost:8000/-/v1/login/cli/' + sessionId,
      doneUrl: 'http://localhost:8000/-/v1/done?sessionId=' + sessionId,
    });
  });
  route.get('/-/v1/done', function (req: Request, res: Response): void {
    if (!req.query.sessionId) {
      res.status(400).json({ error: 'missing session id' });
      return;
    }

    const sessionId = req.query.sessionId.toString();
    if (!isUUID(sessionId, 4)) {
      res.status(400).json({ error: 'invalid session id' });
      return;
    }
    // const tokens = storage.readTokens();
    // TODO : check if the token have been created in storage with the sessionId as key
    const ready = false;

    if (!ready) {
      // TODO : variable retry-after should be configurable in the config
      res.header('retry-after', '5');
      res.status(202).json({});
      return;
    }
    res.status(200).json({ token: 'sample_token_not working' });
  });

  route.get('/-/v1/login/cli/:sessionId', function (req: Request, res: Response): void {
    // TODO : This should be a webUI route but i dunno how to do it with React
    res.send(`
      <form action="/-/v1/login/cli/${req.params.sessionId}" method="post">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required><br><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required><br><br>
        <input type="submit" value="Login">
      </form>
    `);
  });

  route.post(
    '/-/v1/login/cli/:sessionId',
    async function (req: Request, res: Response, next: $NextFunctionVer): Promise<void> {
      const { username, password } = req.body;

      if (!req.params.sessionId) {
        res.status(400).json({ error: 'missing session id' });
        return;
      }

      const sessionId = req.params.sessionId.toString();
      if (!isUUID(sessionId, 4)) {
        res.status(400).json({ error: 'invalid session id' });
        return;
      }

      // Perform authentication logic here
      auth.authenticate(
        username,
        password,
        async function callbackAuthenticate(err, user): Promise<void> {
          if (err) {
            return next(errorUtils.getCode(HTTP_STATUS.UNAUTHORIZED, err.message));
          }

          const restoredRemoteUser: RemoteUser = createRemoteUser(username, user?.groups || []);
          const token = await getApiToken(auth, config, restoredRemoteUser, password);

          if (!token) {
            return next(errorUtils.getUnauthorized());
          }

          res.status(HTTP_STATUS.CREATED);
          res.set(HEADERS.CACHE_CONTROL, 'no-cache, no-store');

          const message = getAuthenticatedMessage(restoredRemoteUser.name ?? '');
          // TODO : save the token in storage with the sessionId as key
          await storage.saveToken({
            user: restoredRemoteUser.name as string,
            token: token,
            key: sessionId,
            readonly: false,
            created: '',
          });
          return next({
            ok: message,
          });
        }
      );
    }
  );
}

export default addNpmLoginApi;
