// @flow

import _ from 'lodash';
import assert from 'assert';
import async from 'async';
import createError from 'http-errors';
import semver from 'semver';
import Stream from 'stream';

import Search from './search';
import LocalStorage from './local-storage';
import {ReadTarball} from '@verdaccio/streams';
import ProxyStorage from './up-storage';
import {ErrorCode, normalize_dist_tags, validate_metadata, isObject, DIST_TAGS} from './utils';
import type {IStorage, IProxy, IStorageHandler, ProxyList, StringValue} from '../../types';
import type {
  Versions,
  Package,
  Config,
  MergeTags,
  Version,
  DistFile,
  Callback,
  Logger,
} from '@verdaccio/types';
import type {IReadTarball, IUploadTarball} from '@verdaccio/streams';

const LoggerApi = require('../lib/logger');
const WHITELIST = ['_rev', 'name', 'versions', DIST_TAGS, 'readme', 'time'];
const getDefaultMetadata = function(name): Package {
  const pkgMetadata: Package = {
    name,
    versions: {},
    'dist-tags': {},
    _uplinks: {},
    _distfiles: {},
    _attachments: {},
    _rev: '',
  };

  return pkgMetadata;
};

/**
 * Implements Storage interface
 * (same for storage.js, local-storage.js, up-storage.js).
 */
class Storage implements IStorageHandler {
  localStorage: IStorage;
  config: Config;
  logger: Logger;
  uplinks: ProxyList;

  /**
   * @param {*} config
   */
  constructor(config: Config) {
    this.config = config;
    this.uplinks = {};
    this._setupUpLinks(this.config);
    this.logger = LoggerApi.logger.child();
    this.localStorage = new LocalStorage(this.config, LoggerApi.logger);
  }

  /**
   *  Add a {name} package to a system
   Function checks if package with the same name is available from uplinks.
   If it isn't, we create package locally
   Used storages: local (write) && uplinks
   * @param {*} name
   * @param {*} metadata
   * @param {*} callback
   */
  addPackage(name: string, metadata: any, callback: Function) {
    const self = this;

    /**
     * Check whether a package it is already a local package
     * @return {Promise}
     */
    const checkPackageLocal = () => {
      return new Promise((resolve, reject) => {
        this.localStorage.getPackageMetadata(name, (err, results) => {
          if (!_.isNil(err) && err.status !== 404) {
            return reject(err);
          }
          if (results) {
            return reject(ErrorCode.get409('this package is already present'));
          }
          return resolve();
        });
      });
    };

    /**
     * Check whether a package exist in any of the uplinks.
     * @return {Promise}
     */
    const checkPackageRemote = () => {
      return new Promise((resolve, reject) => {
        // $FlowFixMe
        self._syncUplinksMetadata(name, null, {}, (err, results, err_results) => {
          // something weird
          if (err && err.status !== 404) {
            return reject(err);
          }
          // checking package
          if (results) {
            return reject(ErrorCode.get409('this package is already present'));
          }
          for (let i = 0; i < err_results.length; i++) {
            // checking error
            // if uplink fails with a status other than 404, we report failure
            if (_.isNil(err_results[i][0]) === false) {
              if (err_results[i][0].status !== 404) {
                if (this.config.publish &&
                  _.isBoolean(this.config.publish.allow_offline) &&
                  this.config.publish.allow_offline) {
                  return resolve();
                }
                return reject(createError(503, 'one of the uplinks is down, refuse to publish'));
              }
            }
          }

          return resolve();
        });
      });
    };

    /**
     * Add a package to the local database
     * @return {Promise}
     */
    const publishPackage = () => {
      return new Promise((resolve, reject) => {
        self.localStorage.addPackage(name, metadata, (err, latest) => {
          if (!_.isNull(err)) {
            return reject(err);
          } else if (!_.isUndefined(latest)) {
            Search.add(latest);
          }
          return resolve();
        });
      });
    };

    // NOTE:
    // - when we checking package for existance, we ask ALL uplinks
    // - when we publishing package, we only publish it to some of them
    // so all requests are necessary
    checkPackageLocal()
      .then(() => {
        return checkPackageRemote().then(() => {
          return publishPackage().then(() => {
            callback();
          }, (err) => callback(err));
        }, (err) => callback(err));
      }, (err) => callback(err));
  }

  /**
   * Add a new version of package {name} to a system
   Used storages: local (write)
   * @param {*} name
   * @param {*} version
   * @param {*} metadata
   * @param {*} tag
   * @param {*} callback
   */
  addVersion(name: string, version: string, metadata: Version, tag: StringValue, callback: Callback) {
    this.localStorage.addVersion(name, version, metadata, tag, callback);
  }

  /**
   * Tags a package version with a provided tag
   Used storages: local (write)
   * @param {*} name
   * @param {*} tag_hash
   * @param {*} callback
   */
  mergeTags(name: string, tagHash: MergeTags, callback: Callback) {
    this.localStorage.mergeTags(name, tagHash, callback);
  }

  /**
   * Tags a package version with a provided tag
   Used storages: local (write)
   * @param {*} name
   * @param {*} tag_hash
   * @param {*} callback
   */
  replaceTags(name: string, tagHash: MergeTags, callback: Callback) {
    this.logger.warn('method deprecated');
    this.localStorage.mergeTags(name, tagHash, callback);
  }

  /**
   * Change an existing package (i.e. unpublish one version)
   Function changes a package info from local storage and all uplinks with write access./
   Used storages: local (write)
   * @param {*} name
   * @param {*} metadata
   * @param {*} revision
   * @param {*} callback
   */
  changePackage(name: string, metadata: Package, revision: string, callback: Callback) {
    this.localStorage.changePackage(name, metadata, revision, callback);
  }

  /**
   * Remove a package from a system
   Function removes a package from local storage
   Used storages: local (write)
   * @param {*} name
   * @param {*} callback
   */
  removePackage(name: string, callback: Callback) {
    this.localStorage.removePackage(name, callback);
    // update the indexer
    Search.remove(name);
  }

  /**
   Remove a tarball from a system
   Function removes a tarball from local storage.
   Tarball in question should not be linked to in any existing
   versions, i.e. package version should be unpublished first.
   Used storage: local (write)
   * @param {*} name
   * @param {*} filename
   * @param {*} revision
   * @param {*} callback
   */
  removeTarball(name: string, filename: string, revision: string, callback: Callback) {
    this.localStorage.removeTarball(name, filename, revision, callback);
  }

  /**
   * Upload a tarball for {name} package
   Function is syncronous and returns a WritableStream
   Used storages: local (write)
   * @param {*} name
   * @param {*} filename
   * @return {Stream}
   */
  addTarball(name: string, filename: string): IUploadTarball {
    return this.localStorage.addTarball(name, filename);
  }

  /**
   Get a tarball from a storage for {name} package
   Function is syncronous and returns a ReadableStream
   Function tries to read tarball locally, if it fails then it reads package
   information in order to figure out where we can get this tarball from
   Used storages: local || uplink (just one)
   * @param {*} name
   * @param {*} filename
   * @return {Stream}
   */
  getTarball(name: string, filename: string) {
    let readStream = new ReadTarball();
    readStream.abort = function() {};

    let self = this;

    // if someone requesting tarball, it means that we should already have some
    // information about it, so fetching package info is unnecessary

    // trying local first
    // flow: should be IReadTarball
    let localStream: any = self.localStorage.getTarball(name, filename);
    let is_open = false;
    localStream.on('error', (err) => {
      if (is_open || err.status !== 404) {
        return readStream.emit('error', err);
      }

      // local reported 404
      let err404 = err;
      localStream.abort();
      // $FlowFixMe
      localStream = null; // we force for garbage collector
      self.localStorage.getPackageMetadata(name, (err, info: Package) => {
        if (_.isNil(err) && info._distfiles && _.isNil(info._distfiles[filename]) === false) {
          // information about this file exists locally
          serveFile(info._distfiles[filename]);
        } else {
          // we know nothing about this file, trying to get information elsewhere
          self._syncUplinksMetadata(name, info, {}, (err, info: Package) => {
            if (_.isNil(err) === false) {
              return readStream.emit('error', err);
            }
            if (_.isNil(info._distfiles) || _.isNil(info._distfiles[filename])) {
              return readStream.emit('error', err404);
            }
            serveFile(info._distfiles[filename]);
          });
        }
      });
    });
    localStream.on('content-length', function(v) {
      readStream.emit('content-length', v);
    });
    localStream.on('open', function() {
      is_open = true;
      localStream.pipe(readStream);
    });
    return readStream;

    /**
     * Fetch and cache local/remote packages.
     * @param {Object} file define the package shape
     */
    function serveFile(file: DistFile) {
      let uplink: any = null;

      for (let p in self.uplinks) {
        // $FlowFixMe
        if (self.uplinks[p].isUplinkValid(file.url)) {
          uplink = self.uplinks[p];
        }
      }

      if (uplink == null) {
        uplink = new ProxyStorage({
          url: file.url,
          cache: true,
          _autogenerated: true,
        }, self.config);
      }

      let savestream = null;
      if (uplink.config.cache) {
        savestream = self.localStorage.addTarball(name, filename);
      }

      let on_open = function() {
        // prevent it from being called twice
        on_open = function() {};
        let rstream2 = uplink.fetchTarball(file.url);
        rstream2.on('error', function(err) {
          if (savestream) {
            savestream.abort();
          }
          savestream = null;
          readStream.emit('error', err);
        });
        rstream2.on('end', function() {
          if (savestream) {
            savestream.done();
          }
        });

        rstream2.on('content-length', function(v) {
          readStream.emit('content-length', v);
          if (savestream) {
            savestream.emit('content-length', v);
          }
        });
        rstream2.pipe(readStream);
        if (savestream) {
          rstream2.pipe(savestream);
        }
      };

      if (savestream) {
        savestream.on('open', function() {
          on_open();
        });

        savestream.on('error', function(err) {
          self.logger.warn( {err: err}
            , 'error saving file: @{err.message}\n@{err.stack}' );
          if (savestream) {
            savestream.abort();
          }
          savestream = null;
          on_open();
        });
      } else {
        on_open();
      }
    }
  }

  /**
   Retrieve a package metadata for {name} package
   Function invokes localStorage.getPackage and uplink.get_package for every
   uplink with proxy_access rights against {name} and combines results
   into one json object
   Used storages: local && uplink (proxy_access)

   * @param {object} options
   * @property {string} options.name Package Name
   * @property {object}  options.req Express `req` object
   * @property {boolean} options.keepUpLinkData keep up link info in package meta, last update, etc.
   * @property {function} options.callback Callback for receive data
   */
  getPackage(options: any) {
    this.localStorage.getPackageMetadata(options.name, (err, data) => {
      if (err && (!err.status || err.status >= 500)) {
        // report internal errors right away
        return options.callback(err);
      }

      this._syncUplinksMetadata(options.name, data, {req: options.req},
        function getPackageSynUpLinksCallback(err, result: Package, uplink_errors) {
          if (err) {
            return options.callback(err);
          }

          const propertyToKeep = [...WHITELIST];
          if (options.keepUpLinkData === true) {
            propertyToKeep.push('_uplinks');
          }

          for (let i in result) {
            if (propertyToKeep.indexOf(i) === -1) { // Remove sections like '_uplinks' from response
              delete result[i];
            }
          }

          normalize_dist_tags(result);

          // npm can throw if this field doesn't exist
          result._attachments = {};

          options.callback(null, result, uplink_errors);
        });
    });
  }

  /**
   Retrieve remote and local packages more recent than {startkey}
   Function streams all packages from all uplinks first, and then
   local packages.
   Note that local packages could override registry ones just because
   they appear in JSON last. That's a trade-off we make to avoid
   memory issues.
   Used storages: local && uplink (proxy_access)
   * @param {*} startkey
   * @param {*} options
   * @return {Stream}
   */
  search(startkey: string, options: any) {
    let self = this;
    // stream to write a tarball
    let stream: any = new Stream.PassThrough({objectMode: true});

    async.eachSeries(Object.keys(this.uplinks), function(up_name, cb) {
        // shortcut: if `local=1` is supplied, don't call uplinks
        if (options.req.query.local !== undefined) {
          return cb();
        }
        // search by keyword for each uplink
        let lstream: IUploadTarball = self.uplinks[up_name].search(options);
        // join streams
        lstream.pipe(stream, {end: false});
        lstream.on('error', function(err) {
          self.logger.error({err: err}, 'uplink error: @{err.message}');
          cb(), cb = function() {};
        });
        lstream.on('end', function() {
          cb(), cb = function() {};
        });

        stream.abort = function() {
          if (lstream.abort) {
            lstream.abort();
          }
          cb(), cb = function() {};
        };
      },
      // executed after all series
      function() {
        // attach a local search results
        let lstream: IReadTarball = self.localStorage.search(startkey, options);
        stream.abort = function() {
          lstream.abort();
        };
        lstream.pipe(stream, {end: true});
        lstream.on('error', function(err) {
          self.logger.error({err: err}, 'search error: @{err.message}');
          stream.end();
        });
      });

    return stream;
  }

  /**
   * Retrieve only private local packages
   * @param {*} callback
   */
  getLocalDatabase(callback: Callback) {
    let self = this;
    this.localStorage.localData.get((err, locals) => {
      if (err) {
        callback(err);
      }

      let packages = [];
      const getPackage = function(itemPkg) {
        self.localStorage.getPackageMetadata(locals[itemPkg], function(err, info) {
          if (_.isNil(err)) {
            const latest = info[DIST_TAGS].latest;

            if (latest && info.versions[latest]) {
              packages.push(info.versions[latest]);
            } else {
              self.logger.warn( {package: locals[itemPkg]}, 'package @{package} does not have a "latest" tag?' );
            }
          }

          if (itemPkg >= locals.length - 1) {
            callback(null, packages);
          } else {
            getPackage(itemPkg + 1);
          }
        });
      };

      if (locals.length) {
        getPackage(0);
      } else {
        callback(null, []);
      }
    });
  }

  /**
   * Function fetches package metadata from uplinks and synchronizes it with local data
   if package is available locally, it MUST be provided in pkginfo
   returns callback(err, result, uplink_errors)
   */
  _syncUplinksMetadata(name: string, packageInfo: Package, options: any, callback: Callback): void {
    let exists = true;
    const self = this;
    const upLinks = [];
    if (!packageInfo || packageInfo === null) {
      exists = false;
      packageInfo = getDefaultMetadata(name);
    }

    for (let up in this.uplinks) {
      if (this.config.hasProxyTo(name, up)) {
        upLinks.push(this.uplinks[up]);
      }
    }

    async.map(upLinks, (upLink, cb) => {

      const _options = Object.assign({}, options);
      let upLinkMeta = packageInfo._uplinks[upLink.upname];

      if (isObject(upLinkMeta)) {

        const fetched = upLinkMeta.fetched;

        if (fetched && (Date.now() - fetched) < upLink.maxage) {
          return cb();
        }

        _options.etag = upLinkMeta.etag;
      }

      upLink.getRemoteMetadata(name, _options, (err, upLinkResponse, eTag) => {
        if (err && err.remoteStatus === 304) {
          upLinkMeta.fetched = Date.now();
        }

        if (err || !upLinkResponse) {
          // $FlowFixMe
          return cb(null, [err || createError(500, 'no data')]);
        }

        try {
          validate_metadata(upLinkResponse, name);
        } catch(err) {
          self.logger.error({
            sub: 'out',
            err: err,
          }, 'package.json validating error @{!err.message}\n@{err.stack}');
          return cb(null, [err]);
        }

        packageInfo._uplinks[upLink.upname] = {
          etag: eTag,
          fetched: Date.now(),
        };

        // added to fix verdaccio#73
        if ('time' in upLinkResponse) {
          packageInfo.time = upLinkResponse.time;
        }

        this._updateVersionsHiddenUpLink(upLinkResponse.versions, upLink);

        try {
          Storage._mergeVersions(packageInfo, upLinkResponse, self.config);

        } catch(err) {
          self.logger.error({
            sub: 'out',
            err: err,
          }, 'package.json parsing error @{!err.message}\n@{err.stack}');
          return cb(null, [err]);
        }

        // if we got to this point, assume that the correct package exists
        // on the uplink
        exists = true;
        cb();
      });
    }, (err: Error, upLinksErrors: any) => {
      assert(!err && Array.isArray(upLinksErrors));
      if (!exists) {
        return callback( ErrorCode.get404('no such package available')
          , null
          , upLinksErrors );
      }

      self.localStorage.updateVersions(name, packageInfo, function(err, packageJsonLocal: Package) {
        if (err) {
          return callback(err);
        }
        return callback(null, packageJsonLocal, upLinksErrors);
      });
    });
  }

  /**
   * Set a hidden value for each version.
   * @param {Array} versions list of version
   * @param {String} upLink uplink name
   * @private
   */
  _updateVersionsHiddenUpLink(versions: Versions, upLink: IProxy) {
    for (let i in versions) {
      if (Object.prototype.hasOwnProperty.call(versions, i)) {
        const version = versions[i];

        // holds a "hidden" value to be used by the package storage.
        // $FlowFixMe
        version[Symbol.for('__verdaccio_uplink')] = upLink.upname;
      }
    }
  }

  /**
   * Set up the Up Storage for each link.
   * @param {Object} config
   * @private
   */
  _setupUpLinks(config: Config) {
    for (let uplinkName in config.uplinks) {
      if (Object.prototype.hasOwnProperty.call(config.uplinks, uplinkName)) {
        // instance for each up-link definition
        const proxy: IProxy = new ProxyStorage(config.uplinks[uplinkName], config);
        proxy.upname = uplinkName;

        this.uplinks[uplinkName] = proxy;
      }
    }
  }

  /**
   * Function gets a local info and an info from uplinks and tries to merge it
   exported for unit tests only.
   * @param {*} local
   * @param {*} up
   * @param {*} config
   * @static
   */
  static _mergeVersions(local: Package, up: Package, config: Config) {
    // copy new versions to a cache
    // NOTE: if a certain version was updated, we can't refresh it reliably
    for (let i in up.versions) {
      if (_.isNil(local.versions[i])) {
        local.versions[i] = up.versions[i];
      }
    }

    for (let i in up[DIST_TAGS]) {
      if (local[DIST_TAGS][i] !== up[DIST_TAGS][i]) {
        if (!local[DIST_TAGS][i] || semver.lte(local[DIST_TAGS][i], up[DIST_TAGS][i])) {
          local[DIST_TAGS][i] = up[DIST_TAGS][i];
        }
        if (i === 'latest' && local[DIST_TAGS][i] === up[DIST_TAGS][i]) {
          // if remote has more fresh package, we should borrow its readme
          local.readme = up.readme;
        }
      }
    }
  }

}

export default Storage;
