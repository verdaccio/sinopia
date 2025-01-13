# @verdaccio/core

## 8.0.0-next-8.8

## 8.0.0-next-8.7

### Patch Changes

- 589ea7f: chore: move tarball utils to core

## 8.0.0-next-8.6

## 8.0.0-next-8.5

### Patch Changes

- 64a7fc0: chore(core): typing, naming, and docs of parameters
- 5cbee6f: fix: unpublish a package on storage package
- a049bba: chore(tests): temp folder naming

## 8.0.0-next-8.4

### Patch Changes

- 48aa89f: chore: request header constants
- 58e0d95: fix(middleware): error 404 when getting scoped tarballs

## 8.0.0-next-8.3

## 8.0.0-next-8.2

### Minor Changes

- 6a8154c: feat: update logger pino to latest

## 8.0.0-next-8.1

## 8.0.0-next-8.0

### Major Changes

- chore: move v7 next to v8 next

## 7.0.0

### Major Changes

- 47f61c6: feat!: bump to v7
- e7ebccb: update major dependencies, remove old nodejs support

### Minor Changes

- daceb6d: restore legacy support
- f047cc8: refactor: auth with legacy sign support
- bd8703e: feat: add migrateToSecureLegacySignature and remove enhancedLegacySignature property

### Patch Changes

- 6e764e3: feat: add support for npm owner
- 7c9f3cf: chore: improve startup logging

## 7.0.0-next-8.21

### Patch Changes

- 7c9f3cf: chore: improve startup logging

## 7.0.0-next-7.20

## 7.0.0-next-7.19

## 7.0.0-next-7.18

## 7.0.0-next-7.17

### Patch Changes

- 6e764e3: feat: add support for npm owner

## 7.0.0-next-7.16

## 7.0.0-next-7.15

### Minor Changes

- bd8703e: feat: add migrateToSecureLegacySignature and remove enhancedLegacySignature property

## 7.0.0-next-7.14

## 7.0.0-next-7.13

## 7.0.0-next-7.12

## 7.0.0-next-7.11

## 7.0.0-next-7.10

## 7.0.0-next-7.9

## 7.0.0-next-7.8

## 7.0.0-next-7.7

## 7.0.0-next.6

## 7.0.0-next.5

### Minor Changes

- f047cc8: refactor: auth with legacy sign support

## 7.0.0-next.4

## 7.0.0-next.3

### Major Changes

- e7ebccb61: update major dependencies, remove old nodejs support

### Minor Changes

- daceb6d87: restore legacy support

## 7.0.0-next.2

## 7.0.0-next.1

## 7.0.0-next.0

### Major Changes

- feat!: bump to v7

## 6.0.0

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

- 794af76c5: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

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

### Minor Changes

- 974cd8c19: fix: startup messages improved and logs support on types
- ef88da3b4: feat: improve support for fs promises older nodejs
- 24b9be020: refactor: improve docker image build with strict dependencies and prod build
- 00d1d2a17: chore: env variable for launch fastify

  - Update fastify to major release `v4.3.0`
  - Update CLI launcher

  via CLI

  ```
  VERDACCIO_SERVER=fastify verdaccio
  ```

  with docker

  ```
  docker run -it --rm --name verdaccio \
    -e "VERDACCIO_SERVER=8080" -p 8080:8080 \
    -e "VERDACCIO_SERVER=fastify" \
    verdaccio/verdaccio
  ```

- 154b2ecd3: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications
- 16e38df8a: feat: trustProxy property
- dc571aabd: feat: add forceEnhancedLegacySignature
- 6c1eb021b: feat: use warning codes for deprecation warnings
- 62c24b632: feat: add passwordValidationRegex property
- 5167bb528: feat: ui search support for remote, local and private packages

  The command `npm search` search globally and return all matches, with this improvement the user interface
  is powered with the same capabilities.

  The UI also tag where is the origin the package with a tag, also provide the latest version and description of the package.

- c9d1af0e5: feat: async bcrypt hash
- 4b29d715b: chore: move improvements from v5 to v6

  Migrate improvements form v5 to v6:

  - https://github.com/verdaccio/verdaccio/pull/3158
  - https://github.com/verdaccio/verdaccio/pull/3151
  - https://github.com/verdaccio/verdaccio/pull/2271
  - https://github.com/verdaccio/verdaccio/pull/2787
  - https://github.com/verdaccio/verdaccio/pull/2791
  - https://github.com/verdaccio/verdaccio/pull/2205

### Patch Changes

- 43f32687c: fix: abbreviated headers handle quality values
- 351aeeaa8: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- 9718e0330: fix: build targets for 5x modules
- a1da11308: fix: minor typo on warning message
- 378e907d5: fix(core): fix `isObject` function.`isObject(true)` should return false.
- f859d2b1a: fix: official package "-" cannot be synced
- 0a6412ca9: refactor: got instead undici
- b849128de: fix: handle upload scoped tarball

## 6.0.0-6-next.76

## 6.0.0-6-next.75

### Patch Changes

- 0a6412ca9: refactor: got instead undici

## 6.0.0-6-next.74

## 6.0.0-6-next.73

### Patch Changes

- f859d2b1a: fix: official package "-" cannot be synced

## 6.0.0-6-next.72

## 6.0.0-6-next.71

## 6.0.0-6-next.70

## 6.0.0-6-next.69

### Minor Changes

- c9d1af0e: feat: async bcrypt hash

## 6.0.0-6-next.68

## 6.0.0-6-next.67

### Minor Changes

- 16e38df8: feat: trustProxy property

## 6.0.0-6-next.66

## 6.0.0-6-next.65

### Patch Changes

- a1da1130: fix: minor typo on warning message

## 6.0.0-6-next.64

### Minor Changes

- 974cd8c1: fix: startup messages improved and logs support on types

## 6.0.0-6-next.63

### Minor Changes

- dc571aab: feat: add forceEnhancedLegacySignature

## 6.0.0-6-next.62

### Patch Changes

- 378e907d: fix(core): fix `isObject` function.`isObject(true)` should return false.

## 6.0.0-6-next.61

## 6.0.0-6-next.60

## 6.0.0-6-next.59

## 6.0.0-6-next.58

## 6.0.0-6-next.57

## 6.0.0-6-next.56

## 6.0.0-6-next.55

### Patch Changes

- 9718e033: fix: build targets for 5x modules

## 6.0.0-6-next.54

### Minor Changes

- ef88da3b: feat: improve support for fs promises older nodejs

## 6.0.0-6-next.53

## 6.0.0-6-next.52

## 6.0.0-6-next.51

### Minor Changes

- 4b29d715: chore: move improvements from v5 to v6

  Migrate improvements form v5 to v6:

  - https://github.com/verdaccio/verdaccio/pull/3158
  - https://github.com/verdaccio/verdaccio/pull/3151
  - https://github.com/verdaccio/verdaccio/pull/2271
  - https://github.com/verdaccio/verdaccio/pull/2787
  - https://github.com/verdaccio/verdaccio/pull/2791
  - https://github.com/verdaccio/verdaccio/pull/2205

## 6.0.0-6-next.50

## 6.0.0-6-next.49

## 6.0.0-6-next.48

### Minor Changes

- 62c24b63: feat: add passwordValidationRegex property

### Patch Changes

- 43f32687: fix: abbreviated headers handle quality values

## 6.0.0-6-next.47

## 6.0.0-6-next.8

### Patch Changes

- b849128d: fix: handle upload scoped tarball

## 6.0.0-6-next.7

### Patch Changes

- 351aeeaa: fix(deps): @verdaccio/utils should be a prod dep of local-storage

## 6.0.0-6-next.6

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

- 00d1d2a1: chore: env variable for launch fastify

  - Update fastify to major release `v4.3.0`
  - Update CLI launcher

  via CLI

  ```
  VERDACCIO_SERVER=fastify verdaccio
  ```

  with docker

  ```
  docker run -it --rm --name verdaccio \
    -e "VERDACCIO_SERVER=8080" -p 8080:8080 \
    -e "VERDACCIO_SERVER=fastify" \
    verdaccio/verdaccio
  ```

## 6.0.0-6-next.5

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

## 6.0.0-6-next.4

### Minor Changes

- 24b9be02: refactor: improve docker image build with strict dependencies and prod build

## 6.0.0-6-next.3

### Minor Changes

- 6c1eb021: feat: use warning codes for deprecation warnings

## 6.0.0-6-next.2

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

## 6.0.0-6-next.1

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
