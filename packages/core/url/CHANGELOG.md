# Change Log

## 13.0.0-next-8.8

### Patch Changes

- @verdaccio/core@8.0.0-next-8.8

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

## 13.0.0-next-8.4

### Patch Changes

- Updated dependencies [48aa89f]
- Updated dependencies [58e0d95]
  - @verdaccio/core@8.0.0-next-8.4

## 13.0.0-next-8.3

### Patch Changes

- @verdaccio/core@8.0.0-next-8.3

## 13.0.0-next-8.2

### Minor Changes

- 6a8154c: feat: update logger pino to latest

### Patch Changes

- Updated dependencies [6a8154c]
  - @verdaccio/core@8.0.0-next-8.2

## 13.0.0-next-8.1

### Patch Changes

- @verdaccio/core@8.0.0-next-8.1

## 13.0.0-next-8.0

### Major Changes

- chore: move v7 next to v8 next

### Patch Changes

- Updated dependencies
  - @verdaccio/core@8.0.0-next-8.0

## 12.0.0

### Major Changes

- 47f61c6: feat!: bump to v7
- e7ebccb: update major dependencies, remove old nodejs support

### Minor Changes

- daceb6d: restore legacy support
- f047cc8: refactor: auth with legacy sign support

### Patch Changes

- b0946b2: Improved TS types for renderHTML() and related functions (by @tobbe in #4605)
- ccc7bd1: fix(middleware): link to favicon in template
- 38b1e82: patch(core/url): Throw if VERDACCIO_FORWARDED_PROTO resolves to an array (#4613 by @Tobbe)
- Updated dependencies [47f61c6]
- Updated dependencies [6e764e3]
- Updated dependencies [daceb6d]
- Updated dependencies [e7ebccb]
- Updated dependencies [f047cc8]
- Updated dependencies [7c9f3cf]
- Updated dependencies [bd8703e]
  - @verdaccio/core@7.0.0

## 12.0.0-next-8.21

### Patch Changes

- Updated dependencies [7c9f3cf]
  - @verdaccio/core@7.0.0-next-8.21

## 12.0.0-next-7.20

### Patch Changes

- ccc7bd1: fix(middleware): link to favicon in template
  - @verdaccio/core@7.0.0-next-7.20

## 12.0.0-next-7.19

### Patch Changes

- @verdaccio/core@7.0.0-next-7.19

## 12.0.0-next-7.18

### Patch Changes

- @verdaccio/core@7.0.0-next-7.18

## 12.0.0-next-7.17

### Patch Changes

- Updated dependencies [6e764e3]
  - @verdaccio/core@7.0.0-next-7.17

## 12.0.0-next-7.16

### Patch Changes

- 38b1e82: patch(core/url): Throw if VERDACCIO_FORWARDED_PROTO resolves to an array (#4613 by @Tobbe)
  - @verdaccio/core@7.0.0-next-7.16

## 12.0.0-next-7.15

### Patch Changes

- Updated dependencies [bd8703e]
  - @verdaccio/core@7.0.0-next-7.15

## 12.0.0-next-7.14

### Patch Changes

- b0946b2: Improved TS types for renderHTML() and related functions (by @tobbe in #4605)
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

### Minor Changes

- f047cc8: refactor: auth with legacy sign support

### Patch Changes

- Updated dependencies [f047cc8]
  - @verdaccio/core@7.0.0-next.5

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

- dc05edfe6: # async storage plugin bootstrap

  Gives a storage plugin the ability to perform asynchronous tasks on initialization

  ## Breaking change

  Plugin must have an init method in which asynchronous tasks can be executed

  ```js
  public async init(): Promise<void> {
     this.data = await this._fetchLocalPackages();
     this._sync();
  }
  ```

- 794af76c5: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- ef88da3b4: feat: improve support for fs promises older nodejs
- 154b2ecd3: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications
- ce013d2fc: refactor: npm star command support reimplemented
- 4b29d715b: chore: move improvements from v5 to v6

  Migrate improvements form v5 to v6:

  - https://github.com/verdaccio/verdaccio/pull/3158
  - https://github.com/verdaccio/verdaccio/pull/3151
  - https://github.com/verdaccio/verdaccio/pull/2271
  - https://github.com/verdaccio/verdaccio/pull/2787
  - https://github.com/verdaccio/verdaccio/pull/2791
  - https://github.com/verdaccio/verdaccio/pull/2205

### Patch Changes

- 351aeeaa8: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- 9718e0330: fix: build targets for 5x modules
- Updated dependencies [292c0a37f]
- Updated dependencies [974cd8c19]
- Updated dependencies [ef88da3b4]
- Updated dependencies [43f32687c]
- Updated dependencies [a3a209b5e]
- Updated dependencies [459b6fa72]
- Updated dependencies [24b9be020]
- Updated dependencies [794af76c5]
- Updated dependencies [351aeeaa8]
- Updated dependencies [9718e0330]
- Updated dependencies [a1da11308]
- Updated dependencies [00d1d2a17]
- Updated dependencies [154b2ecd3]
- Updated dependencies [378e907d5]
- Updated dependencies [16e38df8a]
- Updated dependencies [82cb0f2bf]
- Updated dependencies [dc571aabd]
- Updated dependencies [f859d2b1a]
- Updated dependencies [6c1eb021b]
- Updated dependencies [62c24b632]
- Updated dependencies [0a6412ca9]
- Updated dependencies [5167bb528]
- Updated dependencies [c9d1af0e5]
- Updated dependencies [4b29d715b]
- Updated dependencies [b849128de]
  - @verdaccio/core@6.0.0

## 11.0.0-6-next.42

### Patch Changes

- @verdaccio/core@6.0.0-6-next.76

## 11.0.0-6-next.41

### Patch Changes

- Updated dependencies [0a6412ca9]
  - @verdaccio/core@6.0.0-6-next.75

## 11.0.0-6-next.40

### Patch Changes

- @verdaccio/core@6.0.0-6-next.74

## 11.0.0-6-next.39

### Patch Changes

- Updated dependencies [f859d2b1a]
  - @verdaccio/core@6.0.0-6-next.73

## 11.0.0-6-next.38

### Patch Changes

- @verdaccio/core@6.0.0-6-next.72

## 11.0.0-6-next.37

### Patch Changes

- @verdaccio/core@6.0.0-6-next.71

## 11.0.0-6-next.36

### Patch Changes

- @verdaccio/core@6.0.0-6-next.70

## 11.0.0-6-next.35

### Patch Changes

- Updated dependencies [c9d1af0e]
  - @verdaccio/core@6.0.0-6-next.69

## 11.0.0-6-next.34

### Patch Changes

- @verdaccio/core@6.0.0-6-next.68

## 11.0.0-6-next.33

### Patch Changes

- Updated dependencies [16e38df8]
  - @verdaccio/core@6.0.0-6-next.67

## 11.0.0-6-next.32

### Patch Changes

- @verdaccio/core@6.0.0-6-next.66

## 11.0.0-6-next.31

### Patch Changes

- Updated dependencies [a1da1130]
  - @verdaccio/core@6.0.0-6-next.65

## 11.0.0-6-next.30

### Patch Changes

- Updated dependencies [974cd8c1]
  - @verdaccio/core@6.0.0-6-next.64

## 11.0.0-6-next.29

### Patch Changes

- Updated dependencies [dc571aab]
  - @verdaccio/core@6.0.0-6-next.63

## 11.0.0-6-next.28

### Patch Changes

- Updated dependencies [378e907d]
  - @verdaccio/core@6.0.0-6-next.62

## 11.0.0-6-next.27

### Patch Changes

- @verdaccio/core@6.0.0-6-next.61

## 11.0.0-6-next.26

### Patch Changes

- @verdaccio/core@6.0.0-6-next.60

## 11.0.0-6-next.25

### Patch Changes

- @verdaccio/core@6.0.0-6-next.59

## 11.0.0-6-next.24

### Patch Changes

- @verdaccio/core@6.0.0-6-next.58

## 11.0.0-6-next.23

### Patch Changes

- @verdaccio/core@6.0.0-6-next.57

## 11.0.0-6-next.22

### Patch Changes

- @verdaccio/core@6.0.0-6-next.56

## 11.0.0-6-next.21

### Patch Changes

- 9718e033: fix: build targets for 5x modules
- Updated dependencies [9718e033]
  - @verdaccio/core@6.0.0-6-next.55

## 11.0.0-6-next.20

### Minor Changes

- ef88da3b: feat: improve support for fs promises older nodejs

### Patch Changes

- Updated dependencies [ef88da3b]
  - @verdaccio/core@6.0.0-6-next.54

## 11.0.0-6-next.19

### Patch Changes

- @verdaccio/core@6.0.0-6-next.53

## 11.0.0-6-next.18

### Patch Changes

- @verdaccio/core@6.0.0-6-next.52

## 11.0.0-6-next.17

### Minor Changes

- 4b29d715: chore: move improvements from v5 to v6

  Migrate improvements form v5 to v6:

  - https://github.com/verdaccio/verdaccio/pull/3158
  - https://github.com/verdaccio/verdaccio/pull/3151
  - https://github.com/verdaccio/verdaccio/pull/2271
  - https://github.com/verdaccio/verdaccio/pull/2787
  - https://github.com/verdaccio/verdaccio/pull/2791
  - https://github.com/verdaccio/verdaccio/pull/2205

### Patch Changes

- Updated dependencies [4b29d715]
  - @verdaccio/core@6.0.0-6-next.51

## 11.0.0-6-next.16

### Patch Changes

- @verdaccio/core@6.0.0-6-next.50

## 11.0.0-6-next.15

### Minor Changes

- ce013d2f: refactor: npm star command support reimplemented

### Patch Changes

- @verdaccio/core@6.0.0-6-next.49

## 11.0.0-6-next.14

### Patch Changes

- Updated dependencies [43f32687]
- Updated dependencies [62c24b63]
  - @verdaccio/core@6.0.0-6-next.48

## 11.0.0-6-next.13

### Patch Changes

- @verdaccio/core@6.0.0-6-next.47

## 11.0.0-6-next.12

### Patch Changes

- Updated dependencies [b849128d]
  - @verdaccio/core@6.0.0-6-next.8

## 11.0.0-6-next.11

### Patch Changes

- 351aeeaa: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- Updated dependencies [351aeeaa]
  - @verdaccio/core@6.0.0-6-next.7

## 11.0.0-6-next.10

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

## 11.0.0-6-next.9

### Patch Changes

- Updated dependencies [82cb0f2b]
- Updated dependencies [5167bb52]
  - @verdaccio/core@6.0.0-6-next.5

## 11.0.0-6-next.8

### Patch Changes

- Updated dependencies [24b9be02]
  - @verdaccio/core@6.0.0-6-next.4

## 11.0.0-6-next.7

### Patch Changes

- Updated dependencies [6c1eb021]
  - @verdaccio/core@6.0.0-6-next.3

## 11.0.0-6-next.6

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

### Patch Changes

- Updated dependencies [794af76c]
- Updated dependencies [154b2ecd]
  - @verdaccio/core@6.0.0-6-next.2

## 11.0.0-6-next.5

### Patch Changes

- Updated dependencies [459b6fa7]
  - @verdaccio/commons-api@11.0.0-6-next.4

## 11.0.0-6-next.4

### Major Changes

- cb2281a5: # async storage plugin bootstrap

  Gives a storage plugin the ability to perform asynchronous tasks on initialization

  ## Breaking change

  Plugin must have an init method in which asynchronous tasks can be executed

  ```js
  public async init(): Promise<void> {
     this.data = await this._fetchLocalPackages();
     this._sync();
  }
  ```

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

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [9.7.2](https://github.com/verdaccio/monorepo/compare/v9.7.1...v9.7.2) (2020-07-20)

**Note:** Version bump only for package @verdaccio/streams

## [9.7.1](https://github.com/verdaccio/monorepo/compare/v9.7.0...v9.7.1) (2020-07-10)

**Note:** Version bump only for package @verdaccio/streams

# [9.7.0](https://github.com/verdaccio/monorepo/compare/v9.6.1...v9.7.0) (2020-06-24)

**Note:** Version bump only for package @verdaccio/streams

## [9.6.1](https://github.com/verdaccio/monorepo/compare/v9.6.0...v9.6.1) (2020-06-07)

**Note:** Version bump only for package @verdaccio/streams

# [9.5.0](https://github.com/verdaccio/monorepo/compare/v9.4.1...v9.5.0) (2020-05-02)

**Note:** Version bump only for package @verdaccio/streams

# [9.4.0](https://github.com/verdaccio/monorepo/compare/v9.3.4...v9.4.0) (2020-03-21)

**Note:** Version bump only for package @verdaccio/streams

## [9.3.2](https://github.com/verdaccio/monorepo/compare/v9.3.1...v9.3.2) (2020-03-08)

**Note:** Version bump only for package @verdaccio/streams

## [9.3.1](https://github.com/verdaccio/monorepo/compare/v9.3.0...v9.3.1) (2020-02-23)

**Note:** Version bump only for package @verdaccio/streams

# [9.3.0](https://github.com/verdaccio/monorepo/compare/v9.2.0...v9.3.0) (2020-01-29)

**Note:** Version bump only for package @verdaccio/streams

# [9.0.0](https://github.com/verdaccio/monorepo/compare/v8.5.3...v9.0.0) (2020-01-07)

**Note:** Version bump only for package @verdaccio/streams

## [8.5.2](https://github.com/verdaccio/monorepo/compare/v8.5.1...v8.5.2) (2019-12-25)

**Note:** Version bump only for package @verdaccio/streams

## [8.5.1](https://github.com/verdaccio/monorepo/compare/v8.5.0...v8.5.1) (2019-12-24)

**Note:** Version bump only for package @verdaccio/streams

# [8.5.0](https://github.com/verdaccio/monorepo/compare/v8.4.2...v8.5.0) (2019-12-22)

**Note:** Version bump only for package @verdaccio/streams

## [8.4.2](https://github.com/verdaccio/monorepo/compare/v8.4.1...v8.4.2) (2019-11-23)

**Note:** Version bump only for package @verdaccio/streams

## [8.4.1](https://github.com/verdaccio/monorepo/compare/v8.4.0...v8.4.1) (2019-11-22)

**Note:** Version bump only for package @verdaccio/streams

# [8.4.0](https://github.com/verdaccio/monorepo/compare/v8.3.0...v8.4.0) (2019-11-22)

**Note:** Version bump only for package @verdaccio/streams

# [8.3.0](https://github.com/verdaccio/monorepo/compare/v8.2.0...v8.3.0) (2019-10-27)

**Note:** Version bump only for package @verdaccio/streams

# [8.2.0](https://github.com/verdaccio/monorepo/compare/v8.2.0-next.0...v8.2.0) (2019-10-23)

**Note:** Version bump only for package @verdaccio/streams

# [8.2.0-next.0](https://github.com/verdaccio/monorepo/compare/v8.1.4...v8.2.0-next.0) (2019-10-08)

**Note:** Version bump only for package @verdaccio/streams

## [8.1.2](https://github.com/verdaccio/monorepo/compare/v8.1.1...v8.1.2) (2019-09-29)

**Note:** Version bump only for package @verdaccio/streams

## [8.1.1](https://github.com/verdaccio/monorepo/compare/v8.1.0...v8.1.1) (2019-09-26)

**Note:** Version bump only for package @verdaccio/streams

# [8.1.0](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.1...v8.1.0) (2019-09-07)

**Note:** Version bump only for package @verdaccio/streams

## [8.0.1-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.0...v8.0.1-next.1) (2019-08-29)

**Note:** Version bump only for package @verdaccio/streams

## [8.0.1-next.0](https://github.com/verdaccio/monorepo/compare/v8.0.0...v8.0.1-next.0) (2019-08-29)

**Note:** Version bump only for package @verdaccio/streams

# [8.0.0](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.4...v8.0.0) (2019-08-22)

**Note:** Version bump only for package @verdaccio/streams

# [8.0.0-next.4](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.3...v8.0.0-next.4) (2019-08-18)

**Note:** Version bump only for package @verdaccio/streams

# [8.0.0-next.2](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.1...v8.0.0-next.2) (2019-08-03)

**Note:** Version bump only for package @verdaccio/streams

# [8.0.0-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.0...v8.0.0-next.1) (2019-08-01)

**Note:** Version bump only for package @verdaccio/streams

# [8.0.0-next.0](https://github.com/verdaccio/monorepo/compare/v2.0.0...v8.0.0-next.0) (2019-08-01)

### Bug Fixes

- add es6 imports ([932a22d](https://github.com/verdaccio/monorepo/commit/932a22d))
- lint warnings ([444a99e](https://github.com/verdaccio/monorepo/commit/444a99e))

### Features

- drop node v6 support ([bb319c4](https://github.com/verdaccio/monorepo/commit/bb319c4))
- **build:** use typescript, jest 24 and babel 7 as stack BREAKING CHANGE: typescript build system requires a major release to avoid issues with old installations ([4743a9a](https://github.com/verdaccio/monorepo/commit/4743a9a))
- add stream library ([434628f](https://github.com/verdaccio/monorepo/commit/434628f))
- migration to typescript ([748ca92](https://github.com/verdaccio/monorepo/commit/748ca92))

# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [2.0.0](https://github.com/verdaccio/streams/compare/v2.0.0-beta.0...v2.0.0) (2019-03-29)

### Features

- drop node v6 support ([5771eed](https://github.com/verdaccio/streams/commit/5771eed))

<a name="2.0.0-beta.0"></a>

# [2.0.0-beta.0](https://github.com/verdaccio/streams/compare/v1.0.0...v2.0.0-beta.0) (2019-01-27)

### Features

- migration to typescript ([4e1e959](https://github.com/verdaccio/streams/commit/4e1e959))
- **build:** use typescript, jest 24 and babel 7 as stack ([c93a980](https://github.com/verdaccio/streams/commit/c93a980))

### BREAKING CHANGES

- **build:** typescript build system requires a major release to avoid issues with old installations
