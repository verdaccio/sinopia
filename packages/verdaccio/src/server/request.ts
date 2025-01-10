import assert from 'assert';
import buildDebug from 'debug';
import got, { HTTPAlias, Response, Headers as gotHeaders } from 'got';
import { isNil, isObject, isRegExp } from 'lodash';

import { API_MESSAGE, HEADERS, HTTP_STATUS } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

const debug = buildDebug('verdaccio:registry:request');

export interface ResponseAssert {
  status(reason: any): any;
  body_ok(reason: any): any;
  body_error(reason: any): any;
  request(reason: any): any;
  response(reason: any): any;
  send(reason: any): any;
}

type Options = {
  url: string;
  method: HTTPAlias;
  headers: gotHeaders;
  encoding?: string;
  json: boolean;
  body?: any;
};

type RegistryResponse = {
  ok: string;
  error: null | string;
};

class RequestAssert {
  private response: Response<RegistryResponse>;
  public constructor(response: Response<RegistryResponse>) {
    this.response = response;
  }

  public status(code: number) {
    debug('expected check status %s vs response code %s', code, this.response.statusCode);
    assert(code === this.response.statusCode);
    return this;
  }

  public equal_body(expected: string | RegExp) {
    assert.strictEqual(expected, this.response.body);
  }

  public body_ok(expected: string | RegExp) {
    debug('body expect ok %s', expected);
    if (isRegExp(expected)) {
      assert(this.response.body?.ok?.match(expected));
      assert(
        this.response.body?.ok.match(expected),
        `'${this.response.body.ok}' doesn't match " ${expected}`
      );
    } else if (typeof expected === 'string') {
      assert.equal(this.response.body?.ok, expected);
    } else {
      assert.deepEqual(this.response.body, expected);
    }
  }

  public body_error(expected: string | RegExp) {
    debug('body expect error %s', expected);
    if (isRegExp(expect)) {
      assert(
        this.response?.body?.error?.match(expected),
        `${this.response.body?.error} doesn't match ${expected}`
      );
    }
    assert.equal(this.response.body?.ok, null);
  }
}

export async function createRequest(options: Options): Promise<any> {
  debug('options %s', JSON.stringify(options));
  let body = undefined;
  if (isNil(options.body) === false) {
    // @ts-ignore
    body = isObject(options.body) === false ? JSON.stringify(options.body) : options.body;
  }

  const method = options?.method?.toLocaleLowerCase();
  debug('method %s', method);
  debug('url %s', options?.url);
  debug('headers %s', options?.headers);
  if (method === 'get') {
    return got(options.url, {
      isStream: false,
      resolveBodyOnly: false,
      throwHttpErrors: false,
      // @ts-ignore
      responseType: options.encoding ?? 'json',
      headers: options.headers,
      method: options.method,
      body,
      retry: { limit: 0 },
      // @ts-ignore
    }).then((response) => {
      return new RequestAssert(response as any);
    });
  } else if (method === 'put') {
    return (
      got
        .put(options.url, {
          throwHttpErrors: false,
          responseType: 'json',
          headers: options.headers,
          json: options.body ? options.body : undefined,
          retry: { limit: 0 },
        })
        // @ts-ignore
        .then((response) => {
          return new RequestAssert(response as any);
        })
    );
  } else if (method === 'delete') {
    return (
      got
        .delete(options.url, {
          throwHttpErrors: false,
          responseType: 'json',
          headers: options.headers,
          retry: { limit: 0 },
        })
        // @ts-ignore
        .then((response) => {
          return new RequestAssert(response as any);
        })
    );
  }
}

export class ServerQuery {
  private userAgent: string;
  private url: string;
  public constructor(url) {
    this.url = url.replace(/\/$/, '');
    debug('server url %s', this.url);
    this.userAgent = 'node/v22.13.0 linux x64';
  }

  private request(options: any): Promise<ResponseAssert> {
    return createRequest({
      ...options,
      url: `${this.url}${options.uri}`,
    });
  }

  public debug(): Promise<ResponseAssert> {
    return this.request({
      uri: '/-/_debug',
      method: 'get',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON,
      },
    });
  }

  /**
   *
   *
   * @param {{ name: string; password: string }} { name, password }
   * @return {*}  {Promise<ResponseAssert>}
   * @memberof ServerQuery
   * @deprecated use createUser instead
   */
  public auth({ name, password }: { name: string; password: string }): Promise<ResponseAssert> {
    return this.createUser(name, password);
  }

  public createUser(name, password): Promise<ResponseAssert> {
    return this.request({
      uri: `/-/user/org.couchdb.user:${encodeURIComponent(name)}`,
      method: 'PUT',
      body: {
        name,
        password,
        _id: `org.couchdb.user:${name}`,
        type: 'user',
        roles: [],
        date: new Date(),
      },
    });
  }

  public logout(token: string) {
    return this.request({
      uri: `/-/user/token/${encodeURIComponent(token)}`,
      method: 'DELETE',
    });
  }

  public getPackage(name: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}`,
      method: 'get',
    });
  }

  public getTarball(name: string, filename: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${encodeURIComponent(filename)}`,
      method: 'GET',
      encoding: 'buffer',
    });
  }

  /**
   * Remove entire package.
   * @param name package name
   * @param rev revision id
   * @returns
   */
  public removePackage(name: string, rev) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-rev/${encodeURIComponent(rev)}`,
      method: 'DELETE',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON_CHARSET,
      },
    });
  }

  public removeSingleTarball(name: string, filename: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${encodeURIComponent(filename)}/-rev/whatever`,
      method: 'DELETE',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON_CHARSET,
      },
    });
  }

  /**
   *
   * @param name
   * @param tag
   * @param version
   * @returns
   */
  public addTag(name: string, tag: string, version: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      method: 'PUT',
      body: version,
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON,
      },
    });
  }

  public putVersion(name: string, version: string, data: any, headers) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/${encodeURIComponent(version)}/-tag/latest`,
      method: 'PUT',
      body: data,
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON,
        ...headers,
      },
    });
  }

  public putPackage(name: string, data, headers = {}) {
    return this.request({
      uri: `/${encodeURIComponent(name)}`,
      method: 'PUT',
      body: data,
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON,
        ...headers,
      },
    });
  }

  public async addPackage(
    name: string,
    version: string = '1.0.0',
    message = API_MESSAGE.PKG_CREATED
  ): Promise<ResponseAssert> {
    return (await this.putPackage(name, generatePackageMetadata(name, version)))
      .status(HTTP_STATUS.CREATED)
      .body_ok(message);
  }

  public async addPackageAssert(name: string, version: string = '1.0.0'): Promise<ResponseAssert> {
    return this.putPackage(name, generatePackageMetadata(name, version));
  }

  public async whoami() {
    debug('request whoami');
    return await this.request({
      uri: '/-/whoami',
      method: 'get',
    });
  }

  public async ping() {
    return (
      await this.request({
        uri: '/-/ping',
        method: 'get',
      })
    ).status(HTTP_STATUS.OK);
  }
}
