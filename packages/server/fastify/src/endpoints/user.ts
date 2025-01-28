import buildDebug from 'debug';
import { FastifyInstance } from 'fastify';
import _ from 'lodash';

import { getApiToken } from '@verdaccio/auth';
import { createRemoteUser } from '@verdaccio/config';
import { validatioUtils } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';
import { RemoteUser } from '@verdaccio/types';
import { getAuthenticatedMessage } from '@verdaccio/utils';

const debug = buildDebug('verdaccio:fastify:user');

async function userRoute(fastify: FastifyInstance) {
  interface UserParamsInterface {
    org_couchdb_user: string;
  }

  fastify.get<{ Params: UserParamsInterface }>('/:org_couchdb_user', async (request, reply) => {
    // @ts-ignore
    // TODO: compare org_couchdb_user with remote user name
    const message = getAuthenticatedMessage(request.userRemote.name);
    logger.info('user authenticated message %o', message);
    reply.code(fastify.statusCode.OK);
    return { ok: message };
  });

  interface DeleteTokenParamsInterface {
    token: string;
  }

  fastify.delete<{ Params: DeleteTokenParamsInterface }>(
    '/token/:token',
    async (request, reply) => {
      debug('loging out');
      const { token } = request.params;
      const userRemote: RemoteUser = request.userRemote;
      await fastify.auth.invalidateToken(token);
      // eslint-disable-next-line no-console
      console.log('userRoute', userRemote);
      reply.code(fastify.statusCode.OK);
      return { ok: fastify.apiMessage.LOGGED_OUT };
    }
  );

  interface UpdateUserParamsInterface {
    username: string;
  }

  fastify.put<{
    Body: { name: string; password: string };
    Params: UpdateUserParamsInterface;
  }>('/:username', async (request, reply) => {
    const { name, password } = request.body;
    const remoteName = request.userRemote.name;
    if (_.isNil(remoteName) === false && _.isNil(name) === false && remoteName === name) {
      //   debug('login: no remote user detected');
      fastify.auth.authenticate(
        name,
        password,
        async function callbackAuthenticate(err, user): Promise<void> {
          if (err) {
            logger.trace(
              { name, err },
              'authenticating for user @{username} failed. Error: @{err.message}'
            );
            reply
              .code(fastify.statusCode.UNAUTHORIZED)
              .send(
                fastify.errorUtils.getCode(
                  fastify.statusCode.UNAUTHORIZED,
                  fastify.apiError.BAD_USERNAME_PASSWORD
                )
              );
          }
          const restoredRemoteUser: RemoteUser = createRemoteUser(name, user?.groups || []);
          const token = await getApiToken(
            fastify.auth,
            fastify.configInstance,
            restoredRemoteUser,
            password
          );
          debug('login: new token');
          if (!token) {
            return reply.send(fastify.errorUtils.getUnauthorized());
          } else {
            reply.code(fastify.statusCode.CREATED);
            const message = getAuthenticatedMessage(remoteName);
            debug('login: created user message %o', message);
            reply.send({
              ok: message,
              token,
            });
          }
        }
      );
    } else {
      if (
        validatioUtils.validatePassword(
          password as string,
          fastify.configInstance?.server?.passwordValidationRegex
        ) === false
      ) {
        debug('adduser: invalid password');
        reply.code(fastify.statusCode.BAD_REQUEST).send(
          fastify.errorUtils.getCode(
            fastify.statusCode.BAD_REQUEST,
            // eslint-disable-next-line new-cap
            fastify.apiError.PASSWORD_SHORT
          )
        );
        return;
      }
      fastify.auth.add_user(name, password, async function (err, user): Promise<void> {
        if (err) {
          if (
            err.status >= fastify.statusCode.BAD_REQUEST &&
            err.status < fastify.statusCode.INTERNAL_ERROR
          ) {
            debug('adduser: error on create user');
            // With npm registering is the same as logging in,
            // and npm accepts only an 409 error.
            // So, changing status code here.
            const addUserError =
              fastify.errorUtils.getCode(err.status, err.message) ||
              fastify.errorUtils.getConflict(err.message);

            reply.send(addUserError);
            return;
          }
        }
        const token =
          name && password
            ? await getApiToken(fastify.auth, fastify.configInstance, user as RemoteUser, password)
            : undefined;
        debug('adduser: new token %o', token);
        if (!token) {
          return reply.send(fastify.errorUtils.getUnauthorized());
        }
        debug('adduser: user has been created');
        reply.code(fastify.statusCode.CREATED).send({
          ok: `user '${name}' created`,
          token,
        });
      });
    }
  });
}

export default userRoute;
