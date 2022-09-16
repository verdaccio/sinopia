import { join } from 'path';

import { exec } from '@verdaccio/test-cli-commons';

export function getCommand(projectFolder) {
  return join(projectFolder, './.yarn/releases/yarn.js');
}

export function getYarnCommand() {
  // FUTURE: yarn 4 rc still not available via registry
  // tags: https://repo.yarnpkg.com/tags
  // download binary: https://repo.yarnpkg.com/4.0.0-rc.14/packages/yarnpkg-cli/bin/yarn.js
  return join(__dirname, './bin/yarn-4.0.0-rc.14.cjs');
}

export function yarn(projectFolder, ...args: string[]) {
  return exec({ cwd: projectFolder }, getCommand(projectFolder), args);
}
