import nock from 'nock';
import path from 'path';
import { setTimeout } from 'timers/promises';

import { Config, parseConfigFile } from '@verdaccio/config';
import { API_ERROR, errorUtils } from '@verdaccio/core';

import { ProxyStorage } from '../src';

const getConf = (name) => path.join(__dirname, '/conf', name);

const mockDebug = jest.fn();
const mockInfo = jest.fn();
const mockHttp = jest.fn();
const mockError = jest.fn();
const mockWarn = jest.fn();

// mock to get the headers fixed value
jest.mock('crypto', () => {
  return {
    randomBytes: (): { toString: () => string } => {
      return {
        toString: (): string => 'foo-random-bytes',
      };
    },
    pseudoRandomBytes: (): { toString: () => string } => {
      return {
        toString: (): string => 'foo-phseudo-bytes',
      };
    },
  };
});

jest.mock('@verdaccio/logger', () => {
  const originalLogger = jest.requireActual('@verdaccio/logger');
  return {
    ...originalLogger,
    logger: {
      child: () => ({
        debug: (arg, msg) => mockDebug(arg, msg),
        info: (arg, msg) => mockInfo(arg, msg),
        http: (arg, msg) => mockHttp(arg, msg),
        error: (arg, msg) => mockError(arg, msg),
        warn: (arg, msg) => mockWarn(arg, msg),
      }),
    },
  };
});

const domain = 'https://registry.npmjs.org';

describe('proxy', () => {
  beforeEach(() => {
    nock.cleanAll();
  });
  const defaultRequestOptions = {
    url: 'https://registry.npmjs.org',
  };
  const proxyPath = getConf('proxy1.yaml');
  const conf = new Config(parseConfigFile(proxyPath));

  describe('getRemoteMetadataNext', () => {
    beforeEach(() => {
      nock.cleanAll();
      nock.abortPendingRequests();
      jest.clearAllMocks();
    });
    describe('basic requests', () => {
      test('success call to remote', async () => {
        nock(domain, {
          reqheaders: {
            accept: 'application/json;',
            'accept-encoding': 'gzip',
            'x-forwarded-for': '127.0.0.1',
            via: '1.1 foo-phseudo-bytes (Verdaccio)',
          },
        })
          .get('/jquery')
          .reply(200, { body: 'test' });
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        const [manifest] = await prox1.getRemoteMetadataNext('jquery', {
          remoteAddress: '127.0.0.1',
        });
        expect(manifest).toEqual({ body: 'test' });
      });
    });

    describe('etag header', () => {
      test('proxy call with etag', async () => {
        nock(domain, {
          reqheaders: {
            accept: 'application/json;',
            'accept-encoding': 'gzip',
            'x-forwarded-for': '127.0.0.1',
            via: '1.1 foo-phseudo-bytes (Verdaccio)',
          },
        })
          .get('/jquery')
          .reply(
            200,
            { body: 'test' },
            {
              etag: () => `_ref_4444`,
            }
          );
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        const [manifest, etag] = await prox1.getRemoteMetadataNext('jquery', {
          remoteAddress: '127.0.0.1',
        });
        expect(etag).toEqual('_ref_4444');
        expect(manifest).toEqual({ body: 'test' });
      });

      test('proxy call with etag as option', async () => {
        nock(domain, {
          reqheaders: {
            accept: 'application/json;',
            'accept-encoding': 'gzip',
            'x-forwarded-for': '127.0.0.1',
            via: '1.1 foo-phseudo-bytes (Verdaccio)',
            // match only if etag is set as option
            'if-none-match': 'foo',
          },
        })
          .get('/jquery')
          .reply(
            200,
            { body: 'test' },
            {
              etag: () => `_ref_4444`,
            }
          );
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        const [manifest, etag] = await prox1.getRemoteMetadataNext('jquery', {
          etag: 'foo',
          remoteAddress: '127.0.0.1',
        });
        expect(etag).toEqual('_ref_4444');
        expect(manifest).toEqual({ body: 'test' });
      });
    });

    describe('log activity', () => {
      test('proxy call with etag', async () => {
        nock(domain)
          .get('/jquery')
          .reply(200, { body: { name: 'foo', version: '1.0.0' } }, {});
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        await prox1.getRemoteMetadataNext('jquery', {
          remoteAddress: '127.0.0.1',
        });
        expect(mockHttp).toHaveBeenCalledTimes(2);
        expect(mockHttp).toHaveBeenCalledWith(
          {
            request: { method: 'GET', url: `${domain}/jquery` },
            status: 200,
          },
          "@{!status}, req: '@{request.method} @{request.url}' (streaming)"
        );
        expect(mockHttp).toHaveBeenLastCalledWith(
          {
            request: { method: 'GET', url: `${domain}/jquery` },
            status: 200,
            bytes: {
              in: 0,
              out: 41,
            },
          },
          "@{!status}, req: '@{request.method} @{request.url}'"
        );
      });
    });

    describe('error handling', () => {
      test('proxy call with 304', async () => {
        nock(domain).get('/jquery').reply(304);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        await expect(prox1.getRemoteMetadataNext('jquery', { etag: 'rev_3333' })).rejects.toThrow(
          'no data'
        );
      });

      test('reply with error', async () => {
        nock(domain).get('/jquery').replyWithError('something awful happened');
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        await expect(
          prox1.getRemoteMetadataNext('jquery', {
            remoteAddress: '127.0.0.1',
          })
        ).rejects.toThrowError(new Error('something awful happened'));
      });

      test('reply with 409 error', async () => {
        nock(domain).get('/jquery').reply(409);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        await expect(prox1.getRemoteMetadataNext('jquery', { retry: 0 })).rejects.toThrow(
          new Error('bad status code: 409')
        );
      });

      test('reply with bad body json format', async () => {
        nock(domain).get('/jquery').reply(200, 'some-text');
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        await expect(
          prox1.getRemoteMetadataNext('jquery', {
            remoteAddress: '127.0.0.1',
          })
        ).rejects.toThrowError(
          new Error(
            'Unexpected token s in JSON at position 0 in "https://registry.npmjs.org/jquery"'
          )
        );
      });

      test('400 error proxy call', async () => {
        nock(domain).get('/jquery').reply(409);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        await expect(
          prox1.getRemoteMetadataNext('jquery', {
            remoteAddress: '127.0.0.1',
          })
        ).rejects.toThrowError(
          errorUtils.getInternalError(`${errorUtils.API_ERROR.BAD_STATUS_CODE}: 409`)
        );
      });

      test('proxy  not found', async () => {
        nock(domain).get('/jquery').reply(404);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        await expect(
          prox1.getRemoteMetadataNext('jquery', {
            remoteAddress: '127.0.0.1',
          })
        ).rejects.toThrowError(errorUtils.getNotFound(API_ERROR.NOT_PACKAGE_UPLINK));
        expect(mockHttp).toHaveBeenCalledTimes(1);
        expect(mockHttp).toHaveBeenLastCalledWith(
          {
            request: { method: 'GET', url: `${domain}/jquery` },
            status: 404,
          },
          "@{!status}, req: '@{request.method} @{request.url}' (streaming)"
        );
      });
    });

    describe('retry', () => {
      test('retry twice on 500 and return 200 logging offline activity', async () => {
        nock(domain)
          .get('/jquery')
          .twice()
          .reply(500, 'some-text')
          .get('/jquery')
          .once()
          .reply(200, { body: { name: 'foo', version: '1.0.0' } });

        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        const [manifest] = await prox1.getRemoteMetadataNext('jquery', {
          retry: { limit: 2 },
        });
        expect(manifest).toEqual({ body: { name: 'foo', version: '1.0.0' } });
        expect(mockInfo).toHaveBeenCalledTimes(2);
        expect(mockInfo).toHaveBeenLastCalledWith(
          {
            error: 'Response code 500 (Internal Server Error)',
            request: { method: 'GET', url: `${domain}/jquery` },
            retryCount: 2,
          },
          "retry @{retryCount} req: '@{request.method} @{request.url}'"
        );
      });

      test('retry is exceded and uplink goes offline with logging activity', async () => {
        nock(domain).get('/jquery').times(10).reply(500);

        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        await expect(
          prox1.getRemoteMetadataNext('jquery', {
            remoteAddress: '127.0.0.1',
            retry: { limit: 2 },
          })
        ).rejects.toThrowError();
        await expect(
          prox1.getRemoteMetadataNext('jquery', {
            remoteAddress: '127.0.0.1',
            retry: { limit: 2 },
          })
        ).rejects.toThrowError(errorUtils.getInternalError(errorUtils.API_ERROR.UPLINK_OFFLINE));
        expect(mockWarn).toHaveBeenCalledTimes(1);
        expect(mockWarn).toHaveBeenLastCalledWith(
          {
            host: 'registry.npmjs.org',
          },
          'host @{host} is now offline'
        );
      });

      test('fails calls and recover with 200 with log online activity', async () => {
        // This unit test is designed to verify if the uplink goes to offline
        // and recover after the fail_timeout has expired.
        nock(domain)
          .get('/jquery')
          .thrice()
          .reply(500, 'some-text')
          .get('/jquery')
          .once()
          .reply(200, { body: { name: 'foo', version: '1.0.0' } });

        const prox1 = new ProxyStorage(
          { ...defaultRequestOptions, fail_timeout: '1s', max_fails: 1 },
          conf
        );
        // force retry
        await expect(
          prox1.getRemoteMetadataNext('jquery', {
            remoteAddress: '127.0.0.1',
            retry: { limit: 2 },
          })
        ).rejects.toThrowError();
        // display offline error on exausted retry
        await expect(
          prox1.getRemoteMetadataNext('jquery', {
            remoteAddress: '127.0.0.1',
            retry: { limit: 2 },
          })
        ).rejects.toThrowError(errorUtils.getInternalError(errorUtils.API_ERROR.UPLINK_OFFLINE));
        expect(mockWarn).toHaveBeenCalledTimes(2);
        expect(mockWarn).toHaveBeenLastCalledWith(
          {
            host: 'registry.npmjs.org',
          },
          'host @{host} is now offline'
        );
        expect(mockWarn).toHaveBeenLastCalledWith(
          {
            host: 'registry.npmjs.org',
          },
          'host @{host} is now offline'
        );
        // this is based on max_fails, if change that also change here acordingly
        await setTimeout(3000);
        const [manifest] = await prox1.getRemoteMetadataNext('jquery', {
          retry: { limit: 2 },
        });
        expect(manifest).toEqual({ body: { name: 'foo', version: '1.0.0' } });
        expect(mockWarn).toHaveBeenLastCalledWith(
          {
            host: 'registry.npmjs.org',
          },
          'host @{host} is now online'
        );
      }, 10000);
    });
  });
});
