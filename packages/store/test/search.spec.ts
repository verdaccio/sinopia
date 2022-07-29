import { setGlobalDispatcher } from 'undici';

import { Config } from '@verdaccio/config';
import { searchUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { configExample } from '@verdaccio/mock';

import { Storage, removeDuplicates } from '../src';

setup([]);

describe('search', () => {
  describe('search manager utils', () => {
    test('remove duplicates', () => {
      const item: searchUtils.SearchPackageItem = {
        // @ts-expect-error
        package: {
          name: 'foo',
        },
        ['dist-tags']: {
          latest: '1.0.0',
        },
        // @ts-expect-error
        score: {},
        searchScore: 0.4,
      };

      expect(removeDuplicates([item, item])).toEqual([item]);
    });

    test('search items', async () => {
      const { MockAgent } = require('undici');
      // FIXME: fetch is already part of undici
      const domain = 'http://localhost:4873';
      const url = '/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio';
      const response = require('./fixtures/search.json');
      const options = {
        path: url,
        method: 'GET',
      };
      const mockAgent = new MockAgent({ connections: 1 });
      mockAgent.disableNetConnect();
      setGlobalDispatcher(mockAgent);
      const mockClient = mockAgent.get(domain);
      mockClient.intercept(options).reply(200, JSON.stringify(response));
      const config = new Config(configExample());
      const storage = new Storage(config);
      await storage.init(config);

      // @ts-expect-error
      const results = await storage.search({ url, query: { text: 'foo' } });
      expect(results).toHaveLength(4);
    });
  });
});
