import fs from 'fs';

import _ from 'lodash';
import { LocalStorage, StorageList, Logger } from '@verdaccio/types';

export function loadPrivatePackages(path: string, logger: Logger): LocalStorage {
  const list: StorageList = [];
  const emptyDatabase = { list, secret: '' };
  const data = fs.readFileSync(path, 'utf8');

  if (_.isNil(data)) {
    // readFileSync is platform specific, FreeBSD might return null
    return emptyDatabase;
  }

  let db;
  try {
    db = JSON.parse(data);
  } catch (err) {
    logger.error(
      `Package database file corrupted (invalid JSON), please check the error` +
        ` printed below.\nFile Path: ${path}`,
      err
    );
    throw Error('Package database file corrupted (invalid JSON)');
  }

  if (_.isEmpty(db)) {
    return emptyDatabase;
  }

  return db;
}
