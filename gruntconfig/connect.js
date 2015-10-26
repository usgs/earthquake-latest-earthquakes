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
        config.build + '/' + config.src + '/htdocs'
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
      middleware: function (connect, options, middlewares) {
        middlewares.unshift(
          (function () {
            var gzip = require('connect-gzip');
            return gzip.gzip({
              matchType: /text|javascript|json|css/
            });
          })(),
          mountPHP(options.base[0]),
          rewriteRulesSnippet
        );
        return middlewares;
      }
    }
  },
  test: {
    options: {
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src + '/htdocs',
        'node_modules'
      ],
      port: config.testPort,
      open: 'http://localhost:' + config.testPort + '/test.html'
    }
  }
};

module.exports = connect;
