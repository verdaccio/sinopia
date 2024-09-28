import request from 'supertest';

import { HTTP_STATUS } from '@verdaccio/core';

import { allow } from '../src';
import { getApp } from './helper';

test('should allow request', async () => {
  const can = allow({
    allow_publish: (params, remove, cb) => {
      return cb(null, true);
    },
  });
  const app = getApp([]);
  // @ts-ignore
  app.get('/:package', can('publish'), (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).get('/react').expect(HTTP_STATUS.OK);
});

test('should allow scope request', async () => {
  const can = allow({
    allow_publish: (params, remove, cb) => {
      return cb(null, true);
    },
  });
  const app = getApp([]);
  // @ts-ignore
  app.get('/:package/:scope', can('publish'), (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).get('/@verdaccio/core').expect(HTTP_STATUS.OK);
});

test('should allow filename request', async () => {
  const can = allow({
    allow_publish: (params, remove, cb) => {
      return cb(null, true);
    },
  });
  const app = getApp([]);
  // @ts-ignore
  app.get('/:filename', can('publish'), (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).get('/aaa-0.0.1.tgz').expect(HTTP_STATUS.OK);
});

test('should not allow request', async () => {
  const can = allow({
    allow_publish: (params, remove, cb) => {
      return cb(null, false);
    },
  });
  const app = getApp([]);
  // @ts-ignore
  app.get('/sec', can('publish'), (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).get('/sec').expect(HTTP_STATUS.INTERNAL_ERROR);
});

test('should handle error request', async () => {
  const can = allow({
    allow_publish: (params, remove, cb) => {
      return cb(Error('foo error'));
    },
  });
  const app = getApp([]);
  // @ts-ignore
  app.get('/err', can('publish'));

  return request(app).get('/err').expect(HTTP_STATUS.INTERNAL_ERROR);
});

test('should allow request with version', async () => {
  const can = allow({
    allow_publish: (params, remove, cb) => {
      return params.packageVersion === '1.0.0' ? cb(null, true) : cb(null, false);
    },
  });
  const app = getApp([]);
  // @ts-ignore
  app.get('/:package/:version', can('publish'), (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).get('/pacman/1.0.0').expect(HTTP_STATUS.OK);
});

test('should not allow request with version', async () => {
  const can = allow({
    allow_publish: (params, remove, cb) => {
      return params.packageVersion === '1.0.0' ? cb(null, true) : cb(null, false);
    },
  });
  const app = getApp([]);
  // @ts-ignore
  app.get('/:package/:version', can('publish'), (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).get('/pacman/2.0.0').expect(HTTP_STATUS.INTERNAL_ERROR);
});
