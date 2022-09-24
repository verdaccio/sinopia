import { addRegistry, initialSetup, prepareGenericEmptyProject } from '@verdaccio/test-cli-commons';

import { pnpm } from './utils';

async function bumbUp(tempFolder, registry) {
  await pnpm({ cwd: tempFolder }, 'version', 'minor', ...addRegistry(registry.getRegistryUrl()));
}

async function publish(tempFolder, pkgName, registry, arg: string[] = []) {
  const resp = await pnpm(
    { cwd: tempFolder },
    'publish',
    ...arg,
    '--json',
    ...addRegistry(registry.getRegistryUrl())
  );
  const parsedBody = JSON.parse(resp.stdout as string);
  expect(parsedBody.name).toEqual(pkgName);
}

describe('publish a package', () => {
  jest.setTimeout(20000);
  let registry;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
  });

  test.each([['@foo/foo', 'foo']])('should list dist-tags for %s', async (pkgName) => {
    const { tempFolder } = await prepareGenericEmptyProject(
      pkgName,
      '1.0.0',
      registry.port,
      registry.getToken(),
      registry.getRegistryUrl()
    );
    await publish(tempFolder, pkgName, registry);
    await bumbUp(tempFolder, registry);
    await publish(tempFolder, pkgName, registry, ['--tag', 'beta']);
    const resp2 = await pnpm(
      { cwd: tempFolder },
      'dist-tag',
      'ls',
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );
    expect(resp2.stdout).toEqual('beta: 1.1.0latest: 1.0.0');
  });

  test.each([['@verdaccio/bar']])('should remove tag with dist-tags for %s', async (pkgName) => {
    const { tempFolder } = await prepareGenericEmptyProject(
      pkgName,
      '1.0.0',
      registry.port,
      registry.getToken(),
      registry.getRegistryUrl()
    );
    await publish(tempFolder, pkgName, registry);
    await bumbUp(tempFolder, registry);
    await publish(tempFolder, pkgName, registry, ['--tag', 'beta']);
    const resp2 = await pnpm(
      { cwd: tempFolder },
      'dist-tag',
      'rm',
      `${pkgName}@1.1.0`,
      'beta',
      ...addRegistry(registry.getRegistryUrl())
    );
    expect(resp2.stdout).toEqual('-beta: @verdaccio/bar@1.1.0');
  });

  test.each([['@verdaccio/five']])(
    'should add tag to package and version with dist-tags for %s',
    async (pkgName) => {
      const { tempFolder } = await prepareGenericEmptyProject(
        pkgName,
        '1.0.0',
        registry.port,
        registry.getToken(),
        registry.getRegistryUrl()
      );
      await publish(tempFolder, pkgName, registry);
      await bumbUp(tempFolder, registry);
      await publish(tempFolder, pkgName, registry);
      const resp2 = await pnpm(
        { cwd: tempFolder },
        'dist-tag',
        'add',
        `${pkgName}@1.1.0`,
        'alfa',
        ...addRegistry(registry.getRegistryUrl())
      );
      expect(resp2.stdout).toEqual(`+alfa: ${pkgName}@1.1.0`);
    }
  );

  afterAll(async () => {
    registry.stop();
  });
});
