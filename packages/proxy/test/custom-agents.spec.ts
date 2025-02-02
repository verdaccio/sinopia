import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent';
import { describe, expect, test } from 'vitest';

import CustomAgents from '../src/agent';

describe('CustomAgents', () => {
  test('Create a HttpProxyAgent instance if the target URL uses HTTP', () => {
    const agent = new CustomAgents('http://registry.npmjs.org', 'http://127.0.0.1:7890', {}).get();
    expect(agent.http).toBeInstanceOf(HttpProxyAgent);
    expect(agent.https).toBeUndefined();
  });

  test('Create a HttpsProxyAgent instance if the target URL uses HTTPS', () => {
    const agent = new CustomAgents('https://registry.npmjs.org', 'http://127.0.0.1:7890', {}).get();
    expect(agent.http).toBeUndefined();
    expect(agent.https).toBeInstanceOf(HttpsProxyAgent);
  });
});
