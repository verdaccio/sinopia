/**
 * @prettier
 * @flow
 */

import request from 'request';
import semver from 'semver';
import { red, green, blue, white, bold } from 'kleur';
import _ from 'lodash';

import { UPDATE_BANNER, DEFAULT_REGISTRY, HTTP_STATUS } from './constants';

const VERDACCIO_LATEST_REGISTRY_URL = `${DEFAULT_REGISTRY}/verdaccio/latest`;

/**
 * Creates NPM update banner using kleur
 */
export function createBanner(currentVersion: string, newVersion: string, releaseType: string): string {
  const changelog = `${UPDATE_BANNER.CHANGELOG_URL}v${newVersion}`;
  const versionUpdate = `${bold().red(currentVersion)} → ${bold().green(newVersion)}`;
  const banner = `
        ${white().bold('A new ' + _.upperCase(releaseType) + ' version of Verdaccio is available. ' + versionUpdate)}
        ${white().bold('Run ' + green('npm install -g verdaccio') + ' to update.')}
        ${white().bold('Registry: ' + DEFAULT_REGISTRY)}
        ${blue().bold('Changelog: ' + changelog)}
    `;
  return banner;
}

/**
 * creates error banner
 */
export function createErrorBanner(message: string): string {
  const banner = `
        ${red().bold('Unable to check verdaccio version on ' + DEFAULT_REGISTRY)}
        ${red().bold('Error: ' + message)}
    `;
  return banner;
}

/**
 * Show verdaccio update banner on start
 */
export function verdaccioUpdateBanner(pkgVersion: string) {
  request(VERDACCIO_LATEST_REGISTRY_URL, function(error: ?Object = null, response: Object = {}) {
    if (!error && response.statusCode === HTTP_STATUS.OK && response.body) {
      // In case, NPM does not returns version, keeping version equals to
      // verdaccio version.
      const { version = pkgVersion } = JSON.parse(response.body);
      const releaseType = semver.diff(version, pkgVersion);

      if (releaseType && semver.gt(version, pkgVersion)) {
        const banner = createBanner(pkgVersion, version, releaseType);
        /* eslint-disable-next-line */
        console.log(banner);
      }
    } else {
      const errorBanner = createErrorBanner(JSON.stringify(error));
      /* eslint-disable-next-line */
      console.log(errorBanner);
    }
  });
}
