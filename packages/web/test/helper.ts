import { Application } from 'express';
import path from 'path';

import apiMiddleware from '@verdaccio/api';
import { parseConfigFile } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
import { initializeServer as initializeServerHelper } from '@verdaccio/test-helper';

import routes from '../src';

setup([]);

export const getConf = (configName: string) => {
  const configPath = path.join(__dirname, 'config', configName);
  return parseConfigFile(configPath);
};

// @deprecated
export async function initializeServer(configName): Promise<Application> {
  return initializeServerHelper(getConf(configName), [apiMiddleware, routes]);
}
