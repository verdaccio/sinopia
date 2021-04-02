import { Command, Option } from 'clipanion';
import * as t from 'typanion';

import { ConfigRuntime } from '@verdaccio/types';
import { findConfigFile, parseConfigFile } from '@verdaccio/config';
import { startVerdaccio, listenDefaultCallback } from '@verdaccio/node-api';

export const DEFAULT_PROCESS_NAME: string = 'verdaccio';

export class InitCommand extends Command {
  static paths = [Command.Default];

  listen = Option.String('--listen', {
    description: 'host:port number to listen on (default: localhost:4873)',
    required: false,
    validator: t.isString(),
  });

  config = Option.String('--config', {
    description: 'use this configuration file (default: ./config.yaml)',
    required: false,
    validator: t.isString(),
  });

  async execute() {
    let configPathLocation;
    let verdaccioConfiguration: ConfigRuntime;
    try {
      configPathLocation = findConfigFile(this.config as string);
      verdaccioConfiguration = parseConfigFile(configPathLocation);
      const { web, https } = verdaccioConfiguration;

      process.title = web?.title || DEFAULT_PROCESS_NAME;

      if (!https) {
        verdaccioConfiguration = Object.assign({}, verdaccioConfiguration, {
          https: { enable: false },
        });
      }

      const { version, name } = require('../../package.json');

      startVerdaccio(
        verdaccioConfiguration,
        this.listen as string,
        configPathLocation,
        version,
        name,
        listenDefaultCallback
      );
    } catch (err) {
      process.exit(1);
    }
  }
}

// export default function initProgram(commander, pkgVersion, pkgName) {
//   const cliListener = commander.listen;
//   let configPathLocation;
//   let verdaccioConfiguration: ConfigRuntime;
//   try {
//     configPathLocation = findConfigFile(commander.config);
//     verdaccioConfiguration = parseConfigFile(configPathLocation);
//     const { web, https } = verdaccioConfiguration;

//     process.title = web?.title || DEFAULT_PROCESS_NAME;

//     if (!https) {
//       verdaccioConfiguration = Object.assign({}, verdaccioConfiguration, {
//         https: { enable: false },
//       });
//     }

//     // initLogger.warn({file: configPathLocation}, 'config file  - @{file}');

//     startVerdaccio(
//       verdaccioConfiguration,
//       cliListener,
//       configPathLocation,
//       pkgVersion,
//       pkgName,
//       listenDefaultCallback
//     );
//   } catch (err) {
//     process.exit(1);
//   }
// }
