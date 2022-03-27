import bodyParser from 'body-parser';
import express, { Application } from 'express';
import os from 'os';
import path from 'path';

import { Auth, IAuth } from '@verdaccio/auth';
import { Config } from '@verdaccio/config';
import { errorReportingMiddleware, final, handleError } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { generateRandomHexString } from '@verdaccio/utils';

export async function initializeServer(
  configName,
  routesMiddleware: any[] = []
): Promise<Application> {
  const app = express();
  const config = new Config(configName);
  config.storage = path.join(os.tmpdir(), '/storage', generateRandomHexString());
  const storage = new Storage(config);
  await storage.init(config, []);
  const auth: IAuth = new Auth(config);
  // TODO: this might not be need it, used in apiEndpoints
  app.use(bodyParser.json({ strict: false, limit: '10mb' }));
  // @ts-ignore
  app.use(errorReportingMiddleware);
  // @ts-ignore
  routesMiddleware.map((route: any) => {
    app.use(route(config, auth, storage));
  });
  // @ts-ignore
  app.use(handleError);
  // @ts-ignore
  app.use(final);

  app.use(function (request, response) {
    response.status(590);
    response.json({ error: 'cannot handle this' });
  });

  return app;
}
