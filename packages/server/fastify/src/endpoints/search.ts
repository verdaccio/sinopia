/* eslint-disable no-console */

/* eslint-disable no-invalid-this */
import { FastifyInstance } from 'fastify';

import { searchUtils } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';

interface QueryInterface {
  url: string;
  query: searchUtils.SearchQuery;
}

async function searchRoute(fastify: FastifyInstance) {
  fastify.get<{ Querystring: QueryInterface }>('/-/v1/search', async (request, reply) => {
    // TODO: apply security layer here like in
    // packages/api/src/v1/search.ts
    // TODO: add validations for query, some parameters are mandatory
    // TODO: review which query fields are mandatory
    const abort = new AbortController();
    // https://nodejs.org/dist/latest-v18.x/docs/api/http.html#event-close
    request.socket.on('close', () => {
      abort.abort();
    });
    const { url, query } = request.query;
    const storage = fastify.storage;
    const data = await storage.search({
      query,
      url,
      abort,
    });

    logger.http('search endpoint');
    reply.code(200).send(data);
  });
}

export default searchRoute;
