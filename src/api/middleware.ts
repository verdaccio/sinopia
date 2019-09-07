import _ from 'lodash';

import { validateName as utilValidateName, validatePackage as utilValidatePackage, getVersionFromTarball, isObject, ErrorCode } from '../lib/utils';
import { API_ERROR, HEADER_TYPE, HEADERS, HTTP_STATUS, TOKEN_BASIC, TOKEN_BEARER } from '../lib/constants';
import { stringToMD5 } from '../lib/crypto-utils';
import { $ResponseExtend, $RequestExtend, $NextFunctionVer, IAuth } from '../../types';
import { Config, Package, RemoteUser } from '@verdaccio/types';
import { logger } from '../lib/logger';
import { VerdaccioError } from '@verdaccio/commons-api';

export function match(regexp: RegExp): any {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer, value: string): void {
    if (regexp.exec(value)) {
      next();
    } else {
      next('route');
    }
  };
}

export function setSecurityWebHeaders(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
  // disable loading in frames (clickjacking, etc.)
  res.header(HEADERS.FRAMES_OPTIONS, 'deny');
  // avoid stablish connections outside of domain
  res.header(HEADERS.CSP, "connect-src 'self'");
  // https://stackoverflow.com/questions/18337630/what-is-x-content-type-options-nosniff
  res.header(HEADERS.CTO, 'nosniff');
  // https://stackoverflow.com/questions/9090577/what-is-the-http-header-x-xss-protection
  res.header(HEADERS.XSS, '1; mode=block');
  next();
}

// flow: express does not match properly
// flow info https://github.com/flowtype/flow-typed/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+express
export function validateName(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer, value: string, name: string): void {
  if (value.charAt(0) === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utilValidateName(value)) {
    next();
  } else {
    next(ErrorCode.getForbidden('invalid ' + name));
  }
}

// flow: express does not match properly
// flow info https://github.com/flowtype/flow-typed/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+express
export function validatePackage(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer, value: string, name: string): void {
  if (value.charAt(0) === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utilValidatePackage(value)) {
    next();
  } else {
    next(ErrorCode.getForbidden('invalid ' + name));
  }
}

export function media(expect: string | null): any {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    if (req.headers[HEADER_TYPE.CONTENT_TYPE] !== expect) {
      next(ErrorCode.getCode(HTTP_STATUS.UNSUPPORTED_MEDIA, 'wrong content-type, expect: ' + expect + ', got: ' + req.headers[HEADER_TYPE.CONTENT_TYPE]));
    } else {
      next();
    }
  };
}

export function encodeScopePackage(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
  if (req.url.indexOf('@') !== -1) {
    // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
    req.url = req.url.replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F');
  }
  next();
}

export function expectJson(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
  if (!isObject(req.body)) {
    return next(ErrorCode.getBadRequest("can't parse incoming json"));
  }
  next();
}

export function antiLoop(config: Config): Function {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    if (req.headers.via != null) {
      const arr = req.headers.via.split(',');

      for (let i = 0; i < arr.length; i++) {
        const m = arr[i].match(/\s*(\S+)\s+(\S+)/);
        if (m && m[2] === config.server_id) {
          return next(ErrorCode.getCode(HTTP_STATUS.LOOP_DETECTED, 'loop detected'));
        }
      }
    }
    next();
  };
}

export function allow(auth: IAuth): Function {
  return function(action: string): Function {
    return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      req.pause();
      const packageName = req.params.scope ? `@${req.params.scope}/${req.params.package}` : req.params.package;
      const packageVersion = req.params.filename ? getVersionFromTarball(req.params.filename) : undefined;
      const remote: RemoteUser = req.remote_user;
      logger.trace({ action, user: remote.name }, `[middleware/allow][@{action}] allow for @{user}`);

      auth['allow_' + action]({ packageName, packageVersion }, remote, function(error, allowed): void {
        req.resume();
        if (error) {
          next(error);
        } else if (allowed) {
          next();
        } else {
          // last plugin (that's our built-in one) returns either
          // cb(err) or cb(null, true), so this should never happen
          throw ErrorCode.getInternalError(API_ERROR.PLUGIN_ERROR);
        }
      });
    };
  };
}

export interface MiddlewareError {
  error: string;
}

export type FinalBody = Package | MiddlewareError | string;

export function final(body: FinalBody, req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
  if (res.statusCode === HTTP_STATUS.UNAUTHORIZED && !res.getHeader(HEADERS.WWW_AUTH)) {
    // they say it's required for 401, so...
    res.header(HEADERS.WWW_AUTH, `${TOKEN_BASIC}, ${TOKEN_BEARER}`);
  }

  try {
    if (_.isString(body) || _.isObject(body)) {
      if (!res.getHeader(HEADERS.CONTENT_TYPE)) {
        res.header(HEADERS.CONTENT_TYPE, HEADERS.JSON);
      }

      if (typeof body === 'object' && _.isNil(body) === false) {
        if (typeof (body as MiddlewareError).error === 'string') {
          res._verdaccio_error = (body as MiddlewareError).error;
        }
        body = JSON.stringify(body, undefined, '  ') + '\n';
      }

      // don't send etags with errors
      if (!res.statusCode || (res.statusCode >= HTTP_STATUS.OK && res.statusCode < HTTP_STATUS.MULTIPLE_CHOICES)) {
        res.header(HEADERS.ETAG, '"' + stringToMD5(body as string) + '"');
      }
    } else {
      // send(null), send(204), etc.
    }
  } catch (err) {
    // if verdaccio sends headers first, and then calls res.send()
    // as an error handler, we can't report error properly,
    // and should just close socket
    if (err.message.match(/set headers after they are sent/)) {
      if (_.isNil(res.socket) === false) {
        res.socket.destroy();
      }
      return;
    } else {
      throw err;
    }
  }

  res.send(body);
}

export const LOG_STATUS_MESSAGE = "@{status}, user: @{user}(@{remoteIP}), req: '@{request.method} @{request.url}'";
export const LOG_VERDACCIO_ERROR = `${LOG_STATUS_MESSAGE}, error: @{!error}`;
export const LOG_VERDACCIO_BYTES = `${LOG_STATUS_MESSAGE}, bytes: @{bytes.in}/@{bytes.out}`;

export function log(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
  // logger
  req.log = logger.child({ sub: 'in' });

  const _auth = req.headers.authorization;
  if (_.isNil(_auth) === false) {
    req.headers.authorization = '<Classified>';
  }

  const _cookie = req.headers.cookie;
  if (_.isNil(_cookie) === false) {
    req.headers.cookie = '<Classified>';
  }

  req.url = req.originalUrl;
  req.log.info({ req: req, ip: req.ip }, "@{ip} requested '@{req.method} @{req.url}'");
  req.originalUrl = req.url;

  if (_.isNil(_auth) === false) {
    req.headers.authorization = _auth;
  }

  if (_.isNil(_cookie) === false) {
    req.headers.cookie = _cookie;
  }

  let bytesin = 0;
  req.on('data', function(chunk): void {
    bytesin += chunk.length;
  });

  let bytesout = 0;
  const _write = res.write;
  // FIXME: res.write should return boolean
  // @ts-ignore
  res.write = function(buf): boolean {
    bytesout += buf.length;
    /* eslint prefer-rest-params: "off" */
    // @ts-ignore
    _write.apply(res, arguments);
  };

  const log = function(): void {
    const forwardedFor = req.headers['x-forwarded-for'];
    const remoteAddress = req.connection.remoteAddress;
    const remoteIP = forwardedFor ? `${forwardedFor} via ${remoteAddress}` : remoteAddress;
    let message;
    if (res._verdaccio_error) {
      message = LOG_VERDACCIO_ERROR;
    } else {
      message = LOG_VERDACCIO_BYTES;
    }

    req.url = req.originalUrl;
    req.log.warn(
      {
        request: {
          method: req.method,
          url: req.url,
        },
        level: 35, // http
        user: (req.remote_user && req.remote_user.name) || null,
        remoteIP,
        status: res.statusCode,
        error: res._verdaccio_error,
        bytes: {
          in: bytesin,
          out: bytesout,
        },
      },
      message
    );
    req.originalUrl = req.url;
  };

  req.on('close', function(): void {
    log();
  });

  const _end = res.end;
  res.end = function(buf): void {
    if (buf) {
      bytesout += buf.length;
    }
    /* eslint prefer-rest-params: "off" */
    // @ts-ignore
    _end.apply(res, arguments);
    log();
  };
  next();
}

// Middleware
export function errorReportingMiddleware(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
  res.report_error =
    res.report_error ||
    function(err: VerdaccioError): void {
      if (err.status && err.status >= HTTP_STATUS.BAD_REQUEST && err.status < 600) {
        if (_.isNil(res.headersSent) === false) {
          res.status(err.status);
          next({ error: err.message || API_ERROR.UNKNOWN_ERROR });
        }
      } else {
        logger.error({ err: err }, 'unexpected error: @{!err.message}\n@{err.stack}');
        if (!res.status || !res.send) {
          logger.error('this is an error in express.js, please report this');
          res.destroy();
        } else if (!res.headersSent) {
          res.status(HTTP_STATUS.INTERNAL_ERROR);
          next({ error: API_ERROR.INTERNAL_SERVER_ERROR });
        } else {
          // socket should be already closed
        }
      }
    };

  next();
}
