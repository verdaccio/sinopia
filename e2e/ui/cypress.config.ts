import { defineConfig } from 'cypress';
import { join } from 'path';
import { Registry, ServerQuery } from 'verdaccio';

import { parseConfigFile } from '@verdaccio/config';
import { HEADERS, fileUtils } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

let registry1;
export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('before:run', async () => {
        const configProtected = parseConfigFile(join(__dirname, './config/config.yaml'));
        const registry1storage = await fileUtils.createTempStorageFolder('storage-1');
        const protectedRegistry = await Registry.fromConfigToPath({
          ...configProtected,
          storage: registry1storage,
        });
        registry1 = new Registry(protectedRegistry.configPath, {
          createUser: true,
          credentials: { user: 'test', password: 'test' },
        });
        await registry1.init();
      });

      on('after:run', async () => {
        registry1.stop();
      });

      on('task', {
        publishScoped({ pkgName }) {
          const scopedPackageMetadata = generatePackageMetadata(pkgName, '1.0.6');
          const server = new ServerQuery(registry1.getRegistryUrl());
          server
            .putPackage(scopedPackageMetadata.name, scopedPackageMetadata, {
              [HEADERS.AUTHORIZATION]: `Bearer ${registry1.getToken()}`,
            })
            .then(() => {});
          return null;
        },
        publishProtected({ pkgName }) {
          const protectedPackageMetadata = generatePackageMetadata(pkgName, '5.0.5');
          const server = new ServerQuery(registry1.getRegistryUrl());
          server
            .putPackage(protectedPackageMetadata.name, protectedPackageMetadata, {
              [HEADERS.AUTHORIZATION]: `Bearer ${registry1.getToken()}`,
            })
            .then(() => {});
        },
        registry() {
          return {
            registryUrl: registry1.getRegistryUrl(),
            port: registry1.getPort(),
          };
        },
      });
    },
  },
});
