'use strict';

var config = require('./config');

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

  proxies: [
    {
      context: '/theme/',
      host: 'localhost',
      port: config.templatePort,
      rewrite: {
        '^/theme': ''
      }
    }
  ],

  dev: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs'
      ],
      livereload: config.liveReloadPort,
      middleware: function (connect, options, middlewares) {
        middlewares.unshift(
          require('grunt-connect-proxy/lib/utils').proxyRequest,
          mountPHP(options.base[0])
        );
        return middlewares;
      },
      open: 'http://localhost:' + config.devPort,
      port: config.devPort
    }
  },

  dist: {
    options: {
      base: [config.dist + '/htdocs'],
      port: config.distPort,
      open: 'http://localhost:' + config.distPort,
      middleware: function (connect, options, middlewares) {
        middlewares.unshift(
          require('grunt-connect-proxy/lib/utils').proxyRequest,
          (function () {
            var gzip = require('connect-gzip');
            return gzip.gzip({
              matchType: /text|javascript|json|css/
            });
          })(),
          mountPHP(options.base[0])
        );
        return middlewares;
      }
    }
  },

  example: {
    options: {
      base: [
        config.example,
        config.etc,
        config.build + '/' + config.src + '/htdocs'
      ],
      port: config.examplePort,
      open: 'http://localhost:' + config.examplePort + '/example.php',
      middleware: function (connect, options, middlewares) {
        middlewares.unshift(
          require('grunt-connect-proxy/lib/utils').proxyRequest,
          (function () {
            var gzip = require('connect-gzip');
            return gzip.gzip({
              matchType: /text|javascript|json|css/
            });
          })(),
          mountPHP(options.base[0])
        );
        return middlewares;
      }
    }
  },

  template: {
    options: {
      base: ['node_modules/hazdev-template/dist/htdocs'],
      port: config.templatePort,
      middleware: function (connect, options, middlewares) {
        middlewares.unshift(mountPHP(options.base[0]));
        return middlewares;
      }
    }
  },

  test: {
    options: {
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src + '/htdocs',
        config.etc,
        'node_modules'
      ],
      port: config.testPort
    }
  }
};

module.exports = connect;
