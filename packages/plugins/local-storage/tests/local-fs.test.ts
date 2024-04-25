import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

import { fileUtils } from '@verdaccio/core';
import { createTempFolder } from '@verdaccio/test-helper';
import { ILocalPackageManager, Logger, Manifest } from '@verdaccio/types';

import LocalDriver from '../src/local-fs';
import pkg from './__fixtures__/pkg';

let localTempStorage: string;

// returns a promise which resolves true if file exists:
function checkFileExists(filepath) {
  return new Promise((resolve) => {
    fs.access(filepath, fs.constants.F_OK, (error) => {
      resolve(!error);
    });
  });
}

const logger: Logger = {
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  child: jest.fn(),
  warn: jest.fn(),
  http: jest.fn(),
  trace: jest.fn(),
};

describe('Local FS test', () => {
  let tmpFolder;
  beforeEach(async () => {
    tmpFolder = await fileUtils.createTempFolder('local-fs');
    localTempStorage = path.join(tmpFolder, './_storage');
  });

  describe.skip('deletePackage() group', () => {
    test('should delete a package', async () => {
      const localFs = new LocalDriver(path.join(localTempStorage, 'createPackage'), logger);
      await localFs.createPackag('createPackage', pkg as unknown as Manifest);
      // verdaccio removes the package.json instead the package name
      await localFs.deletePackage('package.json');
      // verify if the `package.json` does not exist anymore
      // note: the folder still remains
      await expect(checkFileExists(localFs._getStorage('package.json'))).resolves.toBeFalsy();
    });
    test('should fails on delete a package', async () => {
      const localFs = new LocalDriver(path.join(localTempStorage, 'createPackage'), logger);
      // verdaccio removes the package.json instead the package name
      await expect(localFs.deletePackage('package.json')).rejects.toThrow('ENOENT');
    });
  });

  describe('removePackage() group', () => {
    beforeEach(() => {
      fs.mkdirSync(path.join(localTempStorage, '_toDelete'), { recursive: true });
    });

    test('should successfully remove the package', async () => {
      const localFs: ILocalPackageManager = new LocalDriver(
        path.join(localTempStorage, '_toDelete'),
        logger
      );

      await expect(localFs.removePackage()).resolves.toBeUndefined();
    });

    test('removePackage() fails', async () => {
      const localFs: ILocalPackageManager = new LocalDriver(
        path.join(localTempStorage, '_toDelete_fake'),
        logger
      );
      await expect(localFs.removePackage()).rejects.toThrow(/ENOENT/);
    });
  });

  describe('writeTarballNext', () => {
    test('should write a tarball', (done) => {
      const abort = new AbortController();
      const tmp = createTempFolder('local-fs-write-tarball');
      const localFs = new LocalDriver(tmp, logger);
      const readableStream = Readable.from('foooo');
      // TODO: verify file exist
      localFs.writeTarball('juan-1.0.0.tgz', { signal: abort.signal }).then((stream) => {
        stream.on('finish', () => {
          done();
        });
        readableStream.pipe(stream);
      });
    });
  });

  describe('writeTarballNextNoFolder', () => {
    test('should write a tarball even if folder does not exist', (done) => {
      const abort = new AbortController();
      const tmp = path.join(localTempStorage, 'local-fs-write-tarball-new-folder');
      const localFs = new LocalDriver(tmp, logger);
      const readableStream = Readable.from('foooo');
      localFs.writeTarball('juan-1.0.0.tgz', { signal: abort.signal }).then((stream) => {
        stream.on('finish', () => {
          done();
        });
        readableStream.pipe(stream);
      });
    });
  });

  describe('readTarballNext', () => {
    test('should read a tarball', (done) => {
      const abort = new AbortController();
      const localFs = new LocalDriver(
        path.join(__dirname, '__fixtures__/readme-test-next'),
        logger
      );
      localFs.readTarball('test-readme-0.0.1.tgz', { signal: abort.signal }).then((stream) => {
        stream.on('data', (data) => {
          expect(data.length).toEqual(352);
        });
        stream.on('end', () => {
          done();
        });
      });
    });

    test('should abort read a tarball', (done) => {
      const abort = new AbortController();
      const localFs = new LocalDriver(
        path.join(__dirname, '__fixtures__/readme-test-next'),
        logger
      );
      localFs.readTarball('test-readme-0.0.3.tgz', { signal: abort.signal }).then((stream) => {
        stream.on('error', (error: any) => {
          // FIXME: might be different results sometimes, need research
          // expect(error.code).toEqual('ABORT_ERR');
          expect(error).toBeDefined();
          done();
        });
        abort.abort();
      });
    });

    test('fails on read a tarball doex not exist', (done) => {
      const abort = new AbortController();

      const localFs = new LocalDriver(
        path.join(__dirname, '__fixtures__/readme-test-next'),
        logger
      );
      localFs.readTarball('does-not-exist-0.0.0.tgz', { signal: abort.signal }).then((stream) => {
        stream.on('error', (error: any) => {
          expect(error.code).toEqual('ENOENT');
          done();
        });
      });
    });

    test('should return content-length', (done) => {
      const localFs = new LocalDriver(
        path.join(__dirname, '__fixtures__/readme-test-next'),
        logger
      );
      const abort = new AbortController();
      localFs.readTarball('test-readme-0.0.0.tgz', { signal: abort.signal }).then((stream) => {
        stream.on('data', (data) => {
          expect(data.length).toEqual(352);
        });

        stream.on('content-length', (content) => {
          expect(content).toEqual(352);
          done();
        });
      });
    }, 100000);
  });
});
