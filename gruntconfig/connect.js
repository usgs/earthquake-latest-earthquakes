'use strict';

var config = require('./config');

var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
var gateway = require('gateway');


var mountPHP = function (dir, options) {
    options = options || {
        '.php': 'php-cgi',
        'env': {
            'PHPRC': process.cwd() + '/node_modules/hazdev-template/dist/conf/php.ini'
        }
    };
    return gateway(require('path').resolve(dir), options);
};

var connect = {
  options: {
    hostname: '*'
  },
  rules: [
    {from: '^/theme/(.*)$', to: '/hazdev-template/dist/htdocs/$1'}
  ],
  dev: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs',
        '.tmp',
        'node_modules'
      ],
      port: config.devPort,
      open: 'http://localhost:' + config.devPort,
      middleware: function (connect, options, middlewares) {
        middlewares.unshift(
          mountPHP(options.base[0]),
          rewriteRulesSnippet
        );
        return middlewares;
      }
    }
  },
  dist: {
    options: {
      base: [config.dist + '/htdocs'],
      port: config.distPort,
      open: 'http://localhost:' + config.distPort,
      keepalive: true,
      middleware: function (connect, options) {
        return [
          (function () {
            var gzip = require('connect-gzip');
            return gzip.gzip({
              matchType: /text|javascript|json|css/
            });
          })(),
          mountPHP(options.base),
          mountFolder(connect, options.base),
          rewriteRulesSnippet,
          mountFolder(connect, 'node_modules')
        ];
      }
    }
  },
  test: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs',
        config.build + '/' + config.test,
        'node_modules',
        '.tmp'
      ],
      port: config.testPort,
      open: 'http://localhost:' + config.testPort
    }
  }
};

module.exports = connect;
