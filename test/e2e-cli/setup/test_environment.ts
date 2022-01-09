import NodeEnvironment from 'jest-environment-node';
import os from 'os';
import path from 'path';

const fs = require('fs');
const __global = require('../utils/global');
// import { npm } from '../utils/process';

class E2ECliTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    const tempRoot = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'verdaccio-suite-test-'));
    __global.addItem('dir-root', tempRoot);
    this.global.__namespace = __global;
    // eslint-disable-next-line no-console
    console.log(`current directory: ${process.cwd()}`);
  }

  async teardown() {}

  runScript(script): any {
    return super.runScript(script);
  }
}

export default E2ECliTestEnvironment;
