import supertest from 'supertest';
import _ from 'lodash';

import {
  getBadRequest,
  getConflict,
  getUnauthorized,
  HEADERS,
  HEADER_TYPE,
  API_MESSAGE,
  HTTP_STATUS,
  API_ERROR,
} from '@verdaccio/commons-api';

import { $RequestExtend, $ResponseExtend } from '../../types/custom';
import { initializeServer } from './_helper';

const mockApiJWTmiddleware = jest.fn(
  () => (req: $RequestExtend, res: $ResponseExtend, _next): void => {
    req.remote_user = { name: 'test', groups: [], real_groups: [] };
    _next();
  }
);

const mockAuthenticate = jest.fn(() => (_name, _password, callback): void => {
  return callback(null, ['all']);
});

const mockAddUser = jest.fn(() => (_name, _password, callback): void => {
  return callback(getConflict(API_ERROR.USERNAME_ALREADY_REGISTERED));
});

jest.mock('@verdaccio/auth', () => ({
  getApiToken: () => 'token',
  Auth: class {
    apiJWTmiddleware() {
      return mockApiJWTmiddleware();
    }
    allow_access(_d, f_, cb) {
      cb(null, true);
    }
    add_user(name, password, callback) {
      mockAddUser()(name, password, callback);
    }
    authenticate(_name, _password, callback) {
      mockAuthenticate()(_name, _password, callback);
    }
  },
}));

describe('user', () => {
  const credentials = { name: 'test', password: 'test' };

  test('should test add a new user', async (done) => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () => (req: $RequestExtend, res: $ResponseExtend, _next): void => {
        req.remote_user = { name: undefined };
        _next();
      }
    );

    mockAddUser.mockImplementationOnce(() => (_name, _password, callback): void => {
      return callback(null, true);
    });
    supertest(await initializeServer('user.yaml'))
      .put(`/-/user/org.couchdb.user:newUser`)
      .send({
        name: 'newUser',
        password: 'newUser',
      })
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.CREATED)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body.ok).toBeDefined();
        expect(res.body.token).toBeDefined();
        const token = res.body.token;
        expect(typeof token).toBe('string');
        expect(res.body.ok).toMatch(`user 'newUser' created`);
        done();
      });
  });

  test('should test fails on add a existing user with login', async (done) => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () => (req: $RequestExtend, res: $ResponseExtend, _next): void => {
        req.remote_user = { name: undefined };
        _next();
      }
    );
    supertest(await initializeServer('user.yaml'))
      .put('/-/user/org.couchdb.user:jotaNew')
      .send(credentials)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.CONFLICT)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body.error).toBeDefined();
        expect(res.body.error).toMatch(API_ERROR.USERNAME_ALREADY_REGISTERED);
        done();
      });
  });

  test('should log in as existing user', async (done) => {
    supertest(await initializeServer('user.yaml'))
      .put(`/-/user/org.couchdb.user:${credentials.name}`)
      .send(credentials)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.CREATED)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body).toBeTruthy();
        expect(res.body.ok).toMatch(`you are authenticated as \'${credentials.name}\'`);
        done();
      });
  });

  test('should test fails add a new user with missing name', async (done) => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () => (req: $RequestExtend, res: $ResponseExtend, _next): void => {
        req.remote_user = { name: undefined };
        _next();
      }
    );
    mockAddUser.mockImplementationOnce(() => (_name, _password, callback): void => {
      return callback(getBadRequest(API_ERROR.USERNAME_PASSWORD_REQUIRED));
    });
    const credentialsShort = _.cloneDeep(credentials);
    delete credentialsShort.name;

    supertest(await initializeServer('user.yaml'))
      .put(`/-/user/org.couchdb.user:${credentials.name}`)
      .send(credentialsShort)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.BAD_REQUEST)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        expect(res.body.error).toBeDefined();
        expect(res.body.error).toMatch(API_ERROR.USERNAME_PASSWORD_REQUIRED);
        done();
      });
  });

  test('should test fails add a new user with missing password', async (done) => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () => (req: $RequestExtend, res: $ResponseExtend, _next): void => {
        req.remote_user = { name: undefined };
        _next();
      }
    );
    const credentialsShort = _.cloneDeep(credentials);
    delete credentialsShort.password;

    supertest(await initializeServer('user.yaml'))
      .put(`/-/user/org.couchdb.user:${credentials.name}`)
      .send(credentialsShort)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.BAD_REQUEST)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        expect(res.body.error).toBeDefined();
        // FIXME: message is not 100% accurate
        // eslint-disable-next-line new-cap
        expect(res.body.error).toMatch(API_ERROR.PASSWORD_SHORT());
        done();
      });
  });

  test('should test fails add a new user with wrong password', async (done) => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () => (req: $RequestExtend, res: $ResponseExtend, _next): void => {
        req.remote_user = { name: 'test' };
        _next();
      }
    );
    mockAuthenticate.mockImplementationOnce(() => (_name, _password, callback): void => {
      return callback(getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD));
    });
    const credentialsShort = _.cloneDeep(credentials);
    credentialsShort.password = 'failPassword';

    supertest(await initializeServer('user.yaml'))
      .put('/-/user/org.couchdb.user:test')
      .send(credentialsShort)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.UNAUTHORIZED)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        expect(res.body.error).toBeDefined();
        expect(res.body.error).toMatch(API_ERROR.BAD_USERNAME_PASSWORD);
        done();
      });
  });

  test('should be able to logout an user', async (done) => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () => (req: $RequestExtend, res: $ResponseExtend, _next): void => {
        req.remote_user = { name: 'test' };
        _next();
      }
    );
    mockAuthenticate.mockImplementationOnce(() => (_name, _password, callback): void => {
      return callback(getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD));
    });
    const credentialsShort = _.cloneDeep(credentials);
    credentialsShort.password = 'failPassword';

    supertest(await initializeServer('user.yaml'))
      .delete('/-/user/token/someSecretToken')
      .send(credentialsShort)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        expect(res.body.ok).toMatch(API_MESSAGE.LOGGED_OUT);
        done();
      });
  });
});
