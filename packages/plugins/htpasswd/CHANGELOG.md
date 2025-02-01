# Change Log

## 13.0.0-next-8.8

### Patch Changes

- @verdaccio/core@8.0.0-next-8.8
- @verdaccio/file-locking@13.0.0-next-8.2

## 13.0.0-next-8.7

### Patch Changes

- Updated dependencies [589ea7f]
  - @verdaccio/core@8.0.0-next-8.7

## 13.0.0-next-8.6

### Patch Changes

- @verdaccio/core@8.0.0-next-8.6

## 13.0.0-next-8.5

### Patch Changes

- Updated dependencies [64a7fc0]
- Updated dependencies [5cbee6f]
- Updated dependencies [a049bba]
  - @verdaccio/core@8.0.0-next-8.5
  - @verdaccio/file-locking@13.0.0-next-8.2

## 13.0.0-next-8.4

### Patch Changes

- Updated dependencies [48aa89f]
- Updated dependencies [58e0d95]
- Updated dependencies [e93d6a3]
  - @verdaccio/core@8.0.0-next-8.4
  - @verdaccio/file-locking@13.0.0-next-8.2

## 13.0.0-next-8.3

### Patch Changes

- 124e5f2: chore: add debug code to htpasswd package
  - @verdaccio/core@8.0.0-next-8.3

## 13.0.0-next-8.2

### Minor Changes

- 6a8154c: feat: update logger pino to latest

### Patch Changes

- Updated dependencies [6a8154c]
  - @verdaccio/core@8.0.0-next-8.2
  - @verdaccio/file-locking@13.0.0-next-8.1

## 13.0.0-next-8.1

### Patch Changes

- @verdaccio/core@8.0.0-next-8.1

## 13.0.0-next-8.0

### Major Changes

- chore: move v7 next to v8 next

### Patch Changes

- Updated dependencies
  - @verdaccio/file-locking@13.0.0-next-8.0
  - @verdaccio/core@8.0.0-next-8.0

## 12.0.0

### Major Changes

- 47f61c6: feat!: bump to v7
- e7ebccb: update major dependencies, remove old nodejs support

### Minor Changes

- daceb6d: restore legacy support

### Patch Changes

- Updated dependencies [47f61c6]
- Updated dependencies [6e764e3]
- Updated dependencies [daceb6d]
- Updated dependencies [e7ebccb]
- Updated dependencies [f047cc8]
- Updated dependencies [7c9f3cf]
- Updated dependencies [bd8703e]
  - @verdaccio/core@7.0.0
  - @verdaccio/file-locking@12.0.0

## 12.0.0-next-8.21

### Patch Changes

- Updated dependencies [7c9f3cf]
  - @verdaccio/core@7.0.0-next-8.21

## 12.0.0-next-7.20

### Patch Changes

- @verdaccio/core@7.0.0-next-7.20

## 12.0.0-next-7.19

### Patch Changes

- @verdaccio/core@7.0.0-next-7.19

## 12.0.0-next-7.18

### Patch Changes

- @verdaccio/core@7.0.0-next-7.18
- @verdaccio/file-locking@12.0.0-next.1

## 12.0.0-next-7.17

### Patch Changes

- Updated dependencies [6e764e3]
  - @verdaccio/core@7.0.0-next-7.17
  - @verdaccio/file-locking@12.0.0-next.1

## 12.0.0-next-7.16

### Patch Changes

- @verdaccio/core@7.0.0-next-7.16

## 12.0.0-next-7.15

### Patch Changes

- Updated dependencies [bd8703e]
  - @verdaccio/core@7.0.0-next-7.15
  - @verdaccio/file-locking@12.0.0-next.1

## 12.0.0-next-7.14

### Patch Changes

- @verdaccio/core@7.0.0-next-7.14

## 12.0.0-next-7.13

### Patch Changes

- @verdaccio/core@7.0.0-next-7.13

## 12.0.0-next-7.12

### Patch Changes

- @verdaccio/core@7.0.0-next-7.12

## 12.0.0-next-7.11

### Patch Changes

- @verdaccio/core@7.0.0-next-7.11

## 12.0.0-next-7.10

### Patch Changes

- @verdaccio/core@7.0.0-next-7.10

## 12.0.0-next-7.9

### Patch Changes

- @verdaccio/core@7.0.0-next-7.9

## 12.0.0-next-7.8

### Patch Changes

- @verdaccio/core@7.0.0-next-7.8

## 12.0.0-next-7.7

### Patch Changes

- @verdaccio/core@7.0.0-next-7.7

## 12.0.0-next.6

### Patch Changes

- @verdaccio/core@7.0.0-next.6

## 12.0.0-next.5

### Patch Changes

- Updated dependencies [f047cc8]
  - @verdaccio/core@7.0.0-next.5
  - @verdaccio/file-locking@12.0.0-next.1

## 12.0.0-next.4

### Patch Changes

- @verdaccio/core@7.0.0-next.4

## 12.0.0-next.3

### Major Changes

- e7ebccb61: update major dependencies, remove old nodejs support

### Minor Changes

- daceb6d87: restore legacy support

### Patch Changes

- Updated dependencies [daceb6d87]
- Updated dependencies [e7ebccb61]
  - @verdaccio/core@7.0.0-next.3
  - @verdaccio/file-locking@12.0.0-next.1

## 12.0.0-next.2

### Patch Changes

- @verdaccio/core@7.0.0-next.2

## 12.0.0-next.1

### Patch Changes

- @verdaccio/core@7.0.0-next.1

## 12.0.0-next.0

### Major Changes

- feat!: bump to v7

### Patch Changes

- Updated dependencies
  - @verdaccio/core@7.0.0-next.0
  - @verdaccio/file-locking@12.0.0-next.0

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

- 061bfcc8d: feat: standalone registry with no dependencies

  ## Usage

  To install a server with no dependencies

  ```bash
  npm install -g @verdaccio/standalone
  ```

  with no internet required

  ```bash
  npm install -g ./tarball.tar.gz
  ```

  Bundles htpasswd and audit plugins.

  ### Breaking Change

  It does not allow anymore the `auth` and `middleware` property at config file empty,
  it will fallback to those plugins by default.

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

- c8a040e69: feat: allow other password hashing algorithms (#1917)

  **breaking change**

  The current implementation of the `htpasswd` module supports multiple hash formats on verify, but only `crypt` on sign in.
  `crypt` is an insecure old format, so to improve the security of the new `verdaccio` release we introduce the support of multiple hash algorithms on sign in step.

  ### New hashing algorithms

  The new possible hash algorithms to use are `bcrypt`, `md5`, `sha1`. `bcrypt` is chosen as a default, because of its customizable complexity and overall reliability. You can read more about them [here](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html).

  Two new properties are added to `auth` section in the configuration file:

  - `algorithm` to choose the way you want to hash passwords.
  - `rounds` is used to determine `bcrypt` complexity. So one can improve security according to increasing computational power.

  Example of the new `auth` config file section:

  ```yaml
  auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
    # Hash algorithm, possible options are: "bcrypt", "md5", "sha1", "crypt".
    algorithm: bcrypt
    # Rounds number for "bcrypt", will be ignored for other algorithms.
    rounds: 10
  ```

### Minor Changes

- 631abe1ac: feat: refactor logger
- e54ec4b5d: feat: remove level dependency by lowdb for npm token cli as storage

  ### new npm token database

  There will be a new database located in your storage named `.token-db.json` which
  will store all references to created tokens, **it does not store tokens**, just
  mask of them and related metadata required to reference them.

  #### Breaking change

  If you were relying on `npm token` experiment. This PR will replace the
  used database (level) by a json plain based one (lowbd) which does not
  require Node.js C++ compilation step and has less dependencies. Since was
  a experiment there is no migration step.

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

- c9d1af0e5: feat: async bcrypt hash

### Patch Changes

- 351aeeaa8: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- a610ef26b: chore: add release step to private regisry on merge changeset pr
- 34f0f1101: Enable prerelease mode with **changesets**
- df0da3d69: Added core-js missing from dependencies though referenced in .js sources
- 09753cc1f: fix wrong htpasswd file location
- aeff267d9: Refactor htpasswd plugin to use the bcryptjs 'compare' api call instead of 'comparSync'. Add a new configuration value named 'slow_verify_ms' to the htpasswd plugin that when exceeded during password verification will log a warning message.
- 68ea21214: ESLint Warnings Fixed

  Related to issue #1461

  - max-len: most of the sensible max-len errors are fixed
  - no-unused-vars: most of these types of errors are fixed by deleting not needed declarations
  - @typescript-eslint/no-unused-vars: same as above

- Updated dependencies [292c0a37f]
- Updated dependencies [974cd8c19]
- Updated dependencies [ef88da3b4]
- Updated dependencies [43f32687c]
- Updated dependencies [a3a209b5e]
- Updated dependencies [459b6fa72]
- Updated dependencies [24b9be020]
- Updated dependencies [794af76c5]
- Updated dependencies [351aeeaa8]
- Updated dependencies [10aeb4f13]
- Updated dependencies [9718e0330]
- Updated dependencies [e367c3f1e]
- Updated dependencies [a1da11308]
- Updated dependencies [00d1d2a17]
- Updated dependencies [a610ef26b]
- Updated dependencies [b61f762d6]
- Updated dependencies [154b2ecd3]
- Updated dependencies [aa763baec]
- Updated dependencies [378e907d5]
- Updated dependencies [16e38df8a]
- Updated dependencies [34f0f1101]
- Updated dependencies [82cb0f2bf]
- Updated dependencies [dc571aabd]
- Updated dependencies [f859d2b1a]
- Updated dependencies [6c1eb021b]
- Updated dependencies [62c24b632]
- Updated dependencies [0a6412ca9]
- Updated dependencies [5167bb528]
- Updated dependencies [c9d1af0e5]
- Updated dependencies [4b29d715b]
- Updated dependencies [68ea21214]
- Updated dependencies [b849128de]
  - @verdaccio/core@6.0.0
  - @verdaccio/file-locking@11.0.0

## 11.0.0-6-next.46

### Patch Changes

- @verdaccio/core@6.0.0-6-next.76

## 11.0.0-6-next.45

### Patch Changes

- Updated dependencies [0a6412ca9]
  - @verdaccio/core@6.0.0-6-next.75

## 11.0.0-6-next.44

### Patch Changes

- @verdaccio/core@6.0.0-6-next.74

## 11.0.0-6-next.43

### Patch Changes

- Updated dependencies [f859d2b1a]
  - @verdaccio/core@6.0.0-6-next.73

## 11.0.0-6-next.42

### Patch Changes

- @verdaccio/core@6.0.0-6-next.72

## 11.0.0-6-next.41

### Patch Changes

- @verdaccio/core@6.0.0-6-next.71

## 11.0.0-6-next.40

### Patch Changes

- @verdaccio/core@6.0.0-6-next.70

## 11.0.0-6-next.39

### Minor Changes

- c9d1af0e: feat: async bcrypt hash

### Patch Changes

- Updated dependencies [c9d1af0e]
  - @verdaccio/core@6.0.0-6-next.69

## 11.0.0-6-next.38

### Patch Changes

- 09753cc1: fix wrong htpasswd file location
  - @verdaccio/core@6.0.0-6-next.68

## 11.0.0-6-next.37

### Patch Changes

- Updated dependencies [16e38df8]
  - @verdaccio/core@6.0.0-6-next.67
  - @verdaccio/file-locking@11.0.0-6-next.7

## 11.0.0-6-next.36

### Patch Changes

- @verdaccio/core@6.0.0-6-next.66
- @verdaccio/file-locking@11.0.0-6-next.7

## 11.0.0-6-next.35

### Patch Changes

- Updated dependencies [a1da1130]
  - @verdaccio/core@6.0.0-6-next.65

## 11.0.0-6-next.34

### Patch Changes

- Updated dependencies [974cd8c1]
  - @verdaccio/core@6.0.0-6-next.64
  - @verdaccio/file-locking@11.0.0-6-next.7

## 11.0.0-6-next.33

### Patch Changes

- Updated dependencies [dc571aab]
  - @verdaccio/core@6.0.0-6-next.63
  - @verdaccio/file-locking@11.0.0-6-next.7

## 11.0.0-6-next.32

### Patch Changes

- Updated dependencies [378e907d]
  - @verdaccio/core@6.0.0-6-next.62
  - @verdaccio/file-locking@11.0.0-6-next.7

## 11.0.0-6-next.31

### Patch Changes

- @verdaccio/core@6.0.0-6-next.61

## 11.0.0-6-next.30

### Patch Changes

- @verdaccio/core@6.0.0-6-next.60
- @verdaccio/file-locking@11.0.0-6-next.7

## 11.0.0-6-next.29

### Patch Changes

- @verdaccio/core@6.0.0-6-next.59

## 11.0.0-6-next.28

### Patch Changes

- @verdaccio/core@6.0.0-6-next.58

## 11.0.0-6-next.27

### Patch Changes

- @verdaccio/core@6.0.0-6-next.57

## 11.0.0-6-next.26

### Patch Changes

- @verdaccio/core@6.0.0-6-next.56

## 11.0.0-6-next.25

### Patch Changes

- Updated dependencies [9718e033]
  - @verdaccio/core@6.0.0-6-next.55

## 11.0.0-6-next.24

### Patch Changes

- Updated dependencies [ef88da3b]
  - @verdaccio/core@6.0.0-6-next.54
  - @verdaccio/file-locking@11.0.0-6-next.7

## 11.0.0-6-next.23

### Patch Changes

- @verdaccio/core@6.0.0-6-next.53
- @verdaccio/file-locking@11.0.0-6-next.6

## 11.0.0-6-next.22

### Patch Changes

- @verdaccio/core@6.0.0-6-next.52

## 11.0.0-6-next.21

### Patch Changes

- Updated dependencies [4b29d715]
  - @verdaccio/core@6.0.0-6-next.51

## 11.0.0-6-next.20

### Patch Changes

- @verdaccio/core@6.0.0-6-next.50

## 11.0.0-6-next.19

### Patch Changes

- @verdaccio/core@6.0.0-6-next.49

## 11.0.0-6-next.18

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

### Patch Changes

- Updated dependencies [43f32687]
- Updated dependencies [62c24b63]
  - @verdaccio/core@6.0.0-6-next.48
  - @verdaccio/file-locking@11.0.0-6-next.6

## 11.0.0-6-next.17

### Patch Changes

- @verdaccio/core@6.0.0-6-next.47

## 11.0.0-6-next.16

### Patch Changes

- Updated dependencies [b849128d]
  - @verdaccio/core@6.0.0-6-next.8
  - @verdaccio/file-locking@11.0.0-6-next.6

## 11.0.0-6-next.15

### Patch Changes

- 351aeeaa: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- Updated dependencies [351aeeaa]
  - @verdaccio/core@6.0.0-6-next.7
  - @verdaccio/file-locking@11.0.0-6-next.6

## 11.0.0-6-next.14

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

### Patch Changes

- Updated dependencies [292c0a37]
- Updated dependencies [a3a209b5]
- Updated dependencies [00d1d2a1]
  - @verdaccio/core@6.0.0-6-next.6
  - @verdaccio/file-locking@11.0.0-6-next.5

## 11.0.0-6-next.13

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
  - @verdaccio/file-locking@11.0.0-6-next.4

## 11.0.0-6-next.12

### Patch Changes

- aeff267d: Refactor htpasswd plugin to use the bcryptjs 'compare' api call instead of 'comparSync'. Add a new configuration value named 'slow_verify_ms' to the htpasswd plugin that when exceeded during password verification will log a warning message.

## 11.0.0-6-next.11

### Patch Changes

- Updated dependencies [24b9be02]
  - @verdaccio/core@6.0.0-6-next.4
  - @verdaccio/file-locking@11.0.0-6-next.4

## 11.0.0-6-next.10

### Patch Changes

- Updated dependencies [6c1eb021]
  - @verdaccio/core@6.0.0-6-next.3

## 11.0.0-6-next.9

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

### Patch Changes

- Updated dependencies [794af76c]
- Updated dependencies [154b2ecd]
  - @verdaccio/core@6.0.0-6-next.2
  - @verdaccio/file-locking@11.0.0-6-next.4

## 11.0.0-6-next.8

### Patch Changes

- Updated dependencies [459b6fa7]
  - @verdaccio/commons-api@11.0.0-6-next.4
  - @verdaccio/file-locking@11.0.0-alpha.3

## 11.0.0-6-next.7

### Patch Changes

- df0da3d6: Added core-js missing from dependencies though referenced in .js sources

## 10.0.0-alpha.6

### Major Changes

- 174cdcaa: feat: allow other password hashing algorithms (#1917)

  **breaking change**

  The current implementation of the `htpasswd` module supports multiple hash formats on verify, but only `crypt` on sign in.
  `crypt` is an insecure old format, so to improve the security of the new `verdaccio` release we introduce the support of multiple hash algorithms on sign in step.

  ### New hashing algorithms

  The new possible hash algorithms to use are `bcrypt`, `md5`, `sha1`. `bcrypt` is chosen as a default, because of its customizable complexity and overall reliability. You can read more about them [here](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html).

  Two new properties are added to `auth` section in the configuration file:

  - `algorithm` to choose the way you want to hash passwords.
  - `rounds` is used to determine `bcrypt` complexity. So one can improve security according to increasing computational power.

  Example of the new `auth` config file section:

  ```yaml
  auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
    # Hash algorithm, possible options are: "bcrypt", "md5", "sha1", "crypt".
    algorithm: bcrypt
    # Rounds number for "bcrypt", will be ignored for other algorithms.
    rounds: 10
  ```

## 10.0.0-alpha.5

### Major Changes

- f8a50baa: feat: standalone registry with no dependencies

  ## Usage

  To install a server with no dependencies

  ```bash
  npm install -g @verdaccio/standalone
  ```

  with no internet required

  ```bash
  npm install -g ./tarball.tar.gz
  ```

  Bundles htpasswd and audit plugins.

  ### Breaking Change

  It does not allow anymore the `auth` and `middleware` property at config file empty,
  it will fallback to those plugins by default.

## 10.0.0-alpha.4

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr
- Updated dependencies [fecbb9be]
  - @verdaccio/commons-api@10.0.0-alpha.3
  - @verdaccio/file-locking@10.0.0-alpha.3

## 10.0.0-alpha.3

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
  - @verdaccio/commons-api@10.0.0-alpha.2
  - @verdaccio/file-locking@10.0.0-alpha.2

## 10.0.0-alpha.2

### Minor Changes

- 2a327c4b: feat: remove level dependency by lowdb for npm token cli as storage

  ### new npm token database

  There will be a new database located in your storage named `.token-db.json` which
  will store all references to created tokens, **it does not store tokens**, just
  mask of them and related metadata required to reference them.

  #### Breaking change

  If you were relying on `npm token` experiment. This PR will replace the
  used database (level) by a json plain based one (lowbd) which does not
  require Node.js C++ compilation step and has less dependencies. Since was
  a experiment there is no migration step.

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

- Updated dependencies [d87fa026]
- Updated dependencies [da1ee9c8]
- Updated dependencies [26b494cb]
- Updated dependencies [b57b4338]
- Updated dependencies [31af0164]
  - @verdaccio/file-locking@10.0.0-alpha.1

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [9.7.2](https://github.com/verdaccio/monorepo/compare/v9.7.1...v9.7.2) (2020-07-20)

**Note:** Version bump only for package verdaccio-htpasswd

## [9.7.1](https://github.com/verdaccio/monorepo/compare/v9.7.0...v9.7.1) (2020-07-10)

### Bug Fixes

- update dependencies ([#375](https://github.com/verdaccio/monorepo/issues/375)) ([1e7aeec](https://github.com/verdaccio/monorepo/commit/1e7aeec31b056979285e272793a95b8c75d57c77))

# [9.7.0](https://github.com/verdaccio/monorepo/compare/v9.6.1...v9.7.0) (2020-06-24)

**Note:** Version bump only for package verdaccio-htpasswd

## [9.6.1](https://github.com/verdaccio/monorepo/compare/v9.6.0...v9.6.1) (2020-06-07)

**Note:** Version bump only for package verdaccio-htpasswd

# [9.5.0](https://github.com/verdaccio/monorepo/compare/v9.4.1...v9.5.0) (2020-05-02)

**Note:** Version bump only for package verdaccio-htpasswd

## [9.4.1](https://github.com/verdaccio/monorepo/compare/v9.4.0...v9.4.1) (2020-04-30)

### Bug Fixes

- **verdaccio-htpasswd:** generate non-constant legacy 2 byte salt ([#357](https://github.com/verdaccio/monorepo/issues/357)) ([d522595](https://github.com/verdaccio/monorepo/commit/d522595122b7deaac8e3bc568f73658041811aaf))

# [9.4.0](https://github.com/verdaccio/monorepo/compare/v9.3.4...v9.4.0) (2020-03-21)

**Note:** Version bump only for package verdaccio-htpasswd

## [9.3.2](https://github.com/verdaccio/monorepo/compare/v9.3.1...v9.3.2) (2020-03-08)

### Bug Fixes

- update dependencies ([#332](https://github.com/verdaccio/monorepo/issues/332)) ([b6165ae](https://github.com/verdaccio/monorepo/commit/b6165aea9b7e4012477081eae68bfa7159c58f56))

## [9.3.1](https://github.com/verdaccio/monorepo/compare/v9.3.0...v9.3.1) (2020-02-23)

**Note:** Version bump only for package verdaccio-htpasswd

# [9.3.0](https://github.com/verdaccio/monorepo/compare/v9.2.0...v9.3.0) (2020-01-29)

**Note:** Version bump only for package verdaccio-htpasswd

# [9.0.0](https://github.com/verdaccio/monorepo/compare/v8.5.3...v9.0.0) (2020-01-07)

### chore

- update dependencies ([68add74](https://github.com/verdaccio/monorepo/commit/68add743159867f678ddb9168d2bc8391844de47))

### Features

- **eslint-config:** enable eslint curly ([#308](https://github.com/verdaccio/monorepo/issues/308)) ([91acb12](https://github.com/verdaccio/monorepo/commit/91acb121847018e737c21b367fcaab8baa918347))

### BREAKING CHANGES

- @verdaccio/eslint-config requires ESLint >=6.8.0 and Prettier >=1.19.1 to fix compatibility with overrides.extends config

## [8.5.2](https://github.com/verdaccio/monorepo/compare/v8.5.1...v8.5.2) (2019-12-25)

**Note:** Version bump only for package verdaccio-htpasswd

## [8.5.1](https://github.com/verdaccio/monorepo/compare/v8.5.0...v8.5.1) (2019-12-24)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.5.0](https://github.com/verdaccio/monorepo/compare/v8.4.2...v8.5.0) (2019-12-22)

**Note:** Version bump only for package verdaccio-htpasswd

## [8.4.2](https://github.com/verdaccio/monorepo/compare/v8.4.1...v8.4.2) (2019-11-23)

**Note:** Version bump only for package verdaccio-htpasswd

## [8.4.1](https://github.com/verdaccio/monorepo/compare/v8.4.0...v8.4.1) (2019-11-22)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.4.0](https://github.com/verdaccio/monorepo/compare/v8.3.0...v8.4.0) (2019-11-22)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.3.0](https://github.com/verdaccio/monorepo/compare/v8.2.0...v8.3.0) (2019-10-27)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.2.0](https://github.com/verdaccio/monorepo/compare/v8.2.0-next.0...v8.2.0) (2019-10-23)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.2.0-next.0](https://github.com/verdaccio/monorepo/compare/v8.1.4...v8.2.0-next.0) (2019-10-08)

### Bug Fixes

- fixed lint errors ([5e677f7](https://github.com/verdaccio/monorepo/commit/5e677f7))

## [8.1.2](https://github.com/verdaccio/monorepo/compare/v8.1.1...v8.1.2) (2019-09-29)

**Note:** Version bump only for package verdaccio-htpasswd

## [8.1.1](https://github.com/verdaccio/monorepo/compare/v8.1.0...v8.1.1) (2019-09-26)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.1.0](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.1...v8.1.0) (2019-09-07)

**Note:** Version bump only for package verdaccio-htpasswd

## [8.0.1-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.0...v8.0.1-next.1) (2019-08-29)

**Note:** Version bump only for package verdaccio-htpasswd

## [8.0.1-next.0](https://github.com/verdaccio/monorepo/compare/v8.0.0...v8.0.1-next.0) (2019-08-29)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.0.0](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.4...v8.0.0) (2019-08-22)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.0.0-next.4](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.3...v8.0.0-next.4) (2019-08-18)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.0.0-next.2](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.1...v8.0.0-next.2) (2019-08-03)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.0.0-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.0...v8.0.0-next.1) (2019-08-01)

**Note:** Version bump only for package verdaccio-htpasswd

# [8.0.0-next.0](https://github.com/verdaccio/monorepo/compare/v2.0.0...v8.0.0-next.0) (2019-08-01)

**Note:** Version bump only for package verdaccio-htpasswd

# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [2.0.0](https://github.com/verdaccio/verdaccio-htpasswd/compare/v2.0.0-beta.1...v2.0.0) (2019-04-14)

### Features

- drop node v6 suport ([d1d52e8](https://github.com/verdaccio/verdaccio-htpasswd/commit/d1d52e8))

<a name="2.0.0-beta.1"></a>

# [2.0.0-beta.1](https://github.com/verdaccio/verdaccio-htpasswd/compare/v2.0.0-beta.0...v2.0.0-beta.1) (2019-02-24)

### Bug Fixes

- package.json to reduce vulnerabilities ([259bdaf](https://github.com/verdaccio/verdaccio-htpasswd/commit/259bdaf))
- update [@verdaccio](https://github.com/verdaccio)/file-locking@1.0.0 ([ec0bbfd](https://github.com/verdaccio/verdaccio-htpasswd/commit/ec0bbfd))

<a name="2.0.0-beta.0"></a>

# [2.0.0-beta.0](https://github.com/verdaccio/verdaccio-htpasswd/compare/v1.0.1...v2.0.0-beta.0) (2019-02-03)

### Features

- migrate to typescript ([79f6937](https://github.com/verdaccio/verdaccio-htpasswd/commit/79f6937))
- remove Node6 from CircleCI ([d3a05ab](https://github.com/verdaccio/verdaccio-htpasswd/commit/d3a05ab))
- use verdaccio babel preset ([3a63f88](https://github.com/verdaccio/verdaccio-htpasswd/commit/3a63f88))

<a name="1.0.1"></a>

## [1.0.1](https://github.com/verdaccio/verdaccio-htpasswd/compare/v1.0.0...v1.0.1) (2018-09-30)

### Bug Fixes

- password hash & increase coverage ([6420c26](https://github.com/verdaccio/verdaccio-htpasswd/commit/6420c26))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/verdaccio/verdaccio-htpasswd/compare/v0.2.2...v1.0.0) (2018-09-30)

### Bug Fixes

- adds error message for user registration ([0bab945](https://github.com/verdaccio/verdaccio-htpasswd/commit/0bab945))

### Features

- **change-passwd:** implement change password [#32](https://github.com/verdaccio/verdaccio-htpasswd/issues/32) ([830b143](https://github.com/verdaccio/verdaccio-htpasswd/commit/830b143))
