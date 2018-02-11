// @flow

import zlib from 'zlib';
import JSONStream from 'JSONStream';
import createError from 'http-errors';
import _ from 'lodash';
import request from 'request';
import Stream from 'stream';
import URL from 'url';
import {parseInterval, is_object, ErrorCode} from './utils';
import {ReadTarball} from '@verdaccio/streams';

import type {
  IProxy,
  Config,
  Callback,
  Logger,
} from '@verdaccio/types';

import type {IUploadTarball} from '@verdaccio/streams';

const LoggerApi = require('./logger');
const encode = function(thing) {
  return encodeURIComponent(thing).replace(/^%40/, '@');
};
const jsonContentType = 'application/json';
const contenTypeAccept = `${jsonContentType};`;

/**
 * Just a helper (`config[key] || default` doesn't work because of zeroes)
 * @param {Object} config
 * @param {Object} key
 * @param {Object} def
 * @return {Object}
 */
const setConfig = (config, key, def) => {
  return _.isNil(config[key]) === false ? config[key] : def;
};

/**
 * Implements Storage interface
 * (same for storage.js, local-storage.js, up-storage.js)
 */
class ProxyStorage implements IProxy {
  config: Config;
  failed_requests: number;
  userAgent: string;
  ca: string | void;
  logger: Logger;
  server_id: string;
  url: any;
  maxage: string;
  timeout: string;
  max_fails: number;
  fail_timeout: number;
  upname: string;
  proxy: string;
  last_request_time: number;

  /**
   * Constructor
   * @param {*} config
   * @param {*} mainConfig
   */
  constructor(config: UpLinkConf, mainConfig: Config) {
    this.config = config;
    this.failed_requests = 0;
    this.userAgent = mainConfig.user_agent;
    this.ca = config.ca;
    this.logger = LoggerApi.logger.child({sub: 'out'});
    this.server_id = mainConfig.server_id;

    this.url = URL.parse(this.config.url);
    // $FlowFixMe
    this._setupProxy(this.url.hostname, config, mainConfig, this.url.protocol === 'https:');

    this.config.url = this.config.url.replace(/\/$/, '');

    if (Number(this.config.timeout) >= 1000) {
      this.logger.warn(['Too big timeout value: ' + this.config.timeout,
                        'We changed time format to nginx-like one',
                        '(see http://nginx.org/en/docs/syntax.html)',
                        'so please update your config accordingly'].join('\n'));
    }

    // a bunch of different configurable timers
    this.maxage = parseInterval(setConfig(this.config, 'maxage', '2m' ));
    this.timeout = parseInterval(setConfig(this.config, 'timeout', '30s'));
    this.max_fails = Number(setConfig(this.config, 'max_fails', 2 ));
    this.fail_timeout = parseInterval(setConfig(this.config, 'fail_timeout', '5m' ));
  }

  /**
   * Fetch an asset.
   * @param {*} options
   * @param {*} cb
   * @return {Request}
   */
  request(options: any, cb: Callback) {
    let json;

    if (this._statusCheck() === false) {
      let streamRead = new Stream.Readable();

      process.nextTick(function() {
        if (_.isFunction(cb)) {
          cb(ErrorCode.get500('uplink is offline'));
        }
        // $FlowFixMe
        streamRead.emit('error', createError('uplink is offline'));
      });
      // $FlowFixMe
      streamRead._read = function() {};
      // preventing 'Uncaught, unspecified "error" event'
      streamRead.on('error', function() {});
      return streamRead;
    }

    let self = this;
    let headers = this._setHeaders(options);

    this._addProxyHeaders(options.req, headers);
    this._overrideWithUplinkConfigHeaders(headers);

    const method = options.method || 'GET';
    const uri = options.uri_full || (this.config.url + options.uri);

    self.logger.info({
      method: method,
      headers: headers,
      uri: uri,
    }, 'making request: \'@{method} @{uri}\'');

    if (is_object(options.json)) {
      json = JSON.stringify(options.json);
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    let requestCallback = cb ? (function(err, res, body) {
      let error;
      const responseLength = err ? 0 : body.length;
      // $FlowFixMe
      processBody(err, body);
      logActivity();
      cb(err, res, body);

      /**
       * Perform a decode.
       */
      function processBody() {
        if (err) {
          error = err.message;
          return;
        }

        if (options.json && res.statusCode < 300) {
          try {
            // $FlowFixMe
            body = JSON.parse(body.toString('utf8'));
          } catch(_err) {
            body = {};
            err = _err;
            error = err.message;
          }
        }

        if (!err && is_object(body)) {
          if (_.isString(body.error)) {
            error = body.error;
          }
        }
      }
      /**
       * Perform a log.
       */
      function logActivity() {
        let message = '@{!status}, req: \'@{request.method} @{request.url}\'';
        message += error
                ? ', error: @{!error}'
                : ', bytes: @{bytes.in}/@{bytes.out}';
        self.logger.warn({
          err: err,
          request: {method: method, url: uri},
          level: 35, // http
          status: res != null ? res.statusCode : 'ERR',
          error: error,
          bytes: {
            in: json ? json.length : 0,
            out: responseLength || 0,
          },
        }, message);
      }
    }) : undefined;

    const req = request({
      url: uri,
      method: method,
      headers: headers,
      body: json,
      ca: this.ca,
      proxy: this.proxy,
      encoding: null,
      gzip: true,
      timeout: this.timeout,
    }, requestCallback);

    let statusCalled = false;
    req.on('response', function(res) {
      if (!req._verdaccio_aborted && !statusCalled) {
        statusCalled = true;
        self._statusCheck(true);
      }

      if (_.isNil(requestCallback) === false) {
        (function do_log() {
          const message = '@{!status}, req: \'@{request.method} @{request.url}\' (streaming)';
          self.logger.warn({
            request: {
              method: method,
              url: uri,
            },
            level: 35, // http
            status: _.isNull(res) === false ? res.statusCode : 'ERR',
          }, message);
        })();
      }
    });
    req.on('error', function(_err) {
      if (!req._verdaccio_aborted && !statusCalled) {
        statusCalled = true;
        self._statusCheck(false);
      }
    });
    return req;
  }

  /**
   * Set default headers.
   * @param {Object} options
   * @return {Object}
   * @private
   */
  _setHeaders(options: any) {
    const headers = options.headers || {};
    const accept = 'Accept';
    const acceptEncoding = 'Accept-Encoding';
    const userAgent = 'User-Agent';

    headers[accept] = headers[accept] || contenTypeAccept;
    headers[acceptEncoding] = headers[acceptEncoding] || 'gzip';
    // registry.npmjs.org will only return search result if user-agent include string 'npm'
    headers[userAgent] = headers[userAgent] || `npm (${this.userAgent})`;

    return this._setAuth(headers);
  }

  /**
   * Validate configuration auth and assign Header authorization
   * @param {Object} headers
   * @return {Object}
   * @private
   */
  _setAuth(headers: any) {

    if (_.isNil(this.config.auth) || headers['authorization']) {
      return headers;
    }

    if (!_.isObject(this.config.auth)) {
      this._throwErrorAuth('Auth invalid');
    }

    // get NPM_TOKEN http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules
    // or get other variable export in env
    let token: any = process.env.NPM_TOKEN;
    if (this.config.auth.token) {
      token = this.config.auth.token;
    } else if (this.config.auth.token_env) {
      token = process.env[this.config.auth.token_env];
    }

    if (_.isNil(token)) {
      this._throwErrorAuth('Token is required');
    }

    // define type Auth allow basic and bearer
    const type = this.config.auth.type;
    this._setHeaderAuthorization(headers, type, token);
    return headers;
  }

  /**
   * @param {string} message
   * @throws {Error}
   * @private
   */
  _throwErrorAuth(message: string) {
    this.logger.error(message);
    throw new Error(message);
  }

  /**
   * Assign Header authorization with type authentication
   * @param {Object} headers
   * @param {string} type
   * @param {string} token
   * @private
   */
  _setHeaderAuthorization(headers: any, type: string, token: string) {
    if (type !== 'bearer' && type !== 'basic') {
      this._throwErrorAuth(`Auth type '${type}' not allowed`);
    }

    type = _.upperFirst(type);
    headers['authorization'] = `${type} ${token}`;
  }

  /**
   * It will add or override specified headers from config file.
   *
   * Eg:
   *
   * uplinks:
       npmjs:
         url: https://registry.npmjs.org/
         headers:
           Accept: "application/vnd.npm.install-v2+json; q=1.0"
       verdaccio-staging:
         url: https://mycompany.com/npm
         headers:
           Accept: "application/json"
           authorization: "Basic YourBase64EncodedCredentials=="

   * @param {Object} headers
   * @private
   */
  _overrideWithUplinkConfigHeaders(headers: any) {
    // add/override headers specified in the config
    for (let key in this.config.headers) {
      if (Object.prototype.hasOwnProperty.call(this.config.headers, key)) {
        headers[key] = this.config.headers[key];
      }
    }
  }

  /**
   * Determine whether can fetch from the provided URL
   * @param {*} url
   * @return {Boolean}
   */
  isUplinkValid(url: string) {
      // $FlowFixMe
      url = URL.parse(url);
      // $FlowFixMe
     return url.protocol === this.url.protocol && url.host === this.url.host && url.path.indexOf(this.url.path) === 0;
  }

  /**
   * Get a remote package metadata
   * @param {*} name package name
   * @param {*} options request options, eg: eTag.
   * @param {*} callback
   */
  getRemoteMetadata(name: string, options: any, callback: Callback) {
    const headers = {};
    if (_.isNil(options.etag) === false) {
      headers['If-None-Match'] = options.etag;
      headers['Accept'] = contenTypeAccept;
    }

    this.request({
      uri: `/${encode(name)}`,
      json: true,
      headers: headers,
      req: options.req,
    }, (err, res, body) => {
      if (err) {
        return callback(err);
      }
      if (res.statusCode === 404) {
        return callback( ErrorCode.get404('package doesn\'t exist on uplink'));
      }
      if (!(res.statusCode >= 200 && res.statusCode < 300)) {
        const error = createError(500, `bad status code: ${res.statusCode}`);
        // $FlowFixMe
        error.remoteStatus = res.statusCode;
        return callback(error);
      }
      callback(null, body, res.headers.etag);
    });
  }

  /**
   * Fetch a tarball from the uplink.
   * @param {String} url
   * @return {Stream}
   */
  fetchTarball(url: string) {
    const stream = new ReadTarball({});
    let current_length = 0;
    let expected_length;

    stream.abort = () => {};
    const readStream = this.request({
      uri_full: url,
      encoding: null,
      headers: {
        Accept: contenTypeAccept,
      },
    });

    readStream.on('response', function(res: any) {
      if (res.statusCode === 404) {
        return stream.emit('error', ErrorCode.get404('file doesn\'t exist on uplink'));
      }
      if (!(res.statusCode >= 200 && res.statusCode < 300)) {
        return stream.emit('error', createError(500, 'bad uplink status code: ' + res.statusCode));
      }
      if (res.headers['content-length']) {
        expected_length = res.headers['content-length'];
        stream.emit('content-length', res.headers['content-length']);
      }

      readStream.pipe(stream);
    });

    readStream.on('error', function(err) {
      stream.emit('error', err);
    });
    readStream.on('data', function(data) {
      current_length += data.length;
    });
    readStream.on('end', function(data) {
      if (data) {
        current_length += data.length;
      }
      if (expected_length && current_length != expected_length) {
        stream.emit('error', createError(500, 'content length mismatch'));
      }
    });
    return stream;
  }

  /**
   * Perform a stream search.
   * @param {*} options request options
   * @return {Stream}
   */
  search(options: any) {
    const transformStream: IUploadTarball = new Stream.PassThrough({objectMode: true});
    const requestStream: IUploadTarball = this.request({
      uri: options.req.url,
      req: options.req,
      headers: {
        referer: options.req.headers.referer,
      },
    });

    let parsePackage = (pkg) => {
      if (is_object(pkg)) {
        transformStream.emit('data', pkg);
      }
    };

    requestStream.on('response', (res) => {
      if (!String(res.statusCode).match(/^2\d\d$/)) {
        return transformStream.emit('error', createError(500, `bad status code ${res.statusCode} from uplink`));
      }

      // See https://github.com/request/request#requestoptions-callback
      // Request library will not decode gzip stream.
      let jsonStream;
      if (res.headers['content-encoding'] === 'gzip') {
        jsonStream = res.pipe(zlib.createUnzip());
      } else {
        jsonStream = res;
      }
      jsonStream.pipe(JSONStream.parse('*')).on('data', parsePackage);
      jsonStream.on('end', () => {
        transformStream.emit('end');
      });
    });

    requestStream.on('error', (err) => {
      transformStream.emit('error', err);
    });

    transformStream.abort = () => {
      requestStream.abort();
      transformStream.emit('end');
    };

    return transformStream;
  }

  /**
   * Add proxy headers.
   * @param {*} req the http request
   * @param {*} headers the request headers
   */
  _addProxyHeaders(req: any, headers: any) {
    if (req) {
      // Only submit X-Forwarded-For field if we don't have a proxy selected
      // in the config file.
      //
      // Otherwise misconfigured proxy could return 407:
      // https://github.com/rlidwka/sinopia/issues/254
      //
      if (this.proxy === false) {
        headers['X-Forwarded-For'] = (
          req && req.headers['x-forwarded-for']
          ? req.headers['x-forwarded-for'] + ', '
          : ''
        ) + req.connection.remoteAddress;
      }
    }

    // always attach Via header to avoid loops, even if we're not proxying
    headers['Via'] =
      req && req.headers['via']
      ? req.headers['via'] + ', '
      : '';

    headers['Via'] += '1.1 ' + this.server_id + ' (Verdaccio)';
  }

  /**
   * Check whether the remote host is available.
   * @param {*} alive
   * @return {Boolean}
   */
  _statusCheck(alive?: boolean) {
    if (arguments.length === 0) {
      return this._ifRequestFailure() === false;
    } else {
      if (alive) {
        if (this.failed_requests >= this.max_fails) {
          this.logger.warn({
            host: this.url.host,
          }, 'host @{host} is back online');
        }
        this.failed_requests = 0;
      } else {
        this.failed_requests ++;
        if (this.failed_requests === this.max_fails) {
          this.logger.warn({
            host: this.url.host,
          }, 'host @{host} is now offline');
        }
      }
      this.last_request_time = Date.now();
    }
  }

  /**
   * If the request failure.
   * @return {boolean}
   * @private
   */
  _ifRequestFailure() {
    return this.failed_requests >= this.max_fails && Math.abs(Date.now() - this.last_request_time) < this.fail_timeout;
  }

  /**
   * Set up a proxy.
   * @param {*} hostname
   * @param {*} config
   * @param {*} mainconfig
   * @param {*} isHTTPS
   */
  _setupProxy(hostname: string, config: UpLinkConf, mainconfig: Config, isHTTPS: boolean) {
    let noProxyList;
    let proxy_key: string = isHTTPS ? 'https_proxy' : 'http_proxy';

    // get http_proxy and no_proxy configs
    if (proxy_key in config) {
      this.proxy = config[proxy_key];
    } else if (proxy_key in mainconfig) {
      this.proxy = mainconfig[proxy_key];
    }
    if ('no_proxy' in config) {
      // $FlowFixMe
      noProxyList = config.no_proxy;
    } else if ('no_proxy' in mainconfig) {
      noProxyList = mainconfig.no_proxy;
    }

    // use wget-like algorithm to determine if proxy shouldn't be used
    if (hostname[0] !== '.') {
      hostname = '.' + hostname;
    }
    // $FlowFixMe
    if (_.isString(noProxyList) && noProxyList.length) {
      // $FlowFixMe
      noProxyList = noProxyList.split(',');
    }
    if (_.isArray(noProxyList)) {
      // $FlowFixMe
      for (let i = 0; i < noProxyList.length; i++) {
        // $FlowFixMe
        let noProxyItem = noProxyList[i];
        if (noProxyItem[0] !== '.') noProxyItem = '.' + noProxyItem;
        if (hostname.lastIndexOf(noProxyItem) === hostname.length - noProxyItem.length) {
          if (this.proxy) {
            this.logger.debug({url: this.url.href, rule: noProxyItem},
              'not using proxy for @{url}, excluded by @{rule} rule');
              // $FlowFixMe
            this.proxy = false;
          }
          break;
        }
      }
    }

    // if it's non-string (i.e. "false"), don't use it
    if (_.isString(this.proxy) === false) {
      delete this.proxy;
    } else {
      this.logger.debug( {url: this.url.href, proxy: this.proxy}, 'using proxy @{proxy} for @{url}' );
    }
  }

}

export default ProxyStorage;
