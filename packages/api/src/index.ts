import bodyParser from 'body-parser';
import express, { Router } from 'express';

import { Auth } from '@verdaccio/auth';
import {
  antiLoop,
  encodeScopePackage,
  match,
  validateName,
  validatePackage,
} from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Config, Logger } from '@verdaccio/types';

import distTags from './dist-tags';
import pkg from './package';
import ping from './ping';
import publish from './publish';
import search from './search';
import stars from './stars';
import user from './user';
import login from './v1/login';
import profile from './v1/profile';
import v1Search from './v1/search';
import token from './v1/token';
import whoami from './whoami';

export default function (config: Config, auth: Auth, storage: Storage, logger: Logger): Router {
  /* eslint new-cap:off */
  const app = express.Router();
  /* eslint new-cap:off */

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  app.param('package', validatePackage);
  app.param('filename', validateName);
  app.param('tag', validateName);
  app.param('version', validateName);
  app.param('revision', validateName);
  app.param('token', validateName);

  // Express route parameter names must be valid JavaScript identifiers, which means
  // they cannot start with a hyphen (-) or contain special characters like dots (.)
  app.param('_rev', match(/^-rev$/));
  app.param('org_couchdb_user', match(/^org\.couchdb\.user:/));

  app.use(auth.apiJWTmiddleware());
  app.use(express.json({ strict: false, limit: config.max_body_size || '10mb' }));
  app.use(antiLoop(config));
  // TODO : to be removed once we have a react login route
  app.use(bodyParser.urlencoded({ extended: true }));
  // encode / in a scoped package name to be matched as a single parameter in routes
  app.use(encodeScopePackage);
  // for "npm whoami"
  whoami(app);
  profile(app, auth, config);
  search(app, logger);
  user(app, auth, config, logger);
  distTags(app, auth, storage, logger);
  publish(app, auth, storage, logger);
  ping(app);
  login(app, auth, storage, config);
  stars(app, storage);
  v1Search(app, auth, storage, logger);
  token(app, auth, storage, config, logger);
  pkg(app, auth, storage, logger);
  return app;
}
