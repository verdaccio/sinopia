import fs from 'fs';
import assert from 'assert';
import DefaultURL, { URL } from 'url';
import { generateGravatarUrl, GENERIC_AVATAR } from '../utils/user';
import { StringValue, AuthorAvatar } from '../../types';
import { APP_ERROR, DEFAULT_PORT, DEFAULT_DOMAIN, DEFAULT_PROTOCOL, HEADERS, DIST_TAGS, DEFAULT_USER } from './constants';
import { normalizeContributors } from './storage-utils';
import { logger } from './logger';
import _ from 'lodash';
import buildDebug from 'debug';
import semver from 'semver';
import YAML from 'js-yaml';
import validator from 'validator';
import memoizee from 'memoizee';
import sanitizyReadme from '@verdaccio/readme';

import { Package, Version, Author } from '@verdaccio/types';
import { Request } from 'express';
// eslint-disable-next-line max-len
import { getConflict, getBadData, getBadRequest, getInternalError, getUnauthorized, getForbidden, getServiceUnavailable, getNotFound, getCode } from '@verdaccio/commons-api';

const debug = buildDebug('verdaccio');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('pkginfo')(module);
const pkgVersion = module.exports.version;
const pkgName = module.exports.name;
const validProtocols = ['https', 'http'];

export function getUserAgent(customUserAgent?: boolean | string): string {
  assert(_.isString(pkgName));
  assert(_.isString(pkgVersion));
  if (customUserAgent === true) {
    return `${pkgName}/${pkgVersion}`;
  } else if (_.isString(customUserAgent) && _.isEmpty(customUserAgent) === false) {
    return customUserAgent;
  } else if (customUserAgent === false) {
    return '';
  }

  return `${pkgName}/${pkgVersion}`;
}

export function convertPayloadToBase64(payload: string): Buffer {
  return Buffer.from(payload, 'base64');
}

/**
 * From normalize-package-data/lib/fixer.js
 * @param {*} name  the package name
 * @return {Boolean} whether is valid or not
 */
export function validateName(name: string): boolean {
  if (_.isString(name) === false) {
    return false;
  }

  const normalizedName: string = name.toLowerCase();

  /**
   * Some context about the first regex
   * - npm used to have a different tarball naming system.
   * eg: http://registry.npmjs.com/thirty-two
   * https://registry.npmjs.org/thirty-two/-/thirty-two@0.0.1.tgz
   * The file name thirty-two@0.0.1.tgz, the version and the pkg name was separated by an at (@)
   * while nowadays the naming system is based in dashes
   * https://registry.npmjs.org/verdaccio/-/verdaccio-1.4.0.tgz
   *
   * more info here: https://github.com/rlidwka/sinopia/issues/75
   */
  return !(
    !normalizedName.match(/^[-a-zA-Z0-9_.!~*'()@]+$/) ||
    normalizedName.startsWith('.') || // ".bin", etc.
    ['node_modules', '__proto__', 'favicon.ico'].includes(normalizedName)
  );
}

/**
 * Validate a package.
 * @return {Boolean} whether the package is valid or not
 */
export function validatePackage(name: string): boolean {
  const nameList = name.split('/', 2);
  if (nameList.length === 1) {
    // normal package
    return validateName(nameList[0]);
  }
  // scoped package
  return nameList[0][0] === '@' && validateName(nameList[0].slice(1)) && validateName(nameList[1]);
}

/**
 * Check whether an element is an Object
 * @param {*} obj the element
 * @return {Boolean}
 */
export function isObject(obj: any): boolean {
  return _.isObject(obj) && _.isNull(obj) === false && _.isArray(obj) === false;
}

export function isObjectOrArray(obj: any): boolean {
  return _.isObject(obj) && _.isNull(obj) === false;
}

/**
 * Validate the package metadata, add additional properties whether are missing within
 * the metadata properties.
 * @param {*} object
 * @param {*} name
 * @return {Object} the object with additional properties as dist-tags ad versions
 */
export function validateMetadata(object: Package, name: string): Package {
  assert(isObject(object), 'not a json object');
  assert.strictEqual(object.name, name);

  if (!isObject(object[DIST_TAGS])) {
    object[DIST_TAGS] = {};
  }

  if (!isObject(object['versions'])) {
    object['versions'] = {};
  }

  if (!isObject(object['time'])) {
    object['time'] = {};
  }

  return object;
}

export function extractTarballFromUrl(url: string): string {
  // @ts-ignore
  return DefaultURL.parse(url).pathname.replace(/^.*\//, '');
}

/**
 * Iterate a packages's versions and filter each original tarball url.
 * @param {*} pkg
 * @param {*} req
 * @param {*} config
 * @return {String} a filtered package
 */
export function convertDistRemoteToLocalTarballUrls(pkg: Package, req: Request, urlPrefix: string | void): Package {
  for (const ver in pkg.versions) {
    if (Object.prototype.hasOwnProperty.call(pkg.versions, ver)) {
      const distName = pkg.versions[ver].dist;

      if (_.isNull(distName) === false && _.isNull(distName.tarball) === false) {
        distName.tarball = getLocalRegistryTarballUri(distName.tarball, pkg.name, req, urlPrefix);
      }
    }
  }
  return pkg;
}

const memoizedgetPublicUrl = memoizee(getPublicUrl);

/**
 * Filter a tarball url.
 * @param {*} uri
 * @return {String} a parsed url
 */
export function getLocalRegistryTarballUri(uri: string, pkgName: string, req: Request, urlPrefix: string | void): string {
  const currentHost = req.get('host');

  if (!currentHost) {
    return uri;
  }
  const tarballName = extractTarballFromUrl(uri);
  const domainRegistry = memoizedgetPublicUrl(urlPrefix || '', req);

  return `${domainRegistry}${encodeScopedUri(pkgName)}/-/${tarballName}`;
}

export function tagVersion(data: Package, version: string, tag: StringValue): boolean {
  if (tag && data[DIST_TAGS][tag] !== version && semver.parse(version, true)) {
    // valid version - store
    data[DIST_TAGS][tag] = version;
    return true;
  }
  return false;
}

/**
 * Gets version from a package object taking into account semver weirdness.
 * @return {String} return the semantic version of a package
 */
export function getVersion(pkg: Package, version: any): Version | void {
  // this condition must allow cast
  if (_.isNil(pkg.versions[version]) === false) {
    return pkg.versions[version];
  }

  try {
    version = semver.parse(version, true);
    for (const versionItem in pkg.versions) {
      // $FlowFixMe
      if (version.compare(semver.parse(versionItem, true)) === 0) {
        return pkg.versions[versionItem];
      }
    }
  } catch (err) {
    return undefined;
  }
}

/**
 * Parse an internet address
 * Allow:
 - https:localhost:1234        - protocol + host + port
 - localhost:1234              - host + port
 - 1234                        - port
 - http::1234                  - protocol + port
 - https://localhost:443/      - full url + https
 - http://[::1]:443/           - ipv6
 - unix:/tmp/http.sock         - unix sockets
 - https://unix:/tmp/http.sock - unix sockets (https)
 * @param {*} urlAddress the internet address definition
 * @return {Object|Null} literal object that represent the address parsed
 */
export function parseAddress(urlAddress: any): any {
  //
  // TODO: refactor it to something more reasonable?
  //
  //        protocol :  //      (  host  )|(    ipv6     ):  port  /
  let urlPattern = /^((https?):(\/\/)?)?((([^\/:]*)|\[([^\[\]]+)\]):)?(\d+)\/?$/.exec(urlAddress);

  if (urlPattern) {
    return {
      proto: urlPattern[2] || DEFAULT_PROTOCOL,
      host: urlPattern[6] || urlPattern[7] || DEFAULT_DOMAIN,
      port: urlPattern[8] || DEFAULT_PORT
    };
  }

  urlPattern = /^((https?):(\/\/)?)?unix:(.*)$/.exec(urlAddress);

  if (urlPattern) {
    return {
      proto: urlPattern[2] || DEFAULT_PROTOCOL,
      path: urlPattern[4]
    };
  }

  return null;
}

/**
 * Function filters out bad semver versions and sorts the array.
 * @return {Array} sorted Array
 */
export function semverSort(listVersions: string[]): string[] {
  return (
    listVersions
      .filter(function (x): boolean {
        if (!semver.parse(x, true)) {
          logger.warn({ ver: x }, 'ignoring bad version @{ver}');
          return false;
        }
        return true;
      })
      // FIXME: it seems the @types/semver do not handle a legitimate method named 'compareLoose'
      // @ts-ignore
      .sort(semver.compareLoose)
      .map(String)
  );
}

/**
 * Flatten arrays of tags.
 * @param {*} data
 */
export function normalizeDistTags(pkg: Package): void {
  let sorted;
  if (!pkg[DIST_TAGS].latest) {
    // overwrite latest with highest known version based on semver sort
    sorted = semverSort(Object.keys(pkg.versions));
    if (sorted && sorted.length) {
      pkg[DIST_TAGS].latest = sorted.pop();
    }
  }

  for (const tag in pkg[DIST_TAGS]) {
    if (_.isArray(pkg[DIST_TAGS][tag])) {
      if (pkg[DIST_TAGS][tag].length) {
        // sort array
        // FIXME: this is clearly wrong, we need to research why this is like this.
        // @ts-ignore
        sorted = semverSort(pkg[DIST_TAGS][tag]);
        if (sorted.length) {
          // use highest version based on semver sort
          pkg[DIST_TAGS][tag] = sorted.pop();
        }
      } else {
        delete pkg[DIST_TAGS][tag];
      }
    } else if (_.isString(pkg[DIST_TAGS][tag])) {
      if (!semver.parse(pkg[DIST_TAGS][tag], true)) {
        // if the version is invalid, delete the dist-tag entry
        delete pkg[DIST_TAGS][tag];
      }
    }
  }
}

const parseIntervalTable = {
  '': 1000,
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 86400000,
  w: 7 * 86400000,
  M: 30 * 86400000,
  y: 365 * 86400000
};

/**
 * Parse an internal string to number
 * @param {*} interval
 * @return {Number}
 */
export function parseInterval(interval: any): number {
  if (typeof interval === 'number') {
    return interval * 1000;
  }
  let result = 0;
  let last_suffix = Infinity;
  interval.split(/\s+/).forEach(function (x): void {
    if (!x) {
      return;
    }
    const m = x.match(/^((0|[1-9][0-9]*)(\.[0-9]+)?)(ms|s|m|h|d|w|M|y|)$/);
    if (!m || parseIntervalTable[m[4]] >= last_suffix || (m[4] === '' && last_suffix !== Infinity)) {
      throw Error('invalid interval: ' + interval);
    }
    last_suffix = parseIntervalTable[m[4]];
    result += Number(m[1]) * parseIntervalTable[m[4]];
  });
  return result;
}

/**
 * Detect running protocol (http or https)
 */
export function getWebProtocol(headerProtocol: string | void, protocol: string): string {
  let returnProtocol;
  const [, defaultProtocol] = validProtocols;
  // HAProxy variant might return http,http with X-Forwarded-Proto
  if (typeof headerProtocol === 'string' && headerProtocol !== '') {
    debug('header protocol: %o', protocol);
    const commaIndex = headerProtocol.indexOf(',');
    returnProtocol = commaIndex > 0 ? headerProtocol.substr(0, commaIndex) : headerProtocol;
  } else {
    debug('req protocol: %o', headerProtocol);
    returnProtocol = protocol;
  }

  return validProtocols.includes(returnProtocol) ? returnProtocol : defaultProtocol;
}

export function getLatestVersion(pkgInfo: Package): string {
  return pkgInfo[DIST_TAGS].latest;
}

export const ErrorCode = {
  getConflict,
  getBadData,
  getBadRequest,
  getInternalError,
  getUnauthorized,
  getForbidden,
  getServiceUnavailable,
  getNotFound,
  getCode
};

export function parseConfigFile(configPath: string): any {
  try {
    if (/\.ya?ml$/i.test(configPath)) {
      return YAML.load(fs.readFileSync(configPath, 'utf-8'));
    }
    debug('yaml parsed');
    return require(configPath);
  } catch (e) {
    debug('yaml parse failed');
    if (e.code !== 'MODULE_NOT_FOUND') {
      e.message = APP_ERROR.CONFIG_NOT_VALID;
    }

    throw new Error(e);
  }
}

/**
 * Check whether the path already exist.
 * @param {String} path
 * @return {Boolean}
 */
export function folderExists(path: string): boolean {
  try {
    const stat = fs.statSync(path);
    return stat.isDirectory();
  } catch (_) {
    return false;
  }
}

/**
 * Check whether the file already exist.
 * @param {String} path
 * @return {Boolean}
 */
export function fileExists(path: string): boolean {
  try {
    const stat = fs.statSync(path);
    return stat.isFile();
  } catch (_) {
    return false;
  }
}

export function sortByName(packages: any[], orderAscending: boolean | void = true): string[] {
  return packages.slice().sort(function (a, b): number {
    const comparatorNames = a.name.toLowerCase() < b.name.toLowerCase();

    return orderAscending ? (comparatorNames ? -1 : 1) : comparatorNames ? 1 : -1;
  });
}

export function addScope(scope: string, packageName: string): string {
  return `@${scope}/${packageName}`;
}

export function deleteProperties(propertiesToDelete: string[], objectItem: any): any {
  _.forEach(propertiesToDelete, (property): any => {
    delete objectItem[property];
  });

  return objectItem;
}

export function addGravatarSupport(pkgInfo: Package, online = true): AuthorAvatar {
  const pkgInfoCopy = { ...pkgInfo } as any;
  const author: any = _.get(pkgInfo, 'latest.author', null) as any;
  const contributors: AuthorAvatar[] = normalizeContributors(_.get(pkgInfo, 'latest.contributors', []));
  const maintainers = _.get(pkgInfo, 'latest.maintainers', []);

  // for author.
  if (author && _.isObject(author)) {
    const { email } = author as Author;
    pkgInfoCopy.latest.author.avatar = generateGravatarUrl(email, online);
  }

  if (author && _.isString(author)) {
    pkgInfoCopy.latest.author = {
      avatar: GENERIC_AVATAR,
      email: '',
      author
    };
  }

  // for contributors
  if (_.isEmpty(contributors) === false) {
    pkgInfoCopy.latest.contributors = contributors.map((contributor): AuthorAvatar => {
      if (isObject(contributor)) {
        contributor.avatar = generateGravatarUrl(contributor.email, online);
      } else if (_.isString(contributor)) {
        contributor = {
          avatar: GENERIC_AVATAR,
          email: contributor,
          name: contributor
        };
      }

      return contributor;
    });
  }

  // for maintainers
  if (_.isEmpty(maintainers) === false) {
    pkgInfoCopy.latest.maintainers = maintainers.map((maintainer): void => {
      maintainer.avatar = generateGravatarUrl(maintainer.email, online);
      return maintainer;
    });
  }

  return pkgInfoCopy;
}

/**
 * parse package readme - markdown/ascii
 * @param {String} packageName name of package
 * @param {String} readme package readme
 * @param {Object} options sanitizyReadme options
 * @return {String} converted html template
 */
export function parseReadme(packageName: string, readme: string, options: { pathname?: string | void } = {}): string | void {
  if (_.isEmpty(readme) === false) {
    return sanitizyReadme(readme, options);
  }

  // logs readme not found error
  logger.error({ packageName }, '@{packageName}: No readme found');

  return sanitizyReadme('ERROR: No README data found!');
}

export function buildToken(type: string, token: string): string {
  return `${_.capitalize(type)} ${token}`;
}

/**
 * return package version from tarball name
 * @param {String} name
 * @returns {String}
 */
export function getVersionFromTarball(name: string): string | void {
  // FIXME: we know the regex is valid, but we should improve this part as ts suggest
  // @ts-ignore
  return /.+-(\d.+)\.tgz/.test(name) ? name.match(/.+-(\d.+)\.tgz/)[1] : undefined;
}

export type AuthorFormat = Author | string | null | object | void;

/**
 * Formats author field for webui.
 * @see https://docs.npmjs.com/files/package.json#author
 * @param {string|object|undefined} author
 */
export function formatAuthor(author: AuthorFormat): any {
  let authorDetails = {
    name: DEFAULT_USER,
    email: '',
    url: ''
  };

  if (_.isNil(author)) {
    return authorDetails;
  }

  if (_.isString(author)) {
    authorDetails = {
      ...authorDetails,
      name: author as string
    };
  }

  if (_.isObject(author)) {
    authorDetails = {
      ...authorDetails,
      ...(author as Author)
    };
  }

  return authorDetails;
}

/**
 * Check if URI is starting with "http://", "https://" or "//"
 * @param {string} uri
 */
export function isHTTPProtocol(uri: string): boolean {
  return /^(https?:)?\/\//.test(uri);
}

/**
 * Apply whitespaces based on the length
 * @param {*} str the log message
 * @return {String}
 */
export function pad(str, max): string {
  if (str.length < max) {
    return str + ' '.repeat(max - str.length);
  }
  return str;
}

/**
 * return a masquerade string with its first and last {charNum} and three dots in between.
 * @param {String} str
 * @param {Number} charNum
 * @returns {String}
 */
export function mask(str: string, charNum = 3): string {
  return `${str.substr(0, charNum)}...${str.substr(-charNum)}`;
}

export function encodeScopedUri(packageName): string {
  return packageName.replace(/\//g, '%2f');
}

export function hasDiffOneKey(versions): boolean {
  return Object.keys(versions).length !== 1;
}

export function isVersionValid(packageMeta, packageVersion): boolean {
  const hasVersion = typeof packageVersion !== 'undefined';
  if (!hasVersion) {
    return false;
  }

  const hasMatchVersion = Object.keys(packageMeta.versions).includes(packageVersion);
  return hasMatchVersion;
}

export function isRelatedToDeprecation(pkgInfo: Package): boolean {
  const { versions } = pkgInfo;
  for (const version in versions) {
    if (Object.prototype.hasOwnProperty.call(versions[version], 'deprecated')) {
      return true;
    }
  }
  return false;
}

export function validateURL(publicUrl: string | void) {
  try {
    const parsed = new URL(publicUrl as string);
    if (!validProtocols.includes(parsed.protocol.replace(':', ''))) {
      throw Error('invalid protocol');
    }
    return true;
  } catch (err) {
    // TODO: add error logger here
    return false;
  }
}

export function isHost(url: string = '', options = {}): boolean {
  return validator.isURL(url, {
    require_host: true,
    allow_trailing_dot: false,
    require_valid_protocol: false,
    // @ts-ignore
    require_port: false,
    require_tld: false,
    ...options
  });
}

export function getPublicUrl(url_prefix: string = '', req): string {
  if (validateURL(process.env.VERDACCIO_PUBLIC_URL as string)) {
    const envURL = new URL(wrapPrefix(url_prefix), process.env.VERDACCIO_PUBLIC_URL as string).href;
    debug('public url by env %o', envURL);
    return envURL;
  } else if (req.get('host')) {
    const host = req.get('host');
    if (!isHost(host)) {
      throw new Error('invalid host');
    }
    const protoHeader = process.env.VERDACCIO_FORWARDED_PROTO ?? HEADERS.FORWARDED_PROTO;
    const protocol = getWebProtocol(req.get(protoHeader.toLowerCase()), req.protocol);
    const combinedUrl = combineBaseUrl(protocol, host, url_prefix);
    debug('public url by request %o', combinedUrl);
    return combinedUrl;
  } else {
    return '/';
  }
}

/**
 * Create base url for registry.
 * @return {String} base registry url
 */
export function combineBaseUrl(protocol: string, host: string, prefix: string = ''): string {
  debug('combined protocol %o', protocol);
  debug('combined host %o', host);
  const newPrefix = wrapPrefix(prefix);
  debug('combined prefix %o', newPrefix);
  const groupedURI = new URL(wrapPrefix(prefix), `${protocol}://${host}`);
  const result = groupedURI.href;
  debug('combined url %o', result);
  return result;
}

export function wrapPrefix(prefix: string | void): string {
  if (prefix === '' || typeof prefix === 'undefined' || prefix === null) {
    return '';
  } else if (!prefix.startsWith('/') && prefix.endsWith('/')) {
    return `/${prefix}`;
  } else if (!prefix.startsWith('/') && !prefix.endsWith('/')) {
    return `/${prefix}/`;
  } else if (prefix.startsWith('/') && !prefix.endsWith('/')) {
    return `${prefix}/`;
  } else {
    return prefix;
  }
}
