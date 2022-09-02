# @verdaccio/node-api

## 6.0.0-6-next.36

### Patch Changes

- Updated dependencies [b849128d]
  - @verdaccio/core@6.0.0-6-next.8
  - @verdaccio/server@6.0.0-6-next.35
  - @verdaccio/config@6.0.0-6-next.17
  - @verdaccio/logger@6.0.0-6-next.14
  - @verdaccio/server-fastify@6.0.0-6-next.27

## 6.0.0-6-next.35

### Patch Changes

- 351aeeaa: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- Updated dependencies [351aeeaa]
  - @verdaccio/core@6.0.0-6-next.7
  - @verdaccio/logger@6.0.0-6-next.13
  - @verdaccio/server@6.0.0-6-next.34
  - @verdaccio/server-fastify@6.0.0-6-next.26
  - @verdaccio/config@6.0.0-6-next.16

## 6.0.0-6-next.34

### Patch Changes

- Updated dependencies [37274e4c]
  - @verdaccio/server-fastify@6.0.0-6-next.25
  - @verdaccio/server@6.0.0-6-next.33
  - @verdaccio/core@6.0.0-6-next.6
  - @verdaccio/logger@6.0.0-6-next.12

## 6.0.0-6-next.33

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

### Patch Changes

- Updated dependencies [292c0a37]
- Updated dependencies [a3a209b5]
- Updated dependencies [00d1d2a1]
  - @verdaccio/config@6.0.0-6-next.15
  - @verdaccio/core@6.0.0-6-next.6
  - @verdaccio/logger@6.0.0-6-next.12
  - @verdaccio/server@6.0.0-6-next.32
  - @verdaccio/server-fastify@6.0.0-6-next.24

## 6.0.0-6-next.32

### Patch Changes

- @verdaccio/server@6.0.0-6-next.31

## 6.0.0-6-next.31

### Patch Changes

- Updated dependencies [d43894e8]
- Updated dependencies [d08fe29d]
  - @verdaccio/config@6.0.0-6-next.14
  - @verdaccio/server@6.0.0-6-next.30
  - @verdaccio/core@6.0.0-6-next.5
  - @verdaccio/logger@6.0.0-6-next.11

## 6.0.0-6-next.30

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

### Patch Changes

- Updated dependencies [82cb0f2b]
- Updated dependencies [5167bb52]
  - @verdaccio/config@6.0.0-6-next.13
  - @verdaccio/core@6.0.0-6-next.5
  - @verdaccio/logger@6.0.0-6-next.11
  - @verdaccio/server@6.0.0-6-next.29

## 6.0.0-6-next.29

### Patch Changes

- @verdaccio/server@6.0.0-6-next.28

## 6.0.0-6-next.28

### Patch Changes

- @verdaccio/server@6.0.0-6-next.27

## 6.0.0-6-next.27

### Patch Changes

- Updated dependencies [b78f3525]
  - @verdaccio/logger@6.0.0-6-next.10
  - @verdaccio/server@6.0.0-6-next.26

## 6.0.0-6-next.26

### Patch Changes

- Updated dependencies [048ac95e]
- Updated dependencies [730b5d8c]
  - @verdaccio/server@6.0.0-6-next.25
  - @verdaccio/logger@6.0.0-6-next.9

## 6.0.0-6-next.25

### Patch Changes

- Updated dependencies [a828271d]
- Updated dependencies [24b9be02]
- Updated dependencies [e75c0a3b]
  - @verdaccio/server@6.0.0-6-next.24
  - @verdaccio/core@6.0.0-6-next.4
  - @verdaccio/logger@6.0.0-6-next.8
  - @verdaccio/config@6.0.0-6-next.12

## 6.0.0-6-next.24

### Patch Changes

- @verdaccio/server@6.0.0-6-next.23
- @verdaccio/config@6.0.0-6-next.11

## 6.0.0-6-next.23

### Minor Changes

- 6c1eb021: feat: use warning codes for deprecation warnings

### Patch Changes

- Updated dependencies [6c1eb021]
  - @verdaccio/core@6.0.0-6-next.3
  - @verdaccio/logger@6.0.0-6-next.7
  - @verdaccio/config@6.0.0-6-next.10
  - @verdaccio/server@6.0.0-6-next.22

## 6.0.0-6-next.22

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

### Patch Changes

- Updated dependencies [794af76c]
- Updated dependencies [154b2ecd]
  - @verdaccio/config@6.0.0-6-next.9
  - @verdaccio/core@6.0.0-6-next.2
  - @verdaccio/logger@6.0.0-6-next.6
  - @verdaccio/server@6.0.0-6-next.21

## 6.0.0-6-next.21

### Patch Changes

- Updated dependencies [2c594910]
  - @verdaccio/logger@6.0.0-6-next.5
  - @verdaccio/server@6.0.0-6-next.20

## 6.0.0-6-next.20

### Patch Changes

- Updated dependencies [459b6fa7]
  - @verdaccio/config@6.0.0-6-next.8
  - @verdaccio/commons-api@11.0.0-6-next.4
  - @verdaccio/server@6.0.0-6-next.19
  - @verdaccio/logger@6.0.0-6-next.4

## 6.0.0-6-next.19

### Patch Changes

- df0da3d6: Added core-js missing from dependencies though referenced in .js sources
  - @verdaccio/server@6.0.0-6-next.18

## 6.0.0-6-next.18

### Patch Changes

- @verdaccio/server@6.0.0-6-next.17

## 6.0.0-6-next.17

### Patch Changes

- @verdaccio/config@6.0.0-6-next.7
- @verdaccio/server@6.0.0-6-next.16

## 6.0.0-6-next.16

### Patch Changes

- @verdaccio/server@6.0.0-6-next.15

## 6.0.0-6-next.15

### Patch Changes

- @verdaccio/logger@6.0.0-6-next.4
- @verdaccio/server@6.0.0-6-next.14

## 6.0.0-6-next.14

### Patch Changes

- @verdaccio/logger@6.0.0-6-next.4
- @verdaccio/server@6.0.0-6-next.13

## 6.0.0-6-next.13

### Patch Changes

- Updated dependencies [1b217fd3]
  - @verdaccio/config@6.0.0-6-next.6
  - @verdaccio/server@6.0.0-6-next.12

## 6.0.0-6-next.12

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

- Updated dependencies [19d272d1]
  - @verdaccio/server@6.0.0-6-next.11
  - @verdaccio/logger@6.0.0-6-next.4

## 6.0.0-6-next.11

### Patch Changes

- Updated dependencies [1810ed0d]
- Updated dependencies [648575aa]
  - @verdaccio/config@6.0.0-6-next.5
  - @verdaccio/server@6.0.0-6-next.10

## 6.0.0-6-next.10

### Major Changes

- 5c5057fc: feat: node api new structure based on promise

  ```js
  import { runServer } from '@verdaccio/node-api';
  // or
  import { runServer } from 'verdaccio';

  const app = await runServer(); // default configuration
  const app = await runServer('./config/config.yaml');
  const app = await runServer({ configuration });
  app.listen(4000, event => {
    // do something
  });
  ```

  ### Breaking Change

  If you are using the node-api, the new structure is Promise based and less arguments.

### Patch Changes

- Updated dependencies [5c5057fc]
  - @verdaccio/config@6.0.0-6-next.4
  - @verdaccio/logger@6.0.0-6-next.4
  - @verdaccio/server@6.0.0-6-next.9

## 6.0.0-6-next.9

### Patch Changes

- @verdaccio/server@6.0.0-6-next.8

## 5.0.0-alpha.8

### Patch Changes

- @verdaccio/server@5.0.0-alpha.7

## 5.0.0-alpha.7

### Minor Changes

- 64737a37: feat: improve cli loggin on start up

## 5.0.0-alpha.6

### Patch Changes

- @verdaccio/server@5.0.0-alpha.6

## 5.0.0-alpha.5

### Patch Changes

- Updated dependencies [f8a50baa]
  - @verdaccio/server@5.0.0-alpha.5

## 5.0.0-alpha.4

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr
- Updated dependencies [fecbb9be]
  - @verdaccio/server@5.0.0-alpha.4
  - @verdaccio/config@5.0.0-alpha.3
  - @verdaccio/commons-api@10.0.0-alpha.3
  - @verdaccio/logger@5.0.0-alpha.3

## 5.0.0-alpha.3

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

### Patch Changes

- Updated dependencies [54c58d1e]
  - @verdaccio/config@5.0.0-alpha.2
  - @verdaccio/commons-api@10.0.0-alpha.2
  - @verdaccio/logger@5.0.0-alpha.2
  - @verdaccio/server@5.0.0-alpha.3

## 5.0.0-alpha.2

### Patch Changes

- @verdaccio/server@5.0.0-alpha.2

## 5.0.0-alpha.1

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

- Updated dependencies [d87fa026]
- Updated dependencies [da1ee9c8]
- Updated dependencies [26b494cb]
- Updated dependencies [b57b4338]
- Updated dependencies [add778d5]
- Updated dependencies [31af0164]
  - @verdaccio/config@5.0.0-alpha.1
  - @verdaccio/commons-api@10.0.0-alpha.1
  - @verdaccio/logger@5.0.0-alpha.1
  - @verdaccio/server@5.0.0-alpha.1

## 5.0.0-alpha.1

### Major Changes

- d87fa0268: feat!: experiments config renamed to flags

  - The `experiments` configuration is renamed to `flags`. The functionality is exactly the same.

  ```js
  flags: token: false;
  search: false;
  ```

  - The `self_path` property from the config file is being removed in favor of `config_file` full path.
  - Refactor `config` module, better types and utilities

- da1ee9c82: - Replace signature handler for legacy tokens by removing deprecated crypto.createDecipher by createCipheriv

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

- 26b494cbd: feat: add typescript project references settings

  Reading https://ebaytech.berlin/optimizing-multi-package-apps-with-typescript-project-references-d5c57a3b4440 I realized I can use project references to solve the issue to pre-compile modules on develop mode.

  It allows to navigate (IDE) trough the packages without need compile the packages.

  Add two `tsconfig`, one using the previous existing configuration that is able to produce declaration files (`tsconfig.build`) and a new one `tsconfig` which is enables [_projects references_](https://www.typescriptlang.org/docs/handbook/project-references.html).

### Patch Changes

- b57b43388: Enable prerelease mode with **changesets**
- 31af01641: ESLint Warnings Fixed

  Related to issue #1461

  - max-len: most of the sensible max-len errors are fixed
  - no-unused-vars: most of these types of errors are fixed by deleting not needed declarations
  - @typescript-eslint/no-unused-vars: same as above

- Updated dependencies [d87fa0268]
- Updated dependencies [da1ee9c82]
- Updated dependencies [26b494cbd]
- Updated dependencies [b57b43388]
- Updated dependencies [add778d55]
- Updated dependencies [31af01641]
  - @verdaccio/config@5.0.0-alpha.1
  - @verdaccio/commons-api@10.0.0-alpha.0
  - @verdaccio/logger@5.0.0-alpha.1
  - @verdaccio/server@5.0.0-alpha.1
