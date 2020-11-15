import fs from 'fs';
import YAML from 'js-yaml';
import { APP_ERROR } from '@verdaccio/commons-api';
import { ConfigRuntime, ConfigYaml } from '@verdaccio/types';

export function parseConfigFile(configPath: string): ConfigRuntime {
  try {
    if (/\.ya?ml$/i.test(configPath)) {
      const yamlConfig = YAML.safeLoad(fs.readFileSync(configPath, 'utf8')) as ConfigYaml;
      return Object.assign({}, yamlConfig, {
        config_path: configPath,
      });
    }

    const jsonConfig = require(configPath) as ConfigYaml;
    return Object.assign({}, jsonConfig, {
      config_path: configPath,
    });
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      e.message = APP_ERROR.CONFIG_NOT_VALID;
    }

    throw new Error(e);
  }
}
