const chalk = require('chalk');
const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {VerdaccioConfig} = require("../src/verdaccio-server");
const VerdaccioProcess = require("../src/server_process");
const Server = require("../src/server");


const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    const config1 = new VerdaccioConfig(path.join(__dirname, './store-e2e'),
      path.join(__dirname, './config-e2e.yaml'), 'http://0.0.0.0:55558/', 55558);
    const server1 = new Server.default(config1.domainPath);
    const process1 = new VerdaccioProcess.default(config1, server1, false);
    const fork = await process1.init();
    this.global.__VERDACCIO_E2E__ = fork[0];

    console.log(chalk.yellow('Setup Test Environment.'));
    await super.setup();
    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found')
    }
    this.global.__SERVER__ = server1;
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    })
  }

  async teardown() {
    console.log(chalk.yellow('Teardown Test Environment.'));
    await super.teardown();
    this.global.__VERDACCIO_E2E__.stop();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;
