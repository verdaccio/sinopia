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
    const protocol = getWebProtocol(req.get(HEADERS.FORWARDED_PROTO), req.protocol);
    const host = req.get('host');
    const { url_prefix } = config;
    const uri = `${protocol}://${host}`;
    const base = combineBaseUrl(protocol, host, url_prefix);
    const primaryColor = _.get(config, 'web.primary_color') ? config.web.primary_color : '';
    const title = _.get(config, 'web.title') ? config.web.title : WEB_TITLE;
    const scope = _.get(config, 'web.scope') ? config.web.scope : '';
    const options = { uri, protocol, host, url_prefix, base, primaryColor, title, scope };

    const webPage = template
      .replace(/ToReplaceByVerdaccioUI/g, JSON.stringify(options))
      .replace(/ToReplaceByVerdaccio/g, base)
      .replace(/ToReplaceByPrefix/g, url_prefix)
      .replace(/ToReplaceByVersion/g, pkgJSON.version)
      .replace(/ToReplaceByTitle/g, title)
      .replace(/ToReplaceByLogo/g, logoURI)
      .replace(/ToReplaceByPrimaryColor/g, primaryColor)
      .replace(/ToReplaceByScope/g, scope);

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
