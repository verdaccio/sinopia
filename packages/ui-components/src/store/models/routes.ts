// Example API request:
// http://localhost:8000/-/verdaccio/data/package/readme/jquery
export enum APIRoute {
  LOGIN = '/-/verdaccio/sec/login',
  CONFIG = '/-/verdaccio/packages',
  PACKAGES = '/-/verdaccio/data/packages',
  SEARCH = '/-/verdaccio/data/search/', // :value
  SIDEBAR = '/-/verdaccio/data/sidebar/', // :packageName?v=version
  README = '/-/verdaccio/data/package/readme/', // :packageName?v=version
}
