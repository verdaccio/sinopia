# @verdaccio/logger

## 8.0.0-next-8.8

### Patch Changes

- @verdaccio/logger-commons@8.0.0-next-8.8

## 8.0.0-next-8.7

### Patch Changes

- @verdaccio/logger-commons@8.0.0-next-8.7

## 8.0.0-next-8.6

### Patch Changes

- @verdaccio/logger-commons@8.0.0-next-8.6

## 8.0.0-next-8.5

### Patch Changes

- Updated dependencies [15dddbe]
- Updated dependencies [a049bba]
  - @verdaccio/logger-commons@8.0.0-next-8.5

## 8.0.0-next-8.4

### Patch Changes

- Updated dependencies [e93d6a3]
  - @verdaccio/logger-commons@8.0.0-next-8.4

## 8.0.0-next-8.3

### Patch Changes

- @verdaccio/logger-commons@8.0.0-next-8.3

## 8.0.0-next-8.2

### Minor Changes

- 6a8154c: feat: update logger pino to latest

### Patch Changes

- Updated dependencies [6a8154c]
  - @verdaccio/logger-commons@8.0.0-next-8.2

## 8.0.0-next-8.1

### Patch Changes

- @verdaccio/logger-commons@8.0.0-next-8.1

## 8.0.0-next-8.0

### Major Changes

- chore: move v7 next to v8 next

### Patch Changes

- Updated dependencies
  - @verdaccio/logger-commons@8.0.0-next-8.0

## 7.0.0

### Major Changes

- 47f61c6: feat!: bump to v7
- e7ebccb: update major dependencies, remove old nodejs support

### Patch Changes

- Updated dependencies [47f61c6]
- Updated dependencies [cf1b46c]
- Updated dependencies [daceb6d]
- Updated dependencies [e7ebccb]
  - @verdaccio/logger-commons@7.0.0

## 7.0.0-next-8.21

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-8.21

## 7.0.0-next-7.20

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.20

## 7.0.0-next-7.19

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.19

## 7.0.0-next-7.18

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.18

## 7.0.0-next-7.17

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.17

## 7.0.0-next-7.16

### Patch Changes

- Updated dependencies [cf1b46c]
  - @verdaccio/logger-commons@7.0.0-next-7.16

## 7.0.0-next-7.15

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.15

## 7.0.0-next-7.14

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.14

## 7.0.0-next-7.13

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.13

## 7.0.0-next-7.12

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.12

## 7.0.0-next-7.11

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.11

## 7.0.0-next-7.10

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.10

## 7.0.0-next-7.9

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.9

## 7.0.0-next-7.8

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.8

## 7.0.0-next-7.7

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next-7.7

## 7.0.0-next.6

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next.6

## 7.0.0-next.5

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next.5

## 7.0.0-next.4

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next.4

## 7.0.0-next.3

### Major Changes

- e7ebccb61: update major dependencies, remove old nodejs support

### Patch Changes

- Updated dependencies [daceb6d87]
- Updated dependencies [e7ebccb61]
  - @verdaccio/logger-commons@7.0.0-next.3

## 7.0.0-next.2

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next.2

## 7.0.0-next.1

### Patch Changes

- @verdaccio/logger-commons@7.0.0-next.1

## 7.0.0-next.0

### Major Changes

- feat!: bump to v7

### Patch Changes

- Updated dependencies
  - @verdaccio/logger-commons@7.0.0-next.0

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

- b3e8438f6: logging prettifier only in development mode

  - Verdaccio prettify `@verdaccio/logger-prettify` the logging which looks beautiful. But there are scenarios which does not make sense in production. This feature enables disable by default the prettifies if production `NODE_ENV` is enabled.
  - Updates pino.js to `^6.7.0`.
  - Suppress the warning when prettifier is enabled `suppressFlushSyncWarning`

- 730b5d8cc: feat: upgrade to pino v7
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

- 154b2ecd3: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications
- aa763baec: feat: add typescript project references settings

  Reading https://ebaytech.berlin/optimizing-multi-package-apps-with-typescript-project-references-d5c57a3b4440 I realized I can use project references to solve the issue to pre-compile modules on develop mode.

  It allows to navigate (IDE) trough the packages without need compile the packages.

  Add two `tsconfig`, one using the previous existing configuration that is able to produce declaration files (`tsconfig.build`) and a new one `tsconfig` which is enables [_projects references_](https://www.typescriptlang.org/docs/handbook/project-references.html).

- 6c1eb021b: feat: use warning codes for deprecation warnings

### Patch Changes

- e75c0a3b9: hydrate template placeholders in log messages when format is set to 'json'
- 351aeeaa8: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- a610ef26b: chore: add release step to private regisry on merge changeset pr
- 34f0f1101: Enable prerelease mode with **changesets**
- b78f35257: Fix re-opening log files using SIGUSR2
- 2c594910d: do not show deprecation warning on default logger config
- 65f88b826: bump logger packages
- 68ea21214: ESLint Warnings Fixed

  Related to issue #1461

  - max-len: most of the sensible max-len errors are fixed
  - no-unused-vars: most of these types of errors are fixed by deleting not needed declarations
  - @typescript-eslint/no-unused-vars: same as above

- Updated dependencies [631abe1ac]
- Updated dependencies [84b2dffdb]
- Updated dependencies [65f88b826]
- Updated dependencies [4a33e269b]
  - @verdaccio/logger-commons@6.0.0

## 6.0.0-6-next.44

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.44

## 6.0.0-6-next.43

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.43

## 6.0.0-6-next.42

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.42

## 6.0.0-6-next.41

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.41

## 6.0.0-6-next.40

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.40

## 6.0.0-6-next.39

### Patch Changes

- Updated dependencies [84b2dffdb]
  - @verdaccio/logger-commons@6.0.0-6-next.39

## 6.0.0-6-next.38

### Patch Changes

- Updated dependencies [4a33e269]
  - @verdaccio/logger-commons@6.0.0-6-next.38

## 6.0.0-6-next.37

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.37

## 6.0.0-6-next.36

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.36

## 6.0.0-6-next.35

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.35

## 6.0.0-6-next.34

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.34

## 6.0.0-6-next.33

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.33

## 6.0.0-6-next.32

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.32

## 6.0.0-6-next.31

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.31

## 6.0.0-6-next.30

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.30

## 6.0.0-6-next.29

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.29

## 6.0.0-6-next.28

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.28

## 6.0.0-6-next.27

### Patch Changes

- 65f88b82: bump logger packages
- Updated dependencies [65f88b82]
  - @verdaccio/logger-commons@6.0.0-6-next.27

## 6.0.0-6-next.26

### Patch Changes

- @verdaccio/logger-commons@6.0.0-6-next.26

## 6.0.0-6-next.25

### Patch Changes

- @verdaccio/core@6.0.0-6-next.57

## 6.0.0-6-next.24

### Patch Changes

- @verdaccio/core@6.0.0-6-next.56

## 6.0.0-6-next.23

### Patch Changes

- Updated dependencies [9718e033]
  - @verdaccio/core@6.0.0-6-next.55

## 6.0.0-6-next.22

### Minor Changes

- ef88da3b: feat: improve support for fs promises older nodejs

### Patch Changes

- Updated dependencies [ef88da3b]
  - @verdaccio/core@6.0.0-6-next.54
  - @verdaccio/logger-prettify@6.0.0-6-next.8

## 6.0.0-6-next.21

### Patch Changes

- @verdaccio/core@6.0.0-6-next.53

## 6.0.0-6-next.20

### Patch Changes

- @verdaccio/core@6.0.0-6-next.52

## 6.0.0-6-next.19

### Patch Changes

- Updated dependencies [4b29d715]
  - @verdaccio/core@6.0.0-6-next.51

## 6.0.0-6-next.18

### Patch Changes

- @verdaccio/core@6.0.0-6-next.50

## 6.0.0-6-next.17

### Patch Changes

- @verdaccio/core@6.0.0-6-next.49

## 6.0.0-6-next.16

### Patch Changes

- Updated dependencies [43f32687]
- Updated dependencies [62c24b63]
  - @verdaccio/core@6.0.0-6-next.48

## 6.0.0-6-next.15

### Patch Changes

- @verdaccio/core@6.0.0-6-next.47

## 6.0.0-6-next.14

### Patch Changes

- Updated dependencies [b849128d]
  - @verdaccio/core@6.0.0-6-next.8

## 6.0.0-6-next.13

### Patch Changes

- 351aeeaa: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- Updated dependencies [351aeeaa]
  - @verdaccio/core@6.0.0-6-next.7

## 6.0.0-6-next.12

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

### Patch Changes

- Updated dependencies [292c0a37]
- Updated dependencies [a3a209b5]
- Updated dependencies [00d1d2a1]
  - @verdaccio/core@6.0.0-6-next.6
  - @verdaccio/logger-prettify@6.0.0-6-next.7

## 6.0.0-6-next.11

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
  - @verdaccio/core@6.0.0-6-next.5

## 6.0.0-6-next.10

### Patch Changes

- b78f3525: Fix re-opening log files using SIGUSR2

## 6.0.0-6-next.9

### Major Changes

- 730b5d8c: feat: upgrade to pino v7

### Patch Changes

- Updated dependencies [730b5d8c]
  - @verdaccio/logger-prettify@6.0.0-6-next.6

## 6.0.0-6-next.8

### Patch Changes

- e75c0a3b: hydrate template placeholders in log messages when format is set to 'json'
- Updated dependencies [24b9be02]
- Updated dependencies [e75c0a3b]
  - @verdaccio/core@6.0.0-6-next.4
  - @verdaccio/logger-prettify@6.0.0-6-next.5

## 6.0.0-6-next.7

### Minor Changes

- 6c1eb021: feat: use warning codes for deprecation warnings

### Patch Changes

- Updated dependencies [6c1eb021]
  - @verdaccio/core@6.0.0-6-next.3

## 6.0.0-6-next.6

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

### Patch Changes

- Updated dependencies [b702ea36]
  - @verdaccio/logger-prettify@6.0.0-6-next.4

## 6.0.0-6-next.5

### Patch Changes

- 2c594910: do not show deprecation warning on default logger config

## 6.0.0-6-next.4

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

## 5.0.0-alpha.3

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr
- Updated dependencies [fecbb9be]
  - @verdaccio/logger-prettify@5.0.0-alpha.3

## 5.0.0-alpha.2

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
  - @verdaccio/logger-prettify@5.0.0-alpha.2

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

- add778d5: logging prettifier only in development mode

  - Verdaccio prettify `@verdaccio/logger-prettify` the logging which looks beautiful. But there are scenarios which does not make sense in production. This feature enables disable by default the prettifies if production `NODE_ENV` is enabled.
  - Updates pino.js to `^6.7.0`.
  - Suppress the warning when prettifier is enabled `suppressFlushSyncWarning`

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
- Updated dependencies [31af0164]
  - @verdaccio/logger-prettify@5.0.0-alpha.1

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

- add778d55: logging prettifier only in development mode

  - Verdaccio prettify `@verdaccio/logger-prettify` the logging which looks beautiful. But there are scenarios which does not make sense in production. This feature enables disable by default the prettifies if production `NODE_ENV` is enabled.
  - Updates pino.js to `^6.7.0`.
  - Suppress the warning when prettifier is enabled `suppressFlushSyncWarning`

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
- Updated dependencies [31af01641]
  - @verdaccio/logger-prettify@5.0.0-alpha.1
