import buildDebug from 'debug';
import path from 'path';

import { parseConfigFile } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';

import server from '../src/index';

const debug = buildDebug('verdaccio:fastify:debug');

/**
 * This file is intended for fast development and debug, it should
 * be removed eventually and the app start from @verdaccio/cli package.
 */
(async () => {
  try {
    const configFile = path.join(__dirname, './fastify-conf.yaml');
    debug('configFile %s', configFile);
    const configParsed = parseConfigFile(configFile);
    // @ts-ignore
    setup(configParsed.log);
    logger.info(`config location ${configFile}`);
    debug('configParsed %s', configParsed);
    process.title = 'fastify-verdaccio';
    const ser = await server(configParsed);
    await ser.listen(4873);
    logger.info('fastify running on port 4873');
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
})();
