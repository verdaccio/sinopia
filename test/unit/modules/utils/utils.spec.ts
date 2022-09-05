import * as httpMocks from 'node-mocks-http';

import { HEADERS } from '@verdaccio/commons-api';

import { DEFAULT_USER, DIST_TAGS } from '../../../../src/lib/constants';
import { logger, setup } from '../../../../src/lib/logger';
import {
  addGravatarSupport,
  combineBaseUrl,
  convertDistRemoteToLocalTarballUrls,
  formatAuthor,
  getPublicUrl,
  getVersion,
  getVersionFromTarball,
  getWebProtocol,
  isHTTPProtocol,
  normalizeDistTags,
  parseReadme,
  sortByName,
  validateMetadata,
  validateName,
  validatePackage,
} from '../../../../src/lib/utils';
import { getByQualityPriorityValue, spliceURL } from '../../../../src/utils/string';
import { GENERIC_AVATAR, generateGravatarUrl } from '../../../../src/utils/user';
import { readFile } from '../../../functional/lib/test.utils';

const readmeFile = (fileName = 'markdown.md') => readFile(`../../unit/partials/readme/${fileName}`);

setup([]);

describe('Utilities', () => {
  const buildURI = (host, version) => `http://${host}/npm_test/-/npm_test-${version}.tgz`;
  const fakeHost = 'fake.com';
  const metadata: any = {
    name: 'npm_test',
    versions: {
      '1.0.0': {
        dist: {
          tarball: 'http://registry.org/npm_test/-/npm_test-1.0.0.tgz',
        },
      },
      '1.0.1': {
        dist: {
          tarball: 'http://registry.org/npm_test/-/npm_test-1.0.1.tgz',
        },
      },
    },
  };

  const cloneMetadata = (pkg = metadata) => Object.assign({}, pkg);

  describe('API utilities', () => {
    describe('Sort packages', () => {
      const packages = [
        {
          name: 'ghc',
        },
        {
          name: 'abc',
        },
        {
          name: 'zxy',
        },
      ];
      test('should order ascending', () => {
        expect(sortByName(packages)).toEqual([
          {
            name: 'abc',
          },
          {
            name: 'ghc',
          },
          {
            name: 'zxy',
          },
        ]);
      });

      test('should order descending', () => {
        expect(sortByName(packages, false)).toEqual([
          {
            name: 'zxy',
          },
          {
            name: 'ghc',
          },
          {
            name: 'abc',
          },
        ]);
      });
    });

    describe('getWebProtocol', () => {
      test('should handle undefined header', () => {
        expect(getWebProtocol(undefined, 'http')).toBe('http');
      });

      test('should handle emtpy string', () => {
        expect(getWebProtocol('', 'http')).toBe('http');
      });

      test('should have header priority over request protocol', () => {
        expect(getWebProtocol('https', 'http')).toBe('https');
      });

      test('should have handle empty protocol', () => {
        expect(getWebProtocol('https', '')).toBe('https');
      });

      test('should have handle invalid protocol', () => {
        expect(getWebProtocol('ftp', '')).toBe('http');
      });

      describe('getWebProtocol and HAProxy variant', () => {
        // https://github.com/verdaccio/verdaccio/issues/695
        test('should handle http', () => {
          expect(getWebProtocol('http,http', 'https')).toBe('http');
        });

        test('should handle https', () => {
          expect(getWebProtocol('https,https', 'http')).toBe('https');
        });
      });
    });

    describe('convertDistRemoteToLocalTarballUrls', () => {
      test('should build a URI for dist tarball based on new domain', () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          headers: {
            host: fakeHost,
          },
          protocol: 'http',
          url: '/',
        });
        const convertDist = convertDistRemoteToLocalTarballUrls(cloneMetadata(), req);
        expect(convertDist.versions['1.0.0'].dist.tarball).toEqual(buildURI(fakeHost, '1.0.0'));
        expect(convertDist.versions['1.0.1'].dist.tarball).toEqual(buildURI(fakeHost, '1.0.1'));
      });

      test('should return same URI whether host is missing', () => {
        const convertDist = convertDistRemoteToLocalTarballUrls(cloneMetadata(), {
          headers: {},
          // @ts-ignore
          get: () => 'http',
          protocol: 'http',
        });
        expect(convertDist.versions['1.0.0'].dist.tarball).toEqual(convertDist.versions['1.0.0'].dist.tarball);
      });
    });

    describe('normalizeDistTags', () => {
      test('should delete a invalid latest version', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: '20000',
        };

        normalizeDistTags(pkg);

        expect(Object.keys(pkg[DIST_TAGS])).toHaveLength(0);
      });

      test('should define last published version as latest', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {};

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ latest: '1.0.1' });
      });

      test('should define last published version as latest with a custom dist-tag', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          beta: '1.0.1',
        };

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ beta: '1.0.1', latest: '1.0.1' });
      });

      test('should convert any array of dist-tags to a plain string', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: ['1.0.1'],
        };

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ latest: '1.0.1' });
      });
    });

    describe('getVersion', () => {
      test('should get the right version', () => {
        expect(getVersion(cloneMetadata(), '1.0.0')).toEqual(metadata.versions['1.0.0']);
        expect(getVersion(cloneMetadata(), 'v1.0.0')).toEqual(metadata.versions['1.0.0']);
      });

      test('should return nothing on get non existing version', () => {
        expect(getVersion(cloneMetadata(), '0')).toBeUndefined();
        expect(getVersion(cloneMetadata(), '2.0.0')).toBeUndefined();
        expect(getVersion(cloneMetadata(), 'v2.0.0')).toBeUndefined();
        expect(getVersion(cloneMetadata(), undefined)).toBeUndefined();
        expect(getVersion(cloneMetadata(), null)).toBeUndefined();
        expect(getVersion(cloneMetadata(), 2)).toBeUndefined();
      });
    });

    describe('combineBaseUrl', () => {
      test('should create a URI', () => {
        expect(combineBaseUrl('http', 'domain')).toEqual('http://domain/');
      });

      test('should create a base url for registry', () => {
        expect(combineBaseUrl('http', 'domain.com', '')).toEqual('http://domain.com/');
        expect(combineBaseUrl('http', 'domain.com', '/')).toEqual('http://domain.com/');
        expect(combineBaseUrl('http', 'domain.com', '/prefix/')).toEqual('http://domain.com/prefix/');
        expect(combineBaseUrl('http', 'domain.com', '/prefix/deep')).toEqual('http://domain.com/prefix/deep/');
        expect(combineBaseUrl('http', 'domain.com', 'prefix/')).toEqual('http://domain.com/prefix/');
        expect(combineBaseUrl('http', 'domain.com', 'prefix')).toEqual('http://domain.com/prefix/');
      });

      test('invalid url prefix', () => {
        expect(combineBaseUrl('http', 'domain.com', 'only-prefix')).toEqual('http://domain.com/only-prefix/');
        expect(combineBaseUrl('https', 'domain.com', 'only-prefix')).toEqual('https://domain.com/only-prefix/');
      });
    });

    describe('validatePackage', () => {
      test('should validate package names', () => {
        expect(validatePackage('package-name')).toBeTruthy();
        expect(validatePackage('@scope/package-name')).toBeTruthy();
      });

      test('should fails on validate package names', () => {
        expect(validatePackage('package-name/test/fake')).toBeFalsy();
        expect(validatePackage('@/package-name')).toBeFalsy();
        expect(validatePackage('$%$%#$%$#%#$%$#')).toBeFalsy();
        expect(validatePackage('node_modules')).toBeFalsy();
        expect(validatePackage('__proto__')).toBeFalsy();
        expect(validatePackage('favicon.ico')).toBeFalsy();
      });

      describe('validateName', () => {
        test('should fails with no string', () => {
          // intended to fail with Typescript, do not remove
          // @ts-ignore
          expect(validateName(null)).toBeFalsy();
          // @ts-ignore
          expect(validateName(undefined)).toBeFalsy();
        });

        test('good ones', () => {
          expect(validateName('verdaccio')).toBeTruthy();
          expect(validateName('some.weird.package-zzz')).toBeTruthy();
          expect(validateName('old-package@0.1.2.tgz')).toBeTruthy();
          // fix https://github.com/verdaccio/verdaccio/issues/1400
          expect(validateName('-build-infra')).toBeTruthy();
        });

        test('should be valid using uppercase', () => {
          expect(validateName('ETE')).toBeTruthy();
          expect(validateName('JSONStream')).toBeTruthy();
        });

        test('should fails with path seps', () => {
          expect(validateName('some/thing')).toBeFalsy();
          expect(validateName('some\\thing')).toBeFalsy();
        });

        test('should fail with no hidden files', () => {
          expect(validateName('.bin')).toBeFalsy();
        });

        test('should fails with reserved words', () => {
          expect(validateName('favicon.ico')).toBeFalsy();
          expect(validateName('node_modules')).toBeFalsy();
          expect(validateName('__proto__')).toBeFalsy();
        });

        test('should fails with other options', () => {
          expect(validateName('pk g')).toBeFalsy();
          expect(validateName('pk\tg')).toBeFalsy();
          expect(validateName('pk%20g')).toBeFalsy();
          expect(validateName('pk+g')).toBeFalsy();
          expect(validateName('pk:g')).toBeFalsy();
        });
      });
    });

    describe('validateMetadata', () => {
      test('should fills an empty metadata object', () => {
        // intended to fail with flow, do not remove
        // @ts-ignore
        expect(Object.keys(validateMetadata({}))).toContain(DIST_TAGS);
        // @ts-ignore
        expect(Object.keys(validateMetadata({}))).toContain('versions');
        // @ts-ignore
        expect(Object.keys(validateMetadata({}))).toContain('time');
      });

      test('should fails the assertions is not an object', () => {
        expect(function () {
          // @ts-ignore
          validateMetadata('');
          // @ts-ignore
        }).toThrow(expect.hasAssertions());
      });

      test('should fails the assertions is name does not match', () => {
        expect(function () {
          // @ts-ignore
          validateMetadata({}, 'no-name');
          // @ts-ignore
        }).toThrow(expect.hasAssertions());
      });
    });

    describe('getVersionFromTarball', () => {
      test('should get the right version', () => {
        const simpleName = 'test-name-4.2.12.tgz';
        const complexName = 'test-5.6.4-beta.2.tgz';
        const otherComplexName = 'test-3.5.0-6.tgz';
        expect(getVersionFromTarball(simpleName)).toEqual('4.2.12');
        expect(getVersionFromTarball(complexName)).toEqual('5.6.4-beta.2');
        expect(getVersionFromTarball(otherComplexName)).toEqual('3.5.0-6');
      });

      test("should don'n fall at incorrect tarball name", () => {
        expect(getVersionFromTarball('incorrectName')).toBeUndefined();
      });
    });
  });

  describe('String utilities', () => {
    test('should splice two strings and generate a url', () => {
      const url: string = spliceURL('http://domain.com', '/-/static/logo.png');

      expect(url).toMatch('http://domain.com/-/static/logo.png');
    });

    test('should splice a empty strings and generate a url', () => {
      const url: string = spliceURL('', '/-/static/logo.png');

      expect(url).toMatch('/-/static/logo.png');
    });

    test('should check HTTP protocol correctly', () => {
      expect(isHTTPProtocol('http://domain.com/-/static/logo.png')).toBeTruthy();
      expect(isHTTPProtocol('https://www.domain.com/-/static/logo.png')).toBeTruthy();
      expect(isHTTPProtocol('//domain.com/-/static/logo.png')).toBeTruthy();
      expect(isHTTPProtocol('file:///home/user/logo.png')).toBeFalsy();
      expect(isHTTPProtocol('file:///F:/home/user/logo.png')).toBeFalsy();
      // Note that uses ftp protocol in src was deprecated in modern browsers
      expect(isHTTPProtocol('ftp://1.2.3.4/home/user/logo.png')).toBeFalsy();
      expect(isHTTPProtocol('./logo.png')).toBeFalsy();
      expect(isHTTPProtocol('.\\logo.png')).toBeFalsy();
      expect(isHTTPProtocol('../logo.png')).toBeFalsy();
      expect(isHTTPProtocol('..\\logo.png')).toBeFalsy();
      expect(isHTTPProtocol('../../static/logo.png')).toBeFalsy();
      expect(isHTTPProtocol('..\\..\\static\\logo.png')).toBeFalsy();
      expect(isHTTPProtocol('logo.png')).toBeFalsy();
      expect(isHTTPProtocol('.logo.png')).toBeFalsy();
      expect(isHTTPProtocol('/static/logo.png')).toBeFalsy();
      expect(isHTTPProtocol('F:\\static\\logo.png')).toBeFalsy();
    });

    test('getByQualityPriorityValue', () => {
      expect(getByQualityPriorityValue('')).toEqual('');
      expect(getByQualityPriorityValue(null)).toEqual('');
      expect(getByQualityPriorityValue(undefined)).toEqual('');
      expect(getByQualityPriorityValue('something')).toEqual('something');
      expect(getByQualityPriorityValue('something,')).toEqual('something');
      expect(getByQualityPriorityValue('0,')).toEqual('0');
      expect(getByQualityPriorityValue('application/json')).toEqual('application/json');
      expect(getByQualityPriorityValue('application/json; q=1')).toEqual('application/json');
      expect(getByQualityPriorityValue('application/json; q=')).toEqual('application/json');
      expect(getByQualityPriorityValue('application/json;')).toEqual('application/json');
      expect(getByQualityPriorityValue('application/json; q=1.0, application/vnd.npm.install-v1+json; q=0.9, */*')).toEqual('application/json');
      expect(getByQualityPriorityValue('application/json; q=1.0, application/vnd.npm.install-v1+json; q=, */*')).toEqual('application/json');
      expect(getByQualityPriorityValue('application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.9, */*')).toEqual('application/vnd.npm.install-v1+json');
      expect(getByQualityPriorityValue('application/vnd.npm.install-v1+json; q=, application/json; q=0.9, */*')).toEqual('application/json');
    });
  });

  describe('User utilities', () => {
    test('should generate gravatar url with email', () => {
      const gravatarUrl: string = generateGravatarUrl('user@verdaccio.org');

      expect(gravatarUrl).toMatch('https://www.gravatar.com/avatar/');
      expect(gravatarUrl).not.toMatch('000000000');
    });

    test('should generate generic gravatar url', () => {
      const gravatarUrl: string = generateGravatarUrl();

      expect(gravatarUrl).toMatch(GENERIC_AVATAR);
    });
  });

  describe('parseReadme', () => {
    test('should parse makrdown text to html template', () => {
      const markdown = '# markdown';
      expect(parseReadme('testPackage', markdown)).toEqual('<h1 id="markdown">markdown</h1>');
      expect(parseReadme('testPackage', String(readmeFile('markdown.md')))).toMatchSnapshot();
    });

    test('should pass for conversion of non-ascii to markdown text', () => {
      const simpleText = 'simple text';
      const randomText = '%%%%%**##==';
      const randomTextMarkdown = 'simple text \n # markdown';

      expect(parseReadme('testPackage', randomText)).toEqual('<p>%%%%%**##==</p>');
      expect(parseReadme('testPackage', simpleText)).toEqual('<p>simple text</p>');
      expect(parseReadme('testPackage', randomTextMarkdown)).toEqual('<p>simple text </p>\n<h1 id="markdown">markdown</h1>');
    });

    test('should show error for no readme data', () => {
      const noData = '';
      const spy = jest.spyOn(logger, 'error');
      expect(parseReadme('testPackage', noData)).toEqual('<p>ERROR: No README data found!</p>');
      expect(spy).toHaveBeenCalledWith({ packageName: 'testPackage' }, '@{packageName}: No readme found');
    });
  });

  describe('addGravatarSupport', () => {
    test('check for blank object', () => {
      // @ts-ignore
      expect(addGravatarSupport({})).toEqual({});
    });

    test('author, contributors and maintainers fields are not present', () => {
      const packageInfo = {
        latest: {},
      };

      // @ts-ignore
      expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
    });

    test('author field is a blank object', () => {
      const packageInfo = { latest: { author: {} } };

      // @ts-ignore
      expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
    });

    test('author field is a string type', () => {
      const packageInfo = {
        latest: { author: 'user@verdccio.org' },
      };
      const result = {
        latest: {
          author: {
            author: 'user@verdccio.org',
            avatar: GENERIC_AVATAR,
            email: '',
          },
        },
      };

      // @ts-ignore
      expect(addGravatarSupport(packageInfo)).toEqual(result);
    });

    test('author field is an object type with author information', () => {
      const packageInfo = {
        latest: { author: { name: 'verdaccio', email: 'user@verdccio.org' } },
      };
      const result = {
        latest: {
          author: {
            avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
            email: 'user@verdccio.org',
            name: 'verdaccio',
          },
        },
      };

      // @ts-ignore
      expect(addGravatarSupport(packageInfo)).toEqual(result);
    });

    test('contributor field is a blank array', () => {
      const packageInfo = {
        latest: {
          contributors: [],
        },
      };

      // @ts-ignore
      expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
    });

    describe('contributors', () => {
      test('contributors field has contributors', () => {
        const packageInfo = {
          latest: {
            contributors: [
              { name: 'user', email: 'user@verdccio.org' },
              { name: 'user1', email: 'user1@verdccio.org' },
            ],
          },
        };

        const result = {
          latest: {
            contributors: [
              {
                avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
                email: 'user@verdccio.org',
                name: 'user',
              },
              {
                avatar: 'https://www.gravatar.com/avatar/51105a49ce4a9c2bfabf0f6a2cba3762',
                email: 'user1@verdccio.org',
                name: 'user1',
              },
            ],
          },
        };

        // @ts-ignore
        expect(addGravatarSupport(packageInfo)).toEqual(result);
      });

      test('contributors field is an object', () => {
        const packageInfo = {
          latest: {
            contributors: { name: 'user', email: 'user@verdccio.org' },
          },
        };

        const result = {
          latest: {
            contributors: [
              {
                avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
                email: 'user@verdccio.org',
                name: 'user',
              },
            ],
          },
        };

        // @ts-ignore
        expect(addGravatarSupport(packageInfo)).toEqual(result);
      });

      test('contributors field is a string', () => {
        const contributor = 'Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)';
        const packageInfo = {
          latest: {
            contributors: contributor,
          },
        };

        const result = {
          latest: {
            contributors: [
              {
                avatar: GENERIC_AVATAR,
                email: contributor,
                name: contributor,
              },
            ],
          },
        };

        // @ts-ignore
        expect(addGravatarSupport(packageInfo)).toEqual(result);
      });
    });

    test('maintainers field is a blank array', () => {
      const packageInfo = {
        latest: {
          maintainers: [],
        },
      };

      // @ts-ignore
      expect(addGravatarSupport(packageInfo)).toEqual(packageInfo);
    });

    test('maintainers field has maintainers', () => {
      const packageInfo = {
        latest: {
          maintainers: [
            { name: 'user', email: 'user@verdccio.org' },
            { name: 'user1', email: 'user1@verdccio.org' },
          ],
        },
      };

      const result = {
        latest: {
          maintainers: [
            {
              avatar: 'https://www.gravatar.com/avatar/794d7f6ef93d0689437de3c3e48fadc7',
              email: 'user@verdccio.org',
              name: 'user',
            },
            {
              avatar: 'https://www.gravatar.com/avatar/51105a49ce4a9c2bfabf0f6a2cba3762',
              email: 'user1@verdccio.org',
              name: 'user1',
            },
          ],
        },
      };

      // @ts-ignore
      expect(addGravatarSupport(packageInfo)).toEqual(result);
    });
  });

  describe('formatAuthor', () => {
    test('should check author field different values', () => {
      const author = 'verdaccioNpm';
      expect(formatAuthor(author).name).toEqual(author);
    });
    test('should check author field for object value', () => {
      const user = {
        name: 'Verdaccion NPM',
        email: 'verdaccio@verdaccio.org',
        url: 'https://verdaccio.org',
      };
      expect(formatAuthor(user).url).toEqual(user.url);
      expect(formatAuthor(user).email).toEqual(user.email);
      expect(formatAuthor(user).name).toEqual(user.name);
    });
    test('should check author field for other value', () => {
      expect(formatAuthor(null).name).toEqual(DEFAULT_USER);
      expect(formatAuthor({}).name).toEqual(DEFAULT_USER);
      expect(formatAuthor([]).name).toEqual(DEFAULT_USER);
    });
  });

  describe('host', () => {
    // this scenario is usual when reverse proxy is setup
    // without the host header
    test('get empty string with missing host header', () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/',
      });
      expect(getPublicUrl(undefined, req)).toEqual('/');
    });

    test('get a valid host', () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
        },
        url: '/',
      });
      expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
    });

    test('check a valid host header injection', () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: `some.com"><svg onload="alert(1)">`,
        },
        url: '/',
      });
      expect(function () {
        // @ts-expect-error
        getPublicUrl({}, req);
      }).toThrow('invalid host');
    });

    test('get a valid host with prefix', () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
        },
        url: '/',
      });

      expect(getPublicUrl('/prefix/', req)).toEqual('http://some.com/prefix/');
    });

    test('get a valid host with prefix no trailing', () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
        },
        url: '/',
      });

      expect(getPublicUrl('/prefix-no-trailing', req)).toEqual('http://some.com/prefix-no-trailing/');
    });

    test('get a valid host with null prefix', () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
        },
        url: '/',
      });

      // @ts-ignore
      expect(getPublicUrl(null, req)).toEqual('http://some.com/');
    });
  });

  describe('X-Forwarded-Proto', () => {
    test('with a valid X-Forwarded-Proto https', () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'https',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('https://some.com/');
    });

    test('with a invalid X-Forwarded-Proto https', () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'invalidProto',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
    });

    test('with a HAProxy X-Forwarded-Proto https', () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'https,https',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('https://some.com/');
    });

    test('with a HAProxy X-Forwarded-Proto different protocol', () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'http,https',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
    });
  });

  describe('env variable', () => {
    test('with a valid X-Forwarded-Proto https and env variable', () => {
      process.env.VERDACCIO_PUBLIC_URL = 'https://env.domain.com/';
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'https',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('https://env.domain.com/');
      delete process.env.VERDACCIO_PUBLIC_URL;
    });

    test('with a valid X-Forwarded-Proto https and env variable with prefix', () => {
      process.env.VERDACCIO_PUBLIC_URL = 'https://env.domain.com/urlPrefix/';
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'http',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('https://env.domain.com/urlPrefix/');
      delete process.env.VERDACCIO_PUBLIC_URL;
    });

    test('with a valid X-Forwarded-Proto https and env variable with prefix as url prefix', () => {
      process.env.VERDACCIO_PUBLIC_URL = 'https://env.domain.com/urlPrefix/';
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'https',
        },
        url: '/',
      });

      expect(getPublicUrl('conf_url_prefix', req)).toEqual('https://env.domain.com/conf_url_prefix/');
      delete process.env.VERDACCIO_PUBLIC_URL;
    });

    test('with a valid X-Forwarded-Proto https and env variable with prefix as root url prefix', () => {
      process.env.VERDACCIO_PUBLIC_URL = 'https://env.domain.com/urlPrefix/';
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'https',
        },
        url: '/',
      });

      expect(getPublicUrl('/', req)).toEqual('https://env.domain.com/');
      delete process.env.VERDACCIO_PUBLIC_URL;
    });

    test('with a invalid X-Forwarded-Proto https and env variable', () => {
      process.env.VERDACCIO_PUBLIC_URL = 'https://env.domain.com';
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'invalidProtocol',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('https://env.domain.com/');
      delete process.env.VERDACCIO_PUBLIC_URL;
    });

    test('with a invalid X-Forwarded-Proto https and invalid url with env variable', () => {
      process.env.VERDACCIO_PUBLIC_URL = 'ftp://env.domain.com';
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'invalidProtocol',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
      delete process.env.VERDACCIO_PUBLIC_URL;
    });

    test('with a invalid X-Forwarded-Proto https and host injection with host', () => {
      process.env.VERDACCIO_PUBLIC_URL = 'http://injection.test.com"><svg onload="alert(1)">';
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'invalidProtocol',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
      delete process.env.VERDACCIO_PUBLIC_URL;
    });

    test('with a invalid X-Forwarded-Proto https and host injection with invalid host', () => {
      process.env.VERDACCIO_PUBLIC_URL = 'http://injection.test.com"><svg onload="alert(1)">';
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some',
          [HEADERS.FORWARDED_PROTO]: 'invalidProtocol',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('http://some/');
      delete process.env.VERDACCIO_PUBLIC_URL;
    });

    test('with the VERDACCIO_FORWARDED_PROTO to override valid X-Forwarded-Proto https', () => {
      process.env.VERDACCIO_FORWARDED_PROTO = 'http';
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          'CloudFront-Forwarded-Proto': 'http',
          [HEADERS.FORWARDED_PROTO]: 'https',
        },
        url: '/',
      });

      expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
      delete process.env.VERDACCIO_FORWARDED_PROTO;
    });

    test('with the VERDACCIO_FORWARDED_PROTO undefined', () => {
      process.env.VERDACCIO_FORWARDED_PROTO = undefined;
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          host: 'some.com',
          [HEADERS.FORWARDED_PROTO]: 'https',
        },
        url: '/',
      });

      expect(getPublicUrl('/test/', req)).toEqual('http://some.com/test/');
      delete process.env.VERDACCIO_FORWARDED_PROTO;
    });
  });
});
