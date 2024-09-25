# @verdaccio/ui-components

## 4.0.0-next-8.1

### Minor Changes

- 6a8154c: feat: update logger pino to latest

## 4.0.0-next-8.0

### Major Changes

- chore: move v7 next to v8 next

## 3.0.0

### Major Changes

- 47f61c6: feat!: bump to v7
- e7ebccb: update major dependencies, remove old nodejs support

### Minor Changes

- 10dd81f: feat: complete overhaul of web user interface
- 580319a: feat: ui improvements

  Some UI improvements

  - download progress indicator: https://github.com/verdaccio/verdaccio/discussions/4068
  - fix dark mode and readme css support https://github.com/verdaccio/verdaccio/discussions/3942 https://github.com/verdaccio/verdaccio/discussions/3467
  - fix global for yarn packages and add version to the packages on copy
  - feat: hide deprecated versions option
  - fix: improve deprecated package style
  - feat: display deprecated versions

- c9962fe: feat: forbidden user interface

### Patch Changes

- 92f1c34: - fixed login state when token is expired (@ku3mi41 in #3980)
- 5a77414: chore: fix type for country flags
- 02ba426: fix: display labels for engine versions
- ba53d1e: feat: versions filter by semver range
- 3b3cf86: chore: sync dependency defs between ui-components and ui-theme
- 3323599: fix: render READMEs with correct font and highlighting
- 96b2857: chore(ui): update babel dependencies
- 5210408: fix: ui dialog break pages on open due remark error
- 117eb1c: fix: change bundleDependencies to array

## 3.0.0-next-7.9

### Patch Changes

- 5a77414: chore: fix type for country flags
- 3b3cf86: chore: sync dependency defs between ui-components and ui-theme
- 96b2857: chore(ui): update babel dependencies

## 3.0.0-next-7.8

### Minor Changes

- 10dd81f: feat: complete overhaul of web user interface

## 3.0.0-next-7.7

### Patch Changes

- 117eb1c: fix: change bundleDependencies to array

## 3.0.0-next-7.6

### Patch Changes

- ba53d1e: feat: versions filter by semver range

## 3.0.0-next-7.5

### Minor Changes

- c9962fe: feat: forbidden user interface

## 3.0.0-next-7.4

### Patch Changes

- 5210408: fix: ui dialog break pages on open due remark error

## 3.0.0-next-7.3

### Patch Changes

- 3323599: fix: render READMEs with correct font and highlighting

## 3.0.0-next.2

### Major Changes

- e7ebccb61: update major dependencies, remove old nodejs support

### Minor Changes

- 580319a53: feat: ui improvements

  Some UI improvements

  - download progress indicator: https://github.com/verdaccio/verdaccio/discussions/4068
  - fix dark mode and readme css support https://github.com/verdaccio/verdaccio/discussions/3942 https://github.com/verdaccio/verdaccio/discussions/3467
  - fix global for yarn packages and add version to the packages on copy
  - feat: hide deprecated versions option
  - fix: improve deprecated package style
  - feat: display deprecated versions

### Patch Changes

- 02ba426ce: fix: display labels for engine versions

## 3.0.0-next.1

### Patch Changes

- 92f1c34ae: - fixed login state when token is expired (@ku3mi41 in #3980)

## 3.0.0-next.0

### Major Changes

- feat!: bump to v7

## 2.0.0

### Major Changes

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

- 781ac9ac2: fix package configuration issues

### Minor Changes

- 974cd8c19: fix: startup messages improved and logs support on types
- 7344a7fcf: feat: ui bugfixes and improvements
- ddb6a2239: feat: signature package

### Patch Changes

- 7ef599cc4: fix: missing version on footer
- 0dafa9826: fix: undefined field on missing count

## 2.0.0-6-next.10

### Minor Changes

- 7344a7fcf: feat: ui bugfixes and improvements

## 2.0.0-6-next.9

### Patch Changes

- 0dafa982: fix: undefined field on missing count

## 2.0.0-6-next.8

### Patch Changes

- Updated dependencies [16e38df8]
  - @verdaccio/types@11.0.0-6-next.25

## 2.0.0-6-next.7

### Patch Changes

- 7ef599cc: fix: missing version on footer
- Updated dependencies [7ef599cc]
  - @verdaccio/types@11.0.0-6-next.24

## 2.0.0-6-next.6

### Minor Changes

- 974cd8c1: fix: startup messages improved and logs support on types

### Patch Changes

- Updated dependencies [974cd8c1]
  - @verdaccio/types@11.0.0-6-next.23

## 2.0.0-6-next.5

### Minor Changes

- ddb6a223: feat: signature package

### Patch Changes

- Updated dependencies [dc571aab]
  - @verdaccio/types@11.0.0-6-next.22

## 2.0.0-6-next.4

### Major Changes

- 781ac9ac: fix package configuration issues

### Patch Changes

- Updated dependencies [4fc21146]
  - @verdaccio/types@11.0.0-6-next.21

## 2.0.0-6-next.3

### Patch Changes

- Updated dependencies [45c03819]
  - @verdaccio/types@11.0.0-6-next.20

## 2.0.0-6-next.2

### Patch Changes

- Updated dependencies [ef88da3b]
  - @verdaccio/types@11.0.0-6-next.19

## 2.0.0-6-next.1

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

### Patch Changes

- Updated dependencies [99978797]
  - @verdaccio/types@11.0.0-6-next.18
