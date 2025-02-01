# Change Log

## 13.0.0-next-8.3

### Patch Changes

- ca91b9a: fix: config builder `addLogger`

## 13.0.0-next-8.2

### Patch Changes

- e308fbb: chore: move agent_options to config
- b6ea32c: chore: add `error` to log level enum
- 4adaa83: chore: fix typedocs warnings
- 5cbee6f: fix: unpublish a package on storage package
- 538bb8f: feat: keep_readmes option when publishing packages

## 13.0.0-next-8.1

### Minor Changes

- 6a8154c: feat: update logger pino to latest

## 13.0.0-next-8.0

### Major Changes

- chore: move v7 next to v8 next

## 12.0.0

### Major Changes

- 47f61c6: feat!: bump to v7
- e7ebccb: update major dependencies, remove old nodejs support

### Minor Changes

- f047cc8: refactor: auth with legacy sign support
- bd8703e: feat: add migrateToSecureLegacySignature and remove enhancedLegacySignature property

### Patch Changes

- 10dd81f: feat: complete overhaul of web user interface
- 6e764e3: feat: add support for npm owner
- de6ff5c: fix: update fields for abbreviated manifest
- 117eb1c: fix: change bundleDependencies to array

## 12.0.0-next-7.5

### Patch Changes

- 10dd81f: feat: complete overhaul of web user interface

## 12.0.0-next-7.4

### Patch Changes

- 6e764e3: feat: add support for npm owner
- de6ff5c: fix: update fields for abbreviated manifest
- 117eb1c: fix: change bundleDependencies to array

## 12.0.0-next-7.3

### Minor Changes

- bd8703e: feat: add migrateToSecureLegacySignature and remove enhancedLegacySignature property

## 12.0.0-next.2

### Minor Changes

- f047cc8: refactor: auth with legacy sign support

## 12.0.0-next.1

### Major Changes

- e7ebccb61: update major dependencies, remove old nodejs support

## 12.0.0-next.0

### Major Changes

- feat!: bump to v7

## 11.0.0

### Major Changes

- 292c0a37f: feat!: replace deprecated request dependency by got

  This is a big refactoring of the core, fetching dependencies, improve code, more tests and better stability. This is essential for the next release, will take some time but would allow modularize more the core.

  ## Notes

  - Remove deprecated `request` by other `got`, retry improved, custom Agent ( got does not include it built-in)
  - Remove `async` dependency from storage (used by core) it was linked with proxy somehow safe to remove now
  - Refactor with promises instead callback wherever is possible
  - ~Document the API~
  - Improve testing, integration tests
  - Bugfix
  - Clean up old validations
  - Improve performance

  ## 💥 Breaking changes

  - Plugin API methods were callbacks based are returning promises, this will break current storage plugins, check documentation for upgrade.
  - Write Tarball, Read Tarball methods parameters change, a new set of options like `AbortController` signals are being provided to the `addAbortSignal` can be internally used with Streams when a request is aborted. eg: `addAbortSignal(signal, fs.createReadStream(pathName));`
  - `@verdaccio/streams` stream abort support is legacy is being deprecated removed
  - Remove AWS and Google Cloud packages for future refactoring [#2574](https://github.com/verdaccio/verdaccio/pull/2574).

- a3a209b5e: feat: migrate to pino.js 8
- 459b6fa72: refactor: search v1 endpoint and local-database

  - refactor search `api v1` endpoint, improve performance
  - remove usage of `async` dependency https://github.com/verdaccio/verdaccio/issues/1225
  - refactor method storage class
  - create new module `core` to reduce the ammount of modules with utilities
  - use `undici` instead `node-fetch`
  - use `fastify` instead `express` for functional test

  ### Breaking changes

  - plugin storage API changes
  - remove old search endpoint (return 404)
  - filter local private packages at plugin level

  The storage api changes for methods `get`, `add`, `remove` as promise base. The `search` methods also changes and recieves a `query` object that contains all query params from the client.

  ```ts
  export interface IPluginStorage<T> extends IPlugin {
    add(name: string): Promise<void>;
    remove(name: string): Promise<void>;
    get(): Promise<any>;
    init(): Promise<void>;
    getSecret(): Promise<string>;
    setSecret(secret: string): Promise<any>;
    getPackageStorage(packageInfo: string): IPackageStorage;
    search(query: searchUtils.SearchQuery): Promise<searchUtils.SearchItem[]>;
    saveToken(token: Token): Promise<any>;
    deleteToken(user: string, tokenKey: string): Promise<any>;
    readTokens(filter: TokenFilter): Promise<Token[]>;
  }
  ```

- 9fc2e7961: feat(plugins): improve plugin loader

  ### Changes

  - Add scope plugin support to 6.x https://github.com/verdaccio/verdaccio/pull/3227
  - Avoid config collisions https://github.com/verdaccio/verdaccio/issues/928
  - https://github.com/verdaccio/verdaccio/issues/1394
  - `config.plugins` plugin path validations
  - Updated algorithm for plugin loader.
  - improved documentation (included dev)

  ## Features

  - Add scope plugin support to 6.x https://github.com/verdaccio/verdaccio/pull/3227
  - Custom prefix:

  ```
  // config.yaml
  server:
    pluginPrefix: mycompany
  middleware:
    audit:
        foo: 1
  ```

  This configuration will look up for `mycompany-audit` instead `Verdaccio-audit`.

  ## Breaking Changes

  ### sinopia plugins

  - `sinopia` fallback support is removed, but can be restored using `pluginPrefix`

  ### plugin filter

  - method rename `filter_metadata`->`filterMetadata`

  ### Plugin constructor does not merge configs anymore https://github.com/verdaccio/verdaccio/issues/928

  The plugin receives as first argument `config`, which represents the config of the plugin. Example:

  ```
  // config.yaml
  auth:
    plugin:
       foo: 1
       bar: 2

  export class Plugin<T> {
    public constructor(config: T, options: PluginOptions) {
      console.log(config);
      // {foo:1, bar: 2}
   }
  }
  ```

- 794af76c5: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

- 10aeb4f13: feat!: experiments config renamed to flags

  - The `experiments` configuration is renamed to `flags`. The functionality is exactly the same.

  ```js
  flags: token: false;
  search: false;
  ```

  - The `self_path` property from the config file is being removed in favor of `config_file` full path.
  - Refactor `config` module, better types and utilities

- e367c3f1e: - Replace signature handler for legacy tokens by removing deprecated crypto.createDecipher by createCipheriv

  - Introduce environment variables for legacy tokens

  ### Code Improvements

  - Add debug library for improve developer experience

  ### Breaking change

  - The new signature invalidates all previous tokens generated by Verdaccio 4 or previous versions.
  - The secret key must have 32 characters long.

  ### New environment variables

  - `VERDACCIO_LEGACY_ALGORITHM`: Allows to define the specific algorithm for the token signature which by default is `aes-256-ctr`
  - `VERDACCIO_LEGACY_ENCRYPTION_KEY`: By default, the token stores in the database, but using this variable allows to get it from memory

- 999787974: feat(web): components for custom user interfaces

  Provides a package that includes all components from the user interface, instead being embedded at the `@verdaccio/ui-theme` package.

  ```
  npm i -D @verdaccio/ui-components
  ```

  The package contains

  - Components
  - Providers
  - Redux Storage
  - Layouts (precomposed layouts ready to use)
  - Custom Material Theme

  The `@verdaccio/ui-theme` will consume this package and will use only those are need it.

  > Prerequisites are using Redux, Material-UI and Translations with `i18next`.

  Users could have their own Material UI theme and build custom layouts, adding new features without the need to modify the default project.

- 82cb0f2bf: feat!: config.logs throw an error, logging config not longer accept array or logs property

  ### 💥 Breaking change

  This is valid

  ```yaml
  log: { type: stdout, format: pretty, level: http }
  ```

  This is invalid

  ```yaml
  logs: { type: stdout, format: pretty, level: http }
  ```

  or

  ```yaml
  logs:
    - [{ type: stdout, format: pretty, level: http }]
  ```

- 000d43746: feat: upgrade to material ui 5
- 8f43bf17d: feat: node api new structure based on promise

  ```js
  import { runServer } from "@verdaccio/node-api";
  // or
  import { runServer } from "verdaccio";

  const app = await runServer(); // default configuration
  const app = await runServer("./config/config.yaml");
  const app = await runServer({ configuration });
  app.listen(4000, (event) => {
    // do something
  });
  ```

  ### Breaking Change

  If you are using the node-api, the new structure is Promise based and less arguments.

### Minor Changes

- 0da7031e7: allow disable login on ui and endpoints

  To be able disable the login, set `login: false`, anything else would enable login. This flag will disable access via UI and web endpoints.

  ```yml
  web:
    title: verdaccio
    login: false
  ```

- 974cd8c19: fix: startup messages improved and logs support on types
- ef88da3b4: feat: improve support for fs promises older nodejs
- 631abe1ac: feat: refactor logger
- b61f762d6: feat: add server rate limit protection to all request

  To modify custom values, use the server settings property.

  ```markdown
  server:

  ## https://www.npmjs.com/package/express-rate-limit#configuration-options

  rateLimit:
  windowMs: 1000
  max: 10000
  ```

  The values are intended to be high, if you want to improve security of your server consider
  using different values.

- d43894e8f: feat: rework web header for mobile, add new settings and raw manifest button

  ### New set of variables to hide features

  Add set of new variables that allow hide different parts of the UI, buttons, footer or download tarballs. _All are
  enabled by default_.

  ```yaml
  # login: true <-- already exist but worth the reminder
  # showInfo: true
  # showSettings: true
  # In combination with darkMode you can force specific theme
  # showThemeSwitch: true
  # showFooter: true
  # showSearch: true
  # showDownloadTarball: true
  ```

  > If you disable `showThemeSwitch` and force `darkMode: true` the local storage settings would be
  > ignored and force all themes to the one in the configuration file.

  Future could be extended to

  ### Raw button to display manifest package

  A new experimental feature (enabled by default), button named RAW to be able navigate on the package manifest directly on the ui, kudos to [react-json-view](https://www.npmjs.com/package/react-json-view) that allows an easy integration, not configurable yet until get more feedback.

  ```yaml
  showRaw: true
  ```

  #### Rework header buttons

  - The header has been rework, the mobile was not looking broken.
  - Removed info button in the header and moved to a dialog
  - Info dialog now contains more information about the project, license and the aid content for Ukrania now is inside of the info modal.
  - Separate settings and info to avoid collapse too much info (for mobile still need some work)

- 154b2ecd3: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications
- aa763baec: feat: add typescript project references settings

  Reading https://ebaytech.berlin/optimizing-multi-package-apps-with-typescript-project-references-d5c57a3b4440 I realized I can use project references to solve the issue to pre-compile modules on develop mode.

  It allows to navigate (IDE) trough the packages without need compile the packages.

  Add two `tsconfig`, one using the previous existing configuration that is able to produce declaration files (`tsconfig.build`) and a new one `tsconfig` which is enables [_projects references_](https://www.typescriptlang.org/docs/handbook/project-references.html).

- 16e38df8a: feat: trustProxy property
- dc571aabd: feat: add forceEnhancedLegacySignature
- 62c24b632: feat: add passwordValidationRegex property
- 5167bb528: feat: ui search support for remote, local and private packages

  The command `npm search` search globally and return all matches, with this improvement the user interface
  is powered with the same capabilities.

  The UI also tag where is the origin the package with a tag, also provide the latest version and description of the package.

- 5cf041a1a: feat: add dist.signatures to core/types

  According to [`npm`](https://docs.npmjs.com/about-registry-signatures): _"Signatures are provided in the package's `packument` in each published version within the `dist` object"_

  Here's an [example of a package version from the public npm registry with `dist.signatures`](https://registry.npmjs.org/light-cycle/1.4.3).

- 37274e4c8: feat: implement abbreviated manifest

  Enable abbreviated manifest data by adding the header:

  ```
  curl -H "Accept: application/vnd.npm.install-v1+json" https://registry.npmjs.org/verdaccio
  ```

  It returns a filtered manifest, additionally includes the [time](https://github.com/pnpm/rfcs/pull/2) field by request.

  Current support for packages managers:

  - npm: yes
  - pnpm: yes
  - yarn classic: yes
  - yarn modern (+2.x): [no](https://github.com/yarnpkg/berry/pull/3981#issuecomment-1076566096)

  https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-metadata-format

- 45c03819e: refactor: render html middleware
- aecbd226d: web: allow ui hide package managers on sidebar

  If there is a package manager of preference over others, you can define the package managers to be displayed on the detail page and sidebar, just define in the `config.yaml` and web section the list of package managers to be displayed.

  ```
  web:
    title: Verdaccio
    sort_packages: asc
    primary_color: #cccccc
    pkgManagers:
      - pnpm
      - yarn
      # - npm
  ```

  To disable all package managers, just define empty:

  ```
  web:
    title: Verdaccio
    sort_packages: asc
    primary_color: #cccccc
    pkgManagers:
  ```

  and the section would be hidden.

### Patch Changes

- 351aeeaa8: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- 7ef599cc4: fix: missing version on footer
- 19d272d10: fix: restore logger on init

  Enable logger after parse configuration and log the very first step on startup phase.

  ```bash
   warn --- experiments are enabled, it is recommended do not use experiments in production comment out this section to disable it
   info --- support for experiment [token]  is disabled
   info --- support for experiment [search]  is disabled
  (node:50831) Warning: config.logs is deprecated, rename configuration to "config.log"
  (Use `node --trace-warnings ...` to show where the warning was created)
   info --- http address http://localhost:4873/
   info --- version: 6.0.0-6-next.11
   info --- server started
  ```

- a610ef26b: chore: add release step to private regisry on merge changeset pr
- 4fc21146a: fix: missing logo on header
- 34f0f1101: Enable prerelease mode with **changesets**
- 68ea21214: ESLint Warnings Fixed

  Related to issue #1461

  - max-len: most of the sensible max-len errors are fixed
  - no-unused-vars: most of these types of errors are fixed by deleting not needed declarations
  - @typescript-eslint/no-unused-vars: same as above

- b849128de: fix: handle upload scoped tarball

## 11.0.0-6-next.25

### Minor Changes

- 16e38df8: feat: trustProxy property

## 11.0.0-6-next.24

### Patch Changes

- 7ef599cc: fix: missing version on footer

## 11.0.0-6-next.23

### Minor Changes

- 974cd8c1: fix: startup messages improved and logs support on types

## 11.0.0-6-next.22

### Minor Changes

- dc571aab: feat: add forceEnhancedLegacySignature

## 11.0.0-6-next.21

### Patch Changes

- 4fc21146: fix: missing logo on header

## 11.0.0-6-next.20

### Minor Changes

- 45c03819: refactor: render html middleware

## 11.0.0-6-next.19

### Minor Changes

- ef88da3b: feat: improve support for fs promises older nodejs

## 11.0.0-6-next.18

### Major Changes

- 99978797: feat(web): components for custom user interfaces

  Provides a package that includes all components from the user interface, instead being embedded at the `@verdaccio/ui-theme` package.

  ```
  npm i -D @verdaccio/ui-components
  ```

  The package contains

  - Components
  - Providers
  - Redux Storage
  - Layouts (precomposed layouts ready to use)
  - Custom Material Theme

  The `@verdaccio/ui-theme` will consume this package and will use only those are need it.

  > Prerequisites are using Redux, Material-UI and Translations with `i18next`.

  Users could have their own Material UI theme and build custom layouts, adding new features without the need to modify the default project.

## 11.0.0-6-next.17

### Major Changes

- 9fc2e796: feat(plugins): improve plugin loader

  ### Changes

  - Add scope plugin support to 6.x https://github.com/verdaccio/verdaccio/pull/3227
  - Avoid config collisions https://github.com/verdaccio/verdaccio/issues/928
  - https://github.com/verdaccio/verdaccio/issues/1394
  - `config.plugins` plugin path validations
  - Updated algorithm for plugin loader.
  - improved documentation (included dev)

  ## Features

  - Add scope plugin support to 6.x https://github.com/verdaccio/verdaccio/pull/3227
  - Custom prefix:

  ```
  // config.yaml
  server:
    pluginPrefix: mycompany
  middleware:
    audit:
        foo: 1
  ```

  This configuration will look up for `mycompany-audit` instead `Verdaccio-audit`.

  ## Breaking Changes

  ### sinopia plugins

  - `sinopia` fallback support is removed, but can be restored using `pluginPrefix`

  ### plugin filter

  - method rename `filter_metadata`->`filterMetadata`

  ### Plugin constructor does not merge configs anymore https://github.com/verdaccio/verdaccio/issues/928

  The plugin receives as first argument `config`, which represents the config of the plugin. Example:

  ```
  // config.yaml
  auth:
    plugin:
       foo: 1
       bar: 2

  export class Plugin<T> {
    public constructor(config: T, options: PluginOptions) {
      console.log(config);
      // {foo:1, bar: 2}
   }
  }
  ```

### Minor Changes

- 62c24b63: feat: add passwordValidationRegex property

## 11.0.0-6-next.16

### Patch Changes

- b849128d: fix: handle upload scoped tarball

## 11.0.0-6-next.15

### Patch Changes

- 351aeeaa: fix(deps): @verdaccio/utils should be a prod dep of local-storage

## 11.0.0-6-next.14

### Minor Changes

- 37274e4c: feat: implement abbreviated manifest

  Enable abbreviated manifest data by adding the header:

  ```
  curl -H "Accept: application/vnd.npm.install-v1+json" https://registry.npmjs.org/verdaccio
  ```

  It returns a filtered manifest, additionally includes the [time](https://github.com/pnpm/rfcs/pull/2) field by request.

  Current support for packages managers:

  - npm: yes
  - pnpm: yes
  - yarn classic: yes
  - yarn modern (+2.x): [no](https://github.com/yarnpkg/berry/pull/3981#issuecomment-1076566096)

  https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-metadata-format

## 11.0.0-6-next.13

### Major Changes

- 292c0a37: feat!: replace deprecated request dependency by got

  This is a big refactoring of the core, fetching dependencies, improve code, more tests and better stability. This is essential for the next release, will take some time but would allow modularize more the core.

  ## Notes

  - Remove deprecated `request` by other `got`, retry improved, custom Agent ( got does not include it built-in)
  - Remove `async` dependency from storage (used by core) it was linked with proxy somehow safe to remove now
  - Refactor with promises instead callback wherever is possible
  - ~Document the API~
  - Improve testing, integration tests
  - Bugfix
  - Clean up old validations
  - Improve performance

  ## 💥 Breaking changes

  - Plugin API methods were callbacks based are returning promises, this will break current storage plugins, check documentation for upgrade.
  - Write Tarball, Read Tarball methods parameters change, a new set of options like `AbortController` signals are being provided to the `addAbortSignal` can be internally used with Streams when a request is aborted. eg: `addAbortSignal(signal, fs.createReadStream(pathName));`
  - `@verdaccio/streams` stream abort support is legacy is being deprecated removed
  - Remove AWS and Google Cloud packages for future refactoring [#2574](https://github.com/verdaccio/verdaccio/pull/2574).

- a3a209b5: feat: migrate to pino.js 8

### Minor Changes

- 5cf041a1: feat: add dist.signatures to core/types

  According to [`npm`](https://docs.npmjs.com/about-registry-signatures): _"Signatures are provided in the package's `packument` in each published version within the `dist` object"_

  Here's an [example of a package version from the public npm registry with `dist.signatures`](https://registry.npmjs.org/light-cycle/1.4.3).

## 11.0.0-6-next.12

### Minor Changes

- d43894e8: feat: rework web header for mobile, add new settings and raw manifest button

  ### New set of variables to hide features

  Add set of new variables that allow hide different parts of the UI, buttons, footer or download tarballs. _All are
  enabled by default_.

  ```yaml
  # login: true <-- already exist but worth the reminder
  # showInfo: true
  # showSettings: true
  # In combination with darkMode you can force specific theme
  # showThemeSwitch: true
  # showFooter: true
  # showSearch: true
  # showDownloadTarball: true
  ```

  > If you disable `showThemeSwitch` and force `darkMode: true` the local storage settings would be
  > ignored and force all themes to the one in the configuration file.

  Future could be extended to

  ### Raw button to display manifest package

  A new experimental feature (enabled by default), button named RAW to be able navigate on the package manifest directly on the ui, kudos to [react-json-view](https://www.npmjs.com/package/react-json-view) that allows an easy integration, not configurable yet until get more feedback.

  ```yaml
  showRaw: true
  ```

  #### Rework header buttons

  - The header has been rework, the mobile was not looking broken.
  - Removed info button in the header and moved to a dialog
  - Info dialog now contains more information about the project, license and the aid content for Ukrania now is inside of the info modal.
  - Separate settings and info to avoid collapse too much info (for mobile still need some work)

## 11.0.0-6-next.11

### Major Changes

- 82cb0f2b: feat!: config.logs throw an error, logging config not longer accept array or logs property

  ### 💥 Breaking change

  This is valid

  ```yaml
  log: { type: stdout, format: pretty, level: http }
  ```

  This is invalid

  ```yaml
  logs: { type: stdout, format: pretty, level: http }
  ```

  or

  ```yaml
  logs:
    - [{ type: stdout, format: pretty, level: http }]
  ```

### Minor Changes

- 5167bb52: feat: ui search support for remote, local and private packages

  The command `npm search` search globally and return all matches, with this improvement the user interface
  is powered with the same capabilities.

  The UI also tag where is the origin the package with a tag, also provide the latest version and description of the package.

## 11.0.0-6-next.10

### Major Changes

- 000d4374: feat: upgrade to material ui 5

## 11.0.0-6-next.9

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

## 11.0.0-6-next.8

### Major Changes

- 459b6fa7: refactor: search v1 endpoint and local-database

  - refactor search `api v1` endpoint, improve performance
  - remove usage of `async` dependency https://github.com/verdaccio/verdaccio/issues/1225
  - refactor method storage class
  - create new module `core` to reduce the ammount of modules with utilities
  - use `undici` instead `node-fetch`
  - use `fastify` instead `express` for functional test

  ### Breaking changes

  - plugin storage API changes
  - remove old search endpoint (return 404)
  - filter local private packages at plugin level

  The storage api changes for methods `get`, `add`, `remove` as promise base. The `search` methods also changes and recieves a `query` object that contains all query params from the client.

  ```ts
  export interface IPluginStorage<T> extends IPlugin {
    add(name: string): Promise<void>;
    remove(name: string): Promise<void>;
    get(): Promise<any>;
    init(): Promise<void>;
    getSecret(): Promise<string>;
    setSecret(secret: string): Promise<any>;
    getPackageStorage(packageInfo: string): IPackageStorage;
    search(query: searchUtils.SearchQuery): Promise<searchUtils.SearchItem[]>;
    saveToken(token: Token): Promise<any>;
    deleteToken(user: string, tokenKey: string): Promise<any>;
    readTokens(filter: TokenFilter): Promise<Token[]>;
  }
  ```

## 11.0.0-6-next.7

### Minor Changes

- 0da7031e: allow disable login on ui and endpoints

  To be able disable the login, set `login: false`, anything else would enable login. This flag will disable access via UI and web endpoints.

  ```yml
  web:
    title: verdaccio
    login: false
  ```

## 11.0.0-6-next.6

### Minor Changes

- aecbd226: web: allow ui hide package managers on sidebar

  If there is a package manager of preference over others, you can define the package managers to be displayed on the detail page and sidebar, just define in the `config.yaml` and web section the list of package managers to be displayed.

  ```
  web:
    title: Verdaccio
    sort_packages: asc
    primary_color: #cccccc
    pkgManagers:
      - pnpm
      - yarn
      # - npm
  ```

  To disable all package managers, just define empty:

  ```
  web:
    title: Verdaccio
    sort_packages: asc
    primary_color: #cccccc
    pkgManagers:
  ```

  and the section would be hidden.

## 11.0.0-6-next.5

### Patch Changes

- 19d272d1: fix: restore logger on init

  Enable logger after parse configuration and log the very first step on startup phase.

  ```bash
   warn --- experiments are enabled, it is recommended do not use experiments in production comment out this section to disable it
   info --- support for experiment [token]  is disabled
   info --- support for experiment [search]  is disabled
  (node:50831) Warning: config.logs is deprecated, rename configuration to "config.log"
  (Use `node --trace-warnings ...` to show where the warning was created)
   info --- http address http://localhost:4873/
   info --- version: 6.0.0-6-next.11
   info --- server started
  ```

## 11.0.0-6-next.4

### Major Changes

- 5c5057fc: feat: node api new structure based on promise

  ```js
  import { runServer } from "@verdaccio/node-api";
  // or
  import { runServer } from "verdaccio";

  const app = await runServer(); // default configuration
  const app = await runServer("./config/config.yaml");
  const app = await runServer({ configuration });
  app.listen(4000, (event) => {
    // do something
  });
  ```

  ### Breaking Change

  If you are using the node-api, the new structure is Promise based and less arguments.

## 10.0.0-alpha.3

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr

## 10.0.0-alpha.2

### Minor Changes

- 54c58d1e: feat: add server rate limit protection to all request

  To modify custom values, use the server settings property.

  ```markdown
  server:

  ## https://www.npmjs.com/package/express-rate-limit#configuration-options

  rateLimit:
  windowMs: 1000
  max: 10000
  ```

  The values are intended to be high, if you want to improve security of your server consider
  using different values.

## 10.0.0-alpha.1

### Major Changes

- d87fa026: feat!: experiments config renamed to flags

  - The `experiments` configuration is renamed to `flags`. The functionality is exactly the same.

  ```js
  flags: token: false;
  search: false;
  ```

  - The `self_path` property from the config file is being removed in favor of `config_file` full path.
  - Refactor `config` module, better types and utilities

- da1ee9c8: - Replace signature handler for legacy tokens by removing deprecated crypto.createDecipher by createCipheriv

  - Introduce environment variables for legacy tokens

  ### Code Improvements

  - Add debug library for improve developer experience

  ### Breaking change

  - The new signature invalidates all previous tokens generated by Verdaccio 4 or previous versions.
  - The secret key must have 32 characters long.

  ### New environment variables

  - `VERDACCIO_LEGACY_ALGORITHM`: Allows to define the specific algorithm for the token signature which by default is `aes-256-ctr`
  - `VERDACCIO_LEGACY_ENCRYPTION_KEY`: By default, the token stores in the database, but using this variable allows to get it from memory

### Minor Changes

- 26b494cb: feat: add typescript project references settings

  Reading https://ebaytech.berlin/optimizing-multi-package-apps-with-typescript-project-references-d5c57a3b4440 I realized I can use project references to solve the issue to pre-compile modules on develop mode.

  It allows to navigate (IDE) trough the packages without need compile the packages.

  Add two `tsconfig`, one using the previous existing configuration that is able to produce declaration files (`tsconfig.build`) and a new one `tsconfig` which is enables [_projects references_](https://www.typescriptlang.org/docs/handbook/project-references.html).

### Patch Changes

- b57b4338: Enable prerelease mode with **changesets**
- 31af0164: ESLint Warnings Fixed

  Related to issue #1461

  - max-len: most of the sensible max-len errors are fixed
  - no-unused-vars: most of these types of errors are fixed by deleting not needed declarations
  - @typescript-eslint/no-unused-vars: same as above

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [9.7.2](https://github.com/verdaccio/monorepo/compare/v9.7.1...v9.7.2) (2020-07-20)

### Bug Fixes

- incorrect AuthAccessCallback and AuthCallback ([#374](https://github.com/verdaccio/monorepo/issues/374)) ([97538f8](https://github.com/verdaccio/monorepo/commit/97538f886271ccdbea7862957f65c4a17c4cd831)), closes [/github.com/verdaccio/verdaccio/blob/master/src/lib/auth.ts#L264](https://github.com//github.com/verdaccio/verdaccio/blob/master/src/lib/auth.ts/issues/L264) [/github.com/verdaccio/verdaccio/blob/master/src/lib/auth.ts#L114](https://github.com//github.com/verdaccio/verdaccio/blob/master/src/lib/auth.ts/issues/L114)

# [9.7.0](https://github.com/verdaccio/monorepo/compare/v9.6.1...v9.7.0) (2020-06-24)

### Features

- types for https config ([#368](https://github.com/verdaccio/monorepo/issues/368)) ([aa4aa83](https://github.com/verdaccio/monorepo/commit/aa4aa83e8a2f6a29ebe7c0b43ccc560a37fe2da9))

# [9.5.0](https://github.com/verdaccio/monorepo/compare/v9.4.1...v9.5.0) (2020-05-02)

### Features

- **types:** custom favicon ([#356](https://github.com/verdaccio/monorepo/issues/356)) ([bd78861](https://github.com/verdaccio/monorepo/commit/bd78861f46cd5189808b6689d2018a7bac6755f7))

# [9.3.0](https://github.com/verdaccio/monorepo/compare/v9.2.0...v9.3.0) (2020-01-29)

### Features

- **types:** adding tag type for auth plugins ([#318](https://github.com/verdaccio/monorepo/issues/318)) ([7f07c94](https://github.com/verdaccio/monorepo/commit/7f07c94d9dba5ac45b35aef3bd1ffd3080fb35db))

# [9.0.0](https://github.com/verdaccio/monorepo/compare/v8.5.3...v9.0.0) (2020-01-07)

**Note:** Version bump only for package @verdaccio/types

## [8.5.2](https://github.com/verdaccio/monorepo/compare/v8.5.1...v8.5.2) (2019-12-25)

### Bug Fixes

- add types for storage handler ([#307](https://github.com/verdaccio/monorepo/issues/307)) ([c35746e](https://github.com/verdaccio/monorepo/commit/c35746ebba071900db172608dedff66a7d27c23d))

## [8.5.1](https://github.com/verdaccio/monorepo/compare/v8.5.0...v8.5.1) (2019-12-24)

### Bug Fixes

- add new types for local storage ([#306](https://github.com/verdaccio/monorepo/issues/306)) ([e715e24](https://github.com/verdaccio/monorepo/commit/e715e24ec7b7e7b3dca31a3321714ebccadf2a8d))

# [8.5.0](https://github.com/verdaccio/monorepo/compare/v8.4.2...v8.5.0) (2019-12-22)

### Bug Fixes

- **types:** add allow_unpublish generic ([#305](https://github.com/verdaccio/monorepo/issues/305)) ([aeaf64c](https://github.com/verdaccio/monorepo/commit/aeaf64c67cafb9ec16fa5a66aad9c4912f2a3710))

## [8.4.2](https://github.com/verdaccio/monorepo/compare/v8.4.1...v8.4.2) (2019-11-23)

**Note:** Version bump only for package @verdaccio/types

## [8.4.1](https://github.com/verdaccio/monorepo/compare/v8.4.0...v8.4.1) (2019-11-22)

**Note:** Version bump only for package @verdaccio/types

# [8.4.0](https://github.com/verdaccio/monorepo/compare/v8.3.0...v8.4.0) (2019-11-22)

### Bug Fixes

- adds sort_packages in WebConf Interface ([#227](https://github.com/verdaccio/monorepo/issues/227)) ([5b60ade](https://github.com/verdaccio/monorepo/commit/5b60adef5da49d7d1b62aa9f484b27c9fa319bdd))

# [8.3.0](https://github.com/verdaccio/monorepo/compare/v8.2.0...v8.3.0) (2019-10-27)

### Features

- improve auth callback TS types ([#225](https://github.com/verdaccio/monorepo/issues/225)) ([ee442a0](https://github.com/verdaccio/monorepo/commit/ee442a0))

# [8.1.0](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.1...v8.1.0) (2019-09-07)

**Note:** Version bump only for package @verdaccio/types

## [8.0.1-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.0...v8.0.1-next.1) (2019-08-29)

**Note:** Version bump only for package @verdaccio/types

## [8.0.1-next.0](https://github.com/verdaccio/monorepo/compare/v8.0.0...v8.0.1-next.0) (2019-08-29)

**Note:** Version bump only for package @verdaccio/types

# [8.0.0](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.4...v8.0.0) (2019-08-22)

**Note:** Version bump only for package @verdaccio/types

# [8.0.0-next.4](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.3...v8.0.0-next.4) (2019-08-18)

**Note:** Version bump only for package @verdaccio/types

# [8.0.0-next.2](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.1...v8.0.0-next.2) (2019-08-03)

### Bug Fixes

- update types for tokens ([9734fa8](https://github.com/verdaccio/monorepo/commit/9734fa8))

# [8.0.0-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.0...v8.0.0-next.1) (2019-08-01)

**Note:** Version bump only for package @verdaccio/types

# [8.0.0-next.0](https://github.com/verdaccio/monorepo/compare/v2.0.0...v8.0.0-next.0) (2019-08-01)

### Bug Fixes

- add \_autogenerated to UpLinkConf ([436bd91](https://github.com/verdaccio/monorepo/commit/436bd91))
- add config prop to IBasicAuth ([2481d6f](https://github.com/verdaccio/monorepo/commit/2481d6f))
- add missing adduser method ([22cdb4e](https://github.com/verdaccio/monorepo/commit/22cdb4e))
- add missing properties ([973c5e4](https://github.com/verdaccio/monorepo/commit/973c5e4))
- allow extend config ([0aea94f](https://github.com/verdaccio/monorepo/commit/0aea94f))
- allow sub types on allow auth methods ([7325f74](https://github.com/verdaccio/monorepo/commit/7325f74))
- deprecated methods are optional ([b77155a](https://github.com/verdaccio/monorepo/commit/b77155a))
- entry point [#14](https://github.com/verdaccio/monorepo/issues/14) ([7575e75](https://github.com/verdaccio/monorepo/commit/7575e75))
- export Author type ([bf7115b](https://github.com/verdaccio/monorepo/commit/bf7115b))
- fix/token i local package manager ([#61](https://github.com/verdaccio/monorepo/issues/61)) ([a7e0fc8](https://github.com/verdaccio/monorepo/commit/a7e0fc8))
- fixes for storage plugin types per code review ([#59](https://github.com/verdaccio/monorepo/issues/59)) ([04fccb8](https://github.com/verdaccio/monorepo/commit/04fccb8))
- getPackageStorage allowed to return undefined ([8a859d0](https://github.com/verdaccio/monorepo/commit/8a859d0))
- improvements config interface ([1dac321](https://github.com/verdaccio/monorepo/commit/1dac321))
- methods return Stream ([22e0672](https://github.com/verdaccio/monorepo/commit/22e0672))
- remove options from get package metadata ([2bfc048](https://github.com/verdaccio/monorepo/commit/2bfc048))
- remove wrong definition ([acba624](https://github.com/verdaccio/monorepo/commit/acba624))
- remove wrong imports ([c82f51c](https://github.com/verdaccio/monorepo/commit/c82f51c))
- restore missing type on RemoteUser ([b596896](https://github.com/verdaccio/monorepo/commit/b596896))
- storage types ([1285675](https://github.com/verdaccio/monorepo/commit/1285675))
- tokens are accesible also in local-storage ([08b342d](https://github.com/verdaccio/monorepo/commit/08b342d))
- update https ([c93c3fc](https://github.com/verdaccio/monorepo/commit/c93c3fc))
- update readTarball with right parameters ([8cbc7d1](https://github.com/verdaccio/monorepo/commit/8cbc7d1))
- update streams type ([7fa7be5](https://github.com/verdaccio/monorepo/commit/7fa7be5))
- update types for local data ([6706770](https://github.com/verdaccio/monorepo/commit/6706770))
- update utils types ([7c37133](https://github.com/verdaccio/monorepo/commit/7c37133))
- wrong signature for auth plugin ([e3e2508](https://github.com/verdaccio/monorepo/commit/e3e2508))

### Features

- add AuthPluginPackage type ([f0e1cea](https://github.com/verdaccio/monorepo/commit/f0e1cea))
- add callback to database methods ([d0d55e9](https://github.com/verdaccio/monorepo/commit/d0d55e9))
- add config file types ([188a3e5](https://github.com/verdaccio/monorepo/commit/188a3e5))
- add gravatar prop for web config ([b3ac873](https://github.com/verdaccio/monorepo/commit/b3ac873))
- add interface for middleware and storage plugin ([2b18e22](https://github.com/verdaccio/monorepo/commit/2b18e22))
- add IStorageManager for middleware plugin ([0ac1cc4](https://github.com/verdaccio/monorepo/commit/0ac1cc4))
- Add locking library on typings ([7f7ab67](https://github.com/verdaccio/monorepo/commit/7f7ab67))
- add RemoteUser type ([7d11892](https://github.com/verdaccio/monorepo/commit/7d11892))
- add search method BREAKING CHANGE: search method must be implemented to allow search functionality ([b6d94e6](https://github.com/verdaccio/monorepo/commit/b6d94e6))
- add secret gateway methods ([5300147](https://github.com/verdaccio/monorepo/commit/5300147))
- add Security configuration ([0cdc0dd](https://github.com/verdaccio/monorepo/commit/0cdc0dd))
- add types for auth plugin ([6378186](https://github.com/verdaccio/monorepo/commit/6378186))
- add types for PackageUsers ([ad5f917](https://github.com/verdaccio/monorepo/commit/ad5f917))
- add types for search class ([e23782d](https://github.com/verdaccio/monorepo/commit/e23782d))
- callback does not return ([fd78bfc](https://github.com/verdaccio/monorepo/commit/fd78bfc))
- merge changes from 5.x ([5f61009](https://github.com/verdaccio/monorepo/commit/5f61009))
- package access props are not optional ([61708e2](https://github.com/verdaccio/monorepo/commit/61708e2))
- remove flow [#70](https://github.com/verdaccio/monorepo/issues/70) ([2218b74](https://github.com/verdaccio/monorepo/commit/2218b74))
- remove sync method ([f60f81c](https://github.com/verdaccio/monorepo/commit/f60f81c))
- secret methods are async ([d5eacf5](https://github.com/verdaccio/monorepo/commit/d5eacf5))
- support for an IPluginStorageFilter ([#58](https://github.com/verdaccio/monorepo/issues/58)) ([eab219e](https://github.com/verdaccio/monorepo/commit/eab219e))
- token types ([#60](https://github.com/verdaccio/monorepo/issues/60)) @Eomm ([6e74da6](https://github.com/verdaccio/monorepo/commit/6e74da6))
- **auth:** add method to update password ([e257c3a](https://github.com/verdaccio/monorepo/commit/e257c3a))
- **storage:** path is not mandatory ([2c42931](https://github.com/verdaccio/monorepo/commit/2c42931))

### BREAKING CHANGES

- remove flow definitions
- storage needs to add new methods

- add: token types

- add: typescripts types
- **auth:** it will affect all auth plugins

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [7.0.0](https://github.com/verdaccio/flow-types/compare/v6.2.0...v7.0.0) (2019-07-25)

### Bug Fixes

- add \_autogenerated to UpLinkConf ([971e52e](https://github.com/verdaccio/flow-types/commit/971e52e))
- **IPluginAuth:** adduser, changePassword optional ([40d4e7a](https://github.com/verdaccio/flow-types/commit/40d4e7a)), closes [/github.com/verdaccio/verdaccio/blob/66f4197236d9d71af149314aae15102b336f45e1/src/lib/auth.ts#L67-L71](https://github.com/verdaccio/flow-types/issues/L67-L71) [/github.com/verdaccio/verdaccio/blob/66f4197236d9d71af149314aae15102b336f45e1/src/lib/auth.ts#L138-L166](https://github.com/verdaccio/flow-types/issues/L138-L166)
- **IPluginAuth:** remove `login_url` ([1663c07](https://github.com/verdaccio/flow-types/commit/1663c07)), closes [#69](https://github.com/verdaccio/flow-types/issues/69)

### Features

- merge changes from 5.x ([7d2d526](https://github.com/verdaccio/flow-types/commit/7d2d526))
- remove flow [#70](https://github.com/verdaccio/flow-types/issues/70) ([826d5fe](https://github.com/verdaccio/flow-types/commit/826d5fe))

### BREAKING CHANGES

- remove flow definitions

<a name="6.2.0"></a>

# [6.2.0](https://github.com/verdaccio/flow-types/compare/v6.1.0...v6.2.0) (2019-05-28)

### Features

- add types for Version ([900861d](https://github.com/verdaccio/flow-types/commit/900861d))

<a name="6.1.0"></a>

# [6.1.0](https://github.com/verdaccio/flow-types/compare/v6.0.2...v6.1.0) (2019-05-14)

### Bug Fixes

- revert token signature ([59a03e7](https://github.com/verdaccio/flow-types/commit/59a03e7))

### Features

- moved token api signature ([e51991c](https://github.com/verdaccio/flow-types/commit/e51991c))

<a name="6.0.2"></a>

## [6.0.2](https://github.com/verdaccio/flow-types/compare/v6.0.1...v6.0.2) (2019-05-06)

### Bug Fixes

- fix/token i local package manager ([#61](https://github.com/verdaccio/flow-types/issues/61)) ([14adfb2](https://github.com/verdaccio/flow-types/commit/14adfb2))

<a name="6.0.1"></a>

## [6.0.1](https://github.com/verdaccio/flow-types/compare/v6.0.0...v6.0.1) (2019-05-04)

### Bug Fixes

- tokens are accesible also in local-storage ([56551cf](https://github.com/verdaccio/flow-types/commit/56551cf))

<a name="6.0.0"></a>

# [6.0.0](https://github.com/verdaccio/flow-types/compare/v5.0.2...v6.0.0) (2019-04-30)

### Bug Fixes

- remove wrong imports ([a75476a](https://github.com/verdaccio/flow-types/commit/a75476a))

### Features

- token types ([#60](https://github.com/verdaccio/flow-types/issues/60)) @Eomm ([7b74982](https://github.com/verdaccio/flow-types/commit/7b74982))

### BREAKING CHANGES

- storage needs to add new methods

- add: token types

- add: typescripts types

<a name="5.0.2"></a>

## [5.0.2](https://github.com/verdaccio/flow-types/compare/v5.0.1...v5.0.2) (2019-04-22)

### Bug Fixes

- fixes for storage plugin types per code review ([#59](https://github.com/verdaccio/flow-types/issues/59)) ([c2ea90b](https://github.com/verdaccio/flow-types/commit/c2ea90b))

<a name="5.0.1"></a>

## [5.0.1](https://github.com/verdaccio/flow-types/compare/v5.0.0...v5.0.1) (2019-04-18)

<a name="5.0.0"></a>

# [5.0.0](https://github.com/verdaccio/flow-types/compare/v5.0.0-beta.4...v5.0.0) (2019-04-18)

### Features

- support for an IPluginStorageFilter ([#58](https://github.com/verdaccio/flow-types/issues/58)) ([e67559f](https://github.com/verdaccio/flow-types/commit/e67559f))

<a name="5.0.0-beta.4"></a>

# [5.0.0-beta.4](https://github.com/verdaccio/flow-types/compare/v5.0.0-beta.3...v5.0.0-beta.4) (2019-03-29)

### Features

- **storage:** path is not mandatory ([784f1bb](https://github.com/verdaccio/flow-types/commit/784f1bb))

<a name="5.0.0-beta.3"></a>

# [5.0.0-beta.3](https://github.com/verdaccio/flow-types/compare/v5.0.0-beta.2...v5.0.0-beta.3) (2019-03-09)

### Features

- add types for PackageUsers ([9bb3c26](https://github.com/verdaccio/flow-types/commit/9bb3c26))

<a name="5.0.0-beta.2"></a>

# [5.0.0-beta.2](https://github.com/verdaccio/flow-types/compare/v5.0.0-beta.1...v5.0.0-beta.2) (2019-02-03)

### Features

- allow_access and allow_publish are optional for auth plugin ([0d5a53c](https://github.com/verdaccio/flow-types/commit/0d5a53c))

<a name="5.0.0-beta.1"></a>

# [5.0.0-beta.1](https://github.com/verdaccio/flow-types/compare/v5.0.0-beta.0...v5.0.0-beta.1) (2019-02-01)

<a name="5.0.0-beta.0"></a>

# [5.0.0-beta.0](https://github.com/verdaccio/flow-types/compare/v4.3.0...v5.0.0-beta.0) (2019-01-27)

<a name="4.3.0"></a>

# [4.3.0](https://github.com/verdaccio/flow-types/compare/v4.2.0...v4.3.0) (2019-01-12)

### Features

- add gravatar prop for web config ([99ceae9](https://github.com/verdaccio/flow-types/commit/99ceae9))

<a name="4.2.0"></a>

# [4.2.0](https://github.com/verdaccio/flow-types/compare/v4.1.2...v4.2.0) (2019-01-12)

### Features

- add AuthPluginPackage type ([0e46b04](https://github.com/verdaccio/flow-types/commit/0e46b04))

<a name="4.1.2"></a>

## [4.1.2](https://github.com/verdaccio/flow-types/compare/v4.1.1...v4.1.2) (2018-11-11)

### Bug Fixes

- remove wrong definition ([9bc53fc](https://github.com/verdaccio/flow-types/commit/9bc53fc))

<a name="4.1.1"></a>

## [4.1.1](https://github.com/verdaccio/flow-types/compare/v4.1.0...v4.1.1) (2018-10-06)

### Bug Fixes

- deprecated methods are optional ([4c96e89](https://github.com/verdaccio/flow-types/commit/4c96e89))

<a name="4.1.0"></a>

# [4.1.0](https://github.com/verdaccio/flow-types/compare/v4.0.0...v4.1.0) (2018-10-06)

### Features

- package access props are not optional ([afabaf1](https://github.com/verdaccio/flow-types/commit/afabaf1))

<a name="4.0.0"></a>

# [4.0.0](https://github.com/verdaccio/flow-types/compare/v3.7.2...v4.0.0) (2018-09-30)

### Features

- **auth:** add method to update password ([21fc43f](https://github.com/verdaccio/flow-types/commit/21fc43f))

### BREAKING CHANGES

- **auth:** it will affect all auth plugins

<a name="3.7.2"></a>

## [3.7.2](https://github.com/verdaccio/flow-types/compare/v3.7.1...v3.7.2) (2018-09-27)

### Bug Fixes

- entry point [#14](https://github.com/verdaccio/flow-types/issues/14) ([f7b8982](https://github.com/verdaccio/flow-types/commit/f7b8982))
- export Author type ([7869dde](https://github.com/verdaccio/flow-types/commit/7869dde))

<a name="3.7.1"></a>

## [3.7.1](https://github.com/verdaccio/flow-types/compare/v3.7.0...v3.7.1) (2018-08-11)

### Bug Fixes

- restore missing type on RemoteUser ([88d809e](https://github.com/verdaccio/flow-types/commit/88d809e))

<a name="3.7.0"></a>

# [3.7.0](https://github.com/verdaccio/flow-types/compare/v3.6.0...v3.7.0) (2018-08-05)

### Features

- add Security configuration ([0d9aece](https://github.com/verdaccio/flow-types/commit/0d9aece))

<a name="3.6.0"></a>

# [3.6.0](https://github.com/verdaccio/flow-types/compare/v3.5.1...v3.6.0) (2018-07-30)

### Features

- changes max_users type to number ([1fa6e73](https://github.com/verdaccio/flow-types/commit/1fa6e73))

<a name="3.5.1"></a>

## [3.5.1](https://github.com/verdaccio/flow-types/compare/v3.5.0...v3.5.1) (2018-07-21)

### Bug Fixes

- login_url should be an optional property ([0fcfb9c](https://github.com/verdaccio/flow-types/commit/0fcfb9c))

<a name="3.5.0"></a>

# [3.5.0](https://github.com/verdaccio/flow-types/compare/v3.4.3...v3.5.0) (2018-07-21)

### Features

- add `login_url` to verdaccio\$IPluginAuth ([6e03209](https://github.com/verdaccio/flow-types/commit/6e03209)), closes [verdaccio/verdaccio#834](https://github.com/verdaccio/verdaccio/issues/834)

<a name="3.4.3"></a>

## [3.4.3](https://github.com/verdaccio/flow-types/compare/v3.4.2...v3.4.3) (2018-07-19)

### Bug Fixes

- allow extend config ([06e810f](https://github.com/verdaccio/flow-types/commit/06e810f))

<a name="3.4.2"></a>

## [3.4.2](https://github.com/verdaccio/flow-types/compare/v3.4.1...v3.4.2) (2018-07-17)

<a name="3.4.1"></a>

## [3.4.1](https://github.com/verdaccio/flow-types/compare/v3.4.0...v3.4.1) (2018-07-16)

### Bug Fixes

- allow sub types on allow auth methods ([fa8125b](https://github.com/verdaccio/flow-types/commit/fa8125b))

<a name="3.4.0"></a>

# [3.4.0](https://github.com/verdaccio/flow-types/compare/v3.3.3...v3.4.0) (2018-07-16)

### Features

- add RemoteUser type ([aa83839](https://github.com/verdaccio/flow-types/commit/aa83839))

<a name="3.3.3"></a>

## [3.3.3](https://github.com/verdaccio/flow-types/compare/v3.3.2...v3.3.3) (2018-07-16)

### Bug Fixes

- wrong signature for auth plugin ([11a0ce6](https://github.com/verdaccio/flow-types/commit/11a0ce6))

<a name="3.3.2"></a>

## [3.3.2](https://github.com/verdaccio/flow-types/compare/v3.3.1...v3.3.2) (2018-07-16)

### Bug Fixes

- add missing adduser method ([0b54fe7](https://github.com/verdaccio/flow-types/commit/0b54fe7))

<a name="3.3.1"></a>

## [3.3.1](https://github.com/verdaccio/flow-types/compare/v3.3.0...v3.3.1) (2018-07-15)

### Bug Fixes

- add config prop to IBasicAuth ([0714316](https://github.com/verdaccio/flow-types/commit/0714316))

<a name="3.3.0"></a>

# [3.3.0](https://github.com/verdaccio/flow-types/compare/v3.2.0...v3.3.0) (2018-07-15)

### Features

- add IStorageManager for middleware plugin ([d473b4c](https://github.com/verdaccio/flow-types/commit/d473b4c))

<a name="3.2.0"></a>

# [3.2.0](https://github.com/verdaccio/flow-types/compare/v3.1.0...v3.2.0) (2018-07-15)

### Features

- add interface for middleware and storage plugin ([0028085](https://github.com/verdaccio/flow-types/commit/0028085))

<a name="3.1.0"></a>

# [3.1.0](https://github.com/verdaccio/flow-types/compare/v3.0.1...v3.1.0) (2018-07-14)

### Features

- add types for auth plugin ([a9b7bc9](https://github.com/verdaccio/flow-types/commit/a9b7bc9))

<a name="3.0.1"></a>

## [3.0.1](https://github.com/verdaccio/flow-types/compare/v3.0.0...v3.0.1) (2018-07-02)

### Bug Fixes

- improvements config interface ([8ea6276](https://github.com/verdaccio/flow-types/commit/8ea6276))

<a name="3.0.0"></a>

# [3.0.0](https://github.com/verdaccio/flow-types/compare/v2.2.2...v3.0.0) (2018-06-08)

### Features

- add search method ([2cf3ce9](https://github.com/verdaccio/flow-types/commit/2cf3ce9))

### BREAKING CHANGES

- search method must be implemented to allow search functionality
