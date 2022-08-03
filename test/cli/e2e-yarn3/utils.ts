import { join } from 'path';

import { exec } from '@verdaccio/test-cli-commons';

export function getCommand(projectFolder) {
  return join(projectFolder, './.yarn/releases/yarn.js');
}

export function getYarnCommand() {
  return join('./node_modules/@yarnpkg/cli-dist/bin/yarn.js');
}

export function yarn(projectFolder, ...args: string[]) {
  return exec({ cwd: projectFolder }, getCommand(projectFolder), args);
}
