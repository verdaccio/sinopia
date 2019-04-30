/**
 * @prettier
 */

import _ from 'lodash';
import fs from 'fs';

import path from 'path';
import express from 'express';

import { combineBaseUrl, getWebProtocol, isHTTPProtocol } from '../../lib/utils';
import Search from '../../lib/search';
import { HEADERS, HTTP_STATUS, WEB_TITLE } from '../../lib/constants';
import loadPlugin from '../../lib/plugin-loader';

const { setSecurityWebHeaders } = require('../middleware');
const pkgJSON = require('../../../package.json');

export function loadTheme(config) {
  if (_.isNil(config.theme) === false) {
    return _.head(
      loadPlugin(
        config,
        config.theme,
        {},
        function(plugin) {
          return _.isString(plugin);
        },
        'verdaccio-theme'
      )
    );
  }
}

const sendFileCallback = next => err => {
  if (!err) {
    return;
  }
  if (err.status === HTTP_STATUS.NOT_FOUND) {
    next();
  } else {
    next(err);
  }
};

module.exports = function(config, auth, storage) {
  Search.configureStorage(storage);
  /* eslint new-cap:off */
  const router = express.Router();

  router.use(auth.webUIJWTmiddleware());
  router.use(setSecurityWebHeaders);
  const themePath = loadTheme(config) || require('@verdaccio/ui-theme')();
  const indexTemplate = path.join(themePath, 'index.html');
  const template = fs.readFileSync(indexTemplate).toString();

  // Logo
  let logoURI = _.get(config, 'web.logo') ? config.web.logo : '';
  if (logoURI && !isHTTPProtocol(logoURI)) {
    // URI related to a local file

    // Note: `path.join` will break on Windows, because it transforms `/` to `\`
    // Use POSIX version `path.posix.join` instead.
    logoURI = path.posix.join('/-/static/', path.basename(logoURI));
    router.get(logoURI, function(req, res, next) {
      res.sendFile(path.resolve(config.web.logo), sendFileCallback(next));
    });
  }

  // Static
  router.get('/-/static/*', function(req, res, next) {
    const filename = req.params[0];
    const file = `${themePath}/${filename}`;
    res.sendFile(file, sendFileCallback(next));
  });

  function renderHTML(req, res) {
    const base = combineBaseUrl(getWebProtocol(req.get(HEADERS.FORWARDED_PROTO), req.protocol), req.get('host'), config.url_prefix);
    const webPage = template
      .replace(/ToReplaceByVerdaccio/g, base)
      .replace(/ToReplaceByVersion/g, pkgJSON.version)
      .replace(/ToReplaceByTitle/g, _.get(config, 'web.title') ? config.web.title : WEB_TITLE)
      .replace(/ToReplaceByLogo/g, logoURI)
      .replace(/ToReplaceByPrimaryColor/g, _.get(config, 'web.primary_color') ? config.web.primary_color : '')
      .replace(/ToReplaceByScope/g, _.get(config, 'web.scope') ? config.web.scope : '');

    res.setHeader('Content-Type', HEADERS.TEXT_HTML);

    res.send(webPage);
  }

  router.get('/-/web/:section/*', function(req, res) {
    renderHTML(req, res);
  });

  router.get('/', function(req, res) {
    renderHTML(req, res);
  });

  return router;
};
