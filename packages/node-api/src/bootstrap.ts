import { assign, isObject, isFunction } from 'lodash';
import URL from 'url';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { Application } from 'express';
import constants from 'constants';

import { Callback } from '@verdaccio/types';
import { API_ERROR, certPem, csrPem, keyPem } from '@verdaccio/dev-commons';
import endPointAPI from '@verdaccio/server';
import { logger} from '@verdaccio/logger';

import { getListListenAddresses, resolveConfigPath } from './cli-utils';
import {displayExperimentsInfoBox} from "./experiments";

function launchServer(app, addr, config, configPath: string, pkgName: string, pkgVersion: string, callback: Callback): void {
  let webServer;
  if (addr.proto === 'https') {
    // https  must either have key cert and ca  or a pfx and (optionally) a passphrase
    if (!config.https || !((config.https.key && config.https.cert && config.https.ca) || config.https.pfx)) {
      logHTTPSWarning(configPath);
    }

    webServer = handleHTTPS(app, configPath, config);
  } else {
    // http
    webServer = http.createServer(app);
  }
  if (config.server && typeof config.server.keepAliveTimeout !== 'undefined' && config.server.keepAliveTimeout !== 'null') {
    // library definition for node is not up to date (doesn't contain recent 8.0 changes)
    webServer.keepAliveTimeout = config.server.keepAliveTimeout * 1000;
  }
  unlinkAddressPath(addr);

  callback(webServer, addr, pkgName, pkgVersion);
}

/**
 * Trigger the server after configuration has been loaded.
 * @param {Object} config
 * @param {Object} cliArguments
 * @param {String} configPath
 * @param {String} pkgVersion
 * @param {String} pkgName
 */
function startVerdaccio(config: any, cliListen: string, configPath: string, pkgVersion: string, pkgName: string, callback: Callback): void {
  if (isObject(config) === false) {
    throw new Error(API_ERROR.CONFIG_BAD_FORMAT);
  }

  if ('experiments' in config) {
    displayExperimentsInfoBox(config.experiments);
  }

  endPointAPI(config).then((app): void => {
      const addresses = getListListenAddresses(cliListen, config.listen);

      addresses.forEach(addr =>launchServer(app, addr, config, configPath, pkgName, pkgVersion, callback));
    }
  );
}

function unlinkAddressPath(addr) {
  if (addr.path && fs.existsSync(addr.path)) {
    fs.unlinkSync(addr.path);
  }
}

function logHTTPSWarning(storageLocation) {
  logger.fatal(
    [
      'You have enabled HTTPS and need to specify either ',
      '    "https.key", "https.cert" and "https.ca" or ',
      '    "https.pfx" and optionally "https.passphrase" ',
      'to run https server',
      '',
      // commands are borrowed from node.js docs
      'To quickly create self-signed certificate, use:',
      ' $ openssl genrsa -out ' + resolveConfigPath(storageLocation, keyPem) + ' 2048',
      ' $ openssl req -new -sha256 -key ' + resolveConfigPath(storageLocation, keyPem) + ' -out ' + resolveConfigPath(storageLocation, csrPem),
      ' $ openssl x509 -req -in ' +
        resolveConfigPath(storageLocation, csrPem) +
        ' -signkey ' +
        resolveConfigPath(storageLocation, keyPem) +
        ' -out ' +
        resolveConfigPath(storageLocation, certPem),
      '',
      'And then add to config file (' + storageLocation + '):',
      '  https:',
      `    key: ${resolveConfigPath(storageLocation, keyPem)}`,
      `    cert: ${resolveConfigPath(storageLocation, certPem)}`,
      `    ca: ${resolveConfigPath(storageLocation, csrPem)}`,
    ].join('\n')
  );
  process.exit(2);
}

function handleHTTPS(app, configPath, config) {
  try {
    let httpsOptions = {
      secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3, // disable insecure SSLv2 and SSLv3
    };

    if (config.https.pfx) {
      httpsOptions = assign(httpsOptions, {
        pfx: fs.readFileSync(config.https.pfx),
        passphrase: config.https.passphrase || '',
      });
    } else {
      httpsOptions = assign(httpsOptions, {
        key: fs.readFileSync(config.https.key),
        cert: fs.readFileSync(config.https.cert),
        ca: fs.readFileSync(config.https.ca),
      });
    }
    return https.createServer(httpsOptions, app);
  } catch (err) {
    // catch errors related to certificate loading
    logger.fatal({ err: err }, 'cannot create server: @{err.message}');
    process.exit(2);
  }
}

function listenDefaultCallback(webServer: Application, addr: any, pkgName: string, pkgVersion: string): void {
  webServer
    .listen(
      addr.port || addr.path,
      addr.host,
      (): void => {
        // send a message for tests
        if (isFunction(process.send)) {
          process.send({
            verdaccio_started: true,
          });
        }
      }
    )
    .on('error', function(err): void {
      logger.fatal({ err: err }, 'cannot create server: @{err.message}');
      process.exit(2);
    });

  logger.warn(
    {
      addr: addr.path
        ? URL.format({
            protocol: 'unix',
            pathname: addr.path,
          })
        : URL.format({
            protocol: addr.proto,
            hostname: addr.host,
            port: addr.port,
            pathname: '/',
          }),
      version: pkgName + '/' + pkgVersion,
    },
    'http address - @{addr} - @{version}'
  );
}

export { startVerdaccio, listenDefaultCallback };
