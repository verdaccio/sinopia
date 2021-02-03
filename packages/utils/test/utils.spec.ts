import { DIST_TAGS, DEFAULT_USER } from '@verdaccio/commons-api';
import {
  validateName,
  convertDistRemoteToLocalTarballUrls,
  validatePackage,
  validateMetadata,
  combineBaseUrl,
  getVersion,
  normalizeDistTags,
  getWebProtocol,
  formatAuthor,
} from '../src/index';

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
        const convertDist = convertDistRemoteToLocalTarballUrls(cloneMetadata(), {
          headers: {
            host: fakeHost,
          },
          // @ts-ignore
          get: () => 'http',
          protocol: 'http',
        });
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
        expect(convertDist.versions['1.0.0'].dist.tarball).toEqual(
          convertDist.versions['1.0.0'].dist.tarball
        );
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
        expect(combineBaseUrl('http', 'domain')).toEqual('http://domain');
      });

      test('should create a base url for registry', () => {
        expect(combineBaseUrl('http', 'domain', '')).toEqual('http://domain');
        expect(combineBaseUrl('http', 'domain', '/')).toEqual('http://domain');
        expect(combineBaseUrl('http', 'domain', '/prefix/')).toEqual('http://domain/prefix');
        expect(combineBaseUrl('http', 'domain', '/prefix/deep')).toEqual(
          'http://domain/prefix/deep'
        );
        expect(combineBaseUrl('http', 'domain', 'only-prefix')).toEqual('only-prefix');
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
  });
});
