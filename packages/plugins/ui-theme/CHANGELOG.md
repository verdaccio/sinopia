# @verdaccio/ui-theme

## 8.0.0-next-8.8

## 8.0.0-next-8.7

## 8.0.0-next-8.6

## 8.0.0-next-8.5

### Patch Changes

- 0225c80: chore(ui): vitest follow-ups

## 8.0.0-next-8.4

### Patch Changes

- e93d6a3: chore: auth package requires logger as parameter

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
- e056c8d: - added `onClick` prop to `Link` component in @verdaccio/ui-components. (@moglerdev in #3989)
  - resolved issue in the `Package` component where the download button was incorrectly opening a new tab to the homepage. (@moglerdev in #3989)
- 10dd81f: feat: complete overhaul of web user interface
- 5a77414: chore: fix type for country flags
- 303c659: fix: enable irish language on ui
- 02ba426: fix: display labels for engine versions
- ba53d1e: feat: versions filter by semver range
- 3323599: fix: render READMEs with correct font and highlighting
- 5210408: fix: ui dialog break pages on open due remark error
- 117eb1c: fix: change bundleDependencies to array

## 7.0.0-next-8.21

### Patch Changes

- 303c659: fix: enable irish language on ui

## 7.0.0-next-7.20

## 7.0.0-next-7.19

### Patch Changes

- 5a77414: chore: fix type for country flags

## 7.0.0-next-7.18

### Patch Changes

- 10dd81f: feat: complete overhaul of web user interface

## 7.0.0-next-7.17

### Patch Changes

- 117eb1c: fix: change bundleDependencies to array

## 7.0.0-next-7.16

## 7.0.0-next-7.15

## 7.0.0-next-7.14

## 7.0.0-next-7.13

### Patch Changes

- ba53d1e: feat: versions filter by semver range

## 7.0.0-next-7.12

## 7.0.0-next-7.11

### Minor Changes

- c9962fe: feat: forbidden user interface

## 7.0.0-next-7.10

### Patch Changes

- 5210408: fix: ui dialog break pages on open due remark error

## 7.0.0-next-7.9

## 7.0.0-next-7.8

### Patch Changes

- 3323599: fix: render READMEs with correct font and highlighting

## 7.0.0-next-7.7

## 7.0.0-next.6

## 7.0.0-next.5

## 7.0.0-next.4

## 7.0.0-next.3

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

## 7.0.0-next.2

### Patch Changes

- 92f1c34ae: - fixed login state when token is expired (@ku3mi41 in #3980)

## 7.0.0-next.1

### Patch Changes

- e056c8dfd: - added `onClick` prop to `Link` component in @verdaccio/ui-components. (@moglerdev in #3989)
  - resolved issue in the `Package` component where the download button was incorrectly opening a new tab to the homepage. (@moglerdev in #3989)

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
- 558d78f32: feat: flexible user interface generator

  **breaking change**

  The UI does not provide a pre-generated `index.html`, instead the server generates
  the body of the web application based in few parameters:

  - Webpack manifest
  - User configuration details

  It allows inject html tags, javascript and new CSS to make the page even more flexible.

  ### Web new properties for dynamic template

  The new set of properties are made in order allow inject _html_ and _JavaScript_ scripts within the template. This
  might be useful for scenarios like Google Analytics scripts or custom html in any part of the body.

  - metaScripts: html injected before close the `head` element.
  - scriptsBodyAfter: html injected before close the `body` element.
  - bodyAfter: html injected after _verdaccio_ JS scripts.

  ```yaml
  web:
    scriptsBodyAfter:
      - '<script type="text/javascript" src="https://my.company.com/customJS.min.js"></script>'
    metaScripts:
      - '<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>'
      - '<script type="text/javascript" src="https://browser.sentry-cdn.com/5.15.5/bundle.min.js"></script>'
      - '<meta name="robots" content="noindex" />'
    bodyBefore:
      - '<div id="myId">html before webpack scripts</div>'
    bodyAfter:
      - '<div id="myId">html after webpack scripts</div>'
  ```

  ### UI plugin changes

  - `index.html` is not longer used, template is generated based on `manifest.json` generated by webpack.
  - Plugin must export:
    - the manifest file.
    - the manifest files: matcher (array of id that generates required scripts to run the ui)
    - static path: The absolute path where the files are located in `node_modules`

  ```
  exports.staticPath = path.join(__dirname, 'static');
  exports.manifest = require('./static/manifest.json');
  exports.manifestFiles = {
    js: ['runtime.js', 'vendors.js', 'main.js'],
    css: [],
    ico: 'favicon.ico',
  };
  ```

  - Remove font files
  - CSS is inline on JS (this will help with #2046)

  ### Docker v5 Examples

  - Move all current examples to v4 folder
  - Remove any v3 example
  - Create v5 folder with Nginx Example

  #### Related tickets

  https://github.com/verdaccio/verdaccio/issues/1523
  https://github.com/verdaccio/verdaccio/issues/1297
  https://github.com/verdaccio/verdaccio/issues/1593
  https://github.com/verdaccio/verdaccio/discussions/1539
  https://github.com/verdaccio/website/issues/264
  https://github.com/verdaccio/verdaccio/issues/1565
  https://github.com/verdaccio/verdaccio/issues/1251
  https://github.com/verdaccio/verdaccio/issues/2029
  https://github.com/verdaccio/docker-examples/issues/29

- 781ac9ac2: fix package configuration issues

### Minor Changes

- 0da7031e7: allow disable login on ui and endpoints

  To be able disable the login, set `login: false`, anything else would enable login. This flag will disable access via UI and web endpoints.

  ```yml
  web:
    title: verdaccio
    login: false
  ```

- 67406082e: upgrade to react@17 and other dependencies
- 0481b9a32: feat: upgrade to react 18
- ad3151c3f: fix: remove engines from ui-theme
- 7344a7fcf: feat: ui bugfixes and improvements
- a23628be9: feat: parse and sanitize on ui
- 048ac95e8: feat: align with v5 ui endpoints and ui small bugfix
- e9e455265: feat: ui theme plugin part of the application
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

- 5fed1955a: feat: integrate rematch for ui state storage
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
- 5167bb528: feat: ui search support for remote, local and private packages

  The command `npm search` search globally and return all matches, with this improvement the user interface
  is powered with the same capabilities.

  The UI also tag where is the origin the package with a tag, also provide the latest version and description of the package.

- 7ff4808be: feat: improve registry info dialog and language switch
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

- bf4ac5006: fix: markdown ul and img styles
- a2b69a08e: add banner support ukraine
- a179f1fd4: show verdaccio logo in the footer even when custom brand is set
- 5d9b65a1e: chore: improve info regarding using private registries
- 351aeeaa8: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- a828a5f6c: fix: #3174 set correctly ui values to html render
- a610ef26b: chore: add release step to private regisry on merge changeset pr
- df53f61c6: feat: add types and package module icons on sidebar
- 635ca3f92: chore: force publish
- 648575aa4: Bug Fixes

  - fix escaped slash in namespaced packages

  #### Related tickets

  https://github.com/verdaccio/verdaccio/pull/2193

- 027718057: Hide search icon on medium or larger devices
- aa0b2aa9d: fix: replace ts icon by td and fix commonjs icon
- 4fc21146a: fix: missing logo on header
- b4cc80017: fix: improve abort request search
- 20d63dc30: ui: basic grammatical fixes in the Ukraine Message
- d4019f634: Add links to "Current Tags" and sort them in descending order
- c90896313: fix: specific version package detail page not showing
- 910fc03f6: fix menuKey for Khmer language
- 5b3903963: fix: fixes some style issues on mobile, particularly related to the Ukraine support message - [@s-h-a-d-o-w](https://github.com/s-h-a-d-o-w)
- 0dafa9826: fix: undefined field on missing count
- 6ad13de88: feat: Display publication time on sidebar

## 6.0.0-6-next.76

## 6.0.0-6-next.75

## 6.0.0-6-next.74

## 6.0.0-6-next.73

## 6.0.0-6-next.72

## 6.0.0-6-next.71

### Minor Changes

- 7344a7fcf: feat: ui bugfixes and improvements

## 6.0.0-6-next.70

## 6.0.0-6-next.69

### Patch Changes

- 910fc03f: fix menuKey for Khmer language

## 6.0.0-6-next.68

### Patch Changes

- 0dafa982: fix: undefined field on missing count

## 6.0.0-6-next.67

## 6.0.0-6-next.66

## 6.0.0-6-next.65

## 6.0.0-6-next.64

## 6.0.0-6-next.63

## 6.0.0-6-next.62

### Major Changes

- 781ac9ac: fix package configuration issues

### Patch Changes

- 4fc21146: fix: missing logo on header

## 6.0.0-6-next.61

## 6.0.0-6-next.60

### Minor Changes

- 45c03819: refactor: render html middleware

## 6.0.0-6-next.59

## 6.0.0-6-next.58

## 6.0.0-6-next.57

## 6.0.0-6-next.56

## 6.0.0-6-next.55

## 6.0.0-6-next.54

## 6.0.0-6-next.53

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

## 6.0.0-6-next.52

### Patch Changes

- bf4ac500: fix: markdown ul and img styles
- 5d9b65a1: chore: improve info regarding using private registries

## 6.0.0-6-next.51

### Minor Changes

- 0481b9a3: feat: upgrade to react 18
- a23628be: feat: parse and sanitize on ui

## 6.0.0-6-next.50

### Patch Changes

- b4cc8001: fix: improve abort request search

## 6.0.0-6-next.49

### Patch Changes

- 6ad13de8: feat: Display publication time on sidebar

## 6.0.0-6-next.48

### Patch Changes

- 02771805: Hide search icon on medium or larger devices
- d4019f63: Add links to "Current Tags" and sort them in descending order

## 6.0.0-6-next.28

### Patch Changes

- 351aeeaa: fix(deps): @verdaccio/utils should be a prod dep of local-storage

## 6.0.0-6-next.27

### Patch Changes

- 20d63dc3: ui: basic grammatical fixes in the Ukraine Message

## 6.0.0-6-next.26

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

## 6.0.0-6-next.25

### Patch Changes

- a828a5f6: fix: #3174 set correctly ui values to html render

## 6.0.0-6-next.24

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

## 6.0.0-6-next.23

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

### Patch Changes

- 5b390396: fix: fixes some style issues on mobile, particularly related to the Ukraine support message - [@s-h-a-d-o-w](https://github.com/s-h-a-d-o-w)

## 6.0.0-6-next.22

### Patch Changes

- a2b69a08: add banner support ukraine

## 6.0.0-6-next.21

### Patch Changes

- a179f1fd: show verdaccio logo in the footer even when custom brand is set

## 6.0.0-6-next.20

### Patch Changes

- 635ca3f9: chore: force publish

## 6.0.0-6-next.19

### Patch Changes

- aa0b2aa9: fix: replace ts icon by td and fix commonjs icon

## 6.0.0-6-next.18

### Patch Changes

- df53f61c: feat: add types and package module icons on sidebar

## 6.0.0-6-next.17

### Patch Changes

- c9089631: fix: specific version package detail page not showing

## 6.0.0-6-next.16

### Minor Changes

- ad3151c3: fix: remove engines from ui-theme

## 6.0.0-6-next.15

### Minor Changes

- 7ff4808b: feat: improve registry info dialog and language switch

## 6.0.0-6-next.14

### Minor Changes

- 048ac95e: feat: align with v5 ui endpoints and ui small bugfix

## 6.0.0-6-next.13

### Major Changes

- 000d4374: feat: upgrade to material ui 5

## 6.0.0-6-next.12

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

## 6.0.0-6-next.11

### Minor Changes

- 5fed1955: feat: integrate rematch for ui state storage

## 6.0.0-6-next.10

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

## 6.0.0-6-next.9

### Minor Changes

- 67406082: upgrade to react@17 and other dependencies

## 6.0.0-6-next.8

### Minor Changes

- 0da7031e: allow disable login on ui and endpoints

  To be able disable the login, set `login: false`, anything else would enable login. This flag will disable access via UI and web endpoints.

  ```yml
  web:
    title: verdaccio
    login: false
  ```

## 6.0.0-6-next.7

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

## 6.0.0-6-next.6

### Patch Changes

- 648575aa: Bug Fixes

  - fix escaped slash in namespaced packages

  #### Related tickets

  https://github.com/verdaccio/verdaccio/pull/2193

## 5.0.0-alpha.5

### Major Changes

- e0b7c4ff: feat: flexible user interface generator

  **breaking change**

  The UI does not provide a pre-generated `index.html`, instead the server generates
  the body of the web application based in few parameters:

  - Webpack manifest
  - User configuration details

  It allows inject html tags, javascript and new CSS to make the page even more flexible.

  ### Web new properties for dynamic template

  The new set of properties are made in order allow inject _html_ and _JavaScript_ scripts within the template. This
  might be useful for scenarios like Google Analytics scripts or custom html in any part of the body.

  - metaScripts: html injected before close the `head` element.
  - scriptsBodyAfter: html injected before close the `body` element.
  - bodyAfter: html injected after _verdaccio_ JS scripts.

  ```yaml
  web:
    scriptsBodyAfter:
      - '<script type="text/javascript" src="https://my.company.com/customJS.min.js"></script>'
    metaScripts:
      - '<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>'
      - '<script type="text/javascript" src="https://browser.sentry-cdn.com/5.15.5/bundle.min.js"></script>'
      - '<meta name="robots" content="noindex" />'
    bodyBefore:
      - '<div id="myId">html before webpack scripts</div>'
    bodyAfter:
      - '<div id="myId">html after webpack scripts</div>'
  ```

  ### UI plugin changes

  - `index.html` is not longer used, template is generated based on `manifest.json` generated by webpack.
  - Plugin must export:
    - the manifest file.
    - the manifest files: matcher (array of id that generates required scripts to run the ui)
    - static path: The absolute path where the files are located in `node_modules`

  ```
  exports.staticPath = path.join(__dirname, 'static');
  exports.manifest = require('./static/manifest.json');
  exports.manifestFiles = {
    js: ['runtime.js', 'vendors.js', 'main.js'],
    css: [],
    ico: 'favicon.ico',
  };
  ```

  - Remove font files
  - CSS is inline on JS (this will help with #2046)

  ### Docker v5 Examples

  - Move all current examples to v4 folder
  - Remove any v3 example
  - Create v5 folder with Nginx Example

  #### Related tickets

  https://github.com/verdaccio/verdaccio/issues/1523
  https://github.com/verdaccio/verdaccio/issues/1297
  https://github.com/verdaccio/verdaccio/issues/1593
  https://github.com/verdaccio/verdaccio/discussions/1539
  https://github.com/verdaccio/website/issues/264
  https://github.com/verdaccio/verdaccio/issues/1565
  https://github.com/verdaccio/verdaccio/issues/1251
  https://github.com/verdaccio/verdaccio/issues/2029
  https://github.com/verdaccio/docker-examples/issues/29

## 5.0.0-alpha.4

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr

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

## 5.0.0-alpha.2

### Minor Changes

- 6cb0b588: feat: ui theme plugin part of the application
