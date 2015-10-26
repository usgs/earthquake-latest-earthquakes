/* global define */

// earthquake app updated to use states
define([
  'mvc/Util',
  'mvc/Events',
  'mvc/Application',
  'eq/Catalog',
  'eq/Settings',
  'eq/ListView',
  'eq/MapView',
  'eq/SettingsView',
  'eq/EventSummaryView',
  'eq/ModesView',
  'eq/DefaultState',
  'eq/MessageView',
  'mvc/ModalView',
  'eq/EarthquakeAppSettings',
  'eq/UrlManager'
], function(
  Util,
  Events,
  Application,
  Catalog,
  Settings,
  ListView,
  MapView,
  SettingsView,
  EventSummaryView,
  ModesView,
  DefaultState,
  MessageView,
  ModalView,
  EarthquakeAppSettings,
  UrlManager
){
  'use strict';


  var EarthquakeApp = function(options) {
    // take over the page
    var body = document.getElementsByTagName('body')[0];
    Util.empty(body);

    var _this = this;
    var _settings = new EarthquakeAppSettings(
      Util.extend({},
        (options && options.hasOwnProperty('settings')) ?
          options.settings : {},
        {
          'defaults': {
            'autoUpdate': !Util.isMobile()
          }
        }
      )
    );
    var _catalog = new Catalog({
      feed: _settings.getFeed(),
      host: _settings.getOptions('searchHost'),
      settings: _settings,
      app: _this
    });
    var _states = {
      'default': new DefaultState()
    };
    var _initialState = 'default';

    // expose these for states, for now
    this.catalog = _catalog;
    this.settings = _settings;


    Application.call(this, {
      'states': _states
    });

    body.appendChild(this.getEl());

    // some of the styles use this, from when multiple states exist.
    // may need to change this in the future if there are multiple application states
    Util.addClass(body, 'default');

    // set class based on whether in desktop or mobile
    Util.addClass(body, Util.isMobile() ? 'mobile' : 'desktop');

    (function() {
      var loading = _this.setLoading(true);
      loading.firstChild.appendChild(document.createElement('p')).innerHTML =
        'Having trouble?<br/><a href="doc_help.php#browser-support">Supported Browsers</a>';
    })();

    this.revertToDefaultFeed = function (silent) {
    // if not a custom search, load default feed
    _settings.set({'feed': _settings.getOptions('feeds')[0].id});

    if (!silent) {
      // Tell user we changed feed
      _messageView.addMessage('Switched to default feed', 3000, 'warning');
    }
  };

  // logic for creating different views
  this.createView = function(name /*, callback */) {
    if (name === 'list') {
      return new ListView({
        app: this,
        settings: _settings,
        collection: _catalog
      });
    } else if (name === 'map') {
      return new MapView({
        settings: _settings,
        collection: _catalog
      });
    } else if (name === 'settings') {
      return new SettingsView({
        settings: _settings
      });
    } else if (name === 'eventsummary') {
      return new EventSummaryView({
        settings: _settings,
        collection: _catalog
      });
    } else if (name === 'modes') {
      return new ModesView({
        'settings': _settings
      });
    } else if (name === 'message') {
      return new MessageView();
    } else {
      return null;
    }
  };

  // set up views in header and footer
  this.getHeader().innerHTML = [
    '<a href="/" class="logo">',
      '<img alt="USGS" src="', EarthquakeApp.RETINA_USGS_LOGO, '" width="95" height="25"/>',
    '</a>'
  ].join('');

  var _modeChange = function() {
    var status = _settings.get('viewModes');
    for (var id in status) {
      var className = 'mode-' + id;
      if (status[id]) {
        Util.addClass(_this.getEl(), className);
      } else {
        Util.removeClass(_this.getEl(), className);
      }
    }
  };

  _settings.on('change:viewModes', _modeChange);

  // deselect an earthquake on reset to defaults
  _settings.on('reset', (function(c){
    return function(){
      c.deselect();
    };
  })(_catalog));

  // event for user resetting to defaults
  _settings.on('reset', function (message) {
    _messageView.addMessage(message, 3000, 'success');
  });

  // creating the modes view below triggers a change:viewModes event
  this.getHeader().appendChild(this.getView('modes')._el);
  this.getFooter().appendChild(this.getView('eventsummary')._el);
  this.getFooter().appendChild(this.getView('message')._el);

  // catalog messages
  var _messageView = this.getView('message');
  var _loadingMessage = null;

  _catalog.on('fetching', function() {
    if (_loadingMessage !== null) {
      _loadingMessage.remove();
      _loadingMessage = null;
    }
    // TODO: customize based on feed?
    _loadingMessage = _messageView.addMessage('Loading earthquakes');
  });

  _catalog.on('reset', function(data) {
    if (_loadingMessage !== null) {
      _loadingMessage.remove();
      _loadingMessage = null;
    }
    if (data.loadAnyway === true) {
      // set autoupdate off
      _settings.set({autoUpdate: false});
    }

    if (!_catalog.isError()) {
      _messageView.addMessage('Earthquakes updated', 3000, 'success');
      // when the earthquake is updated, update the page title
      var feed=_settings.getFeed();

      if (feed && feed.name) {
        document.title=feed.name;
      } else {
        document.title='Earthquakes';
      }
    }
  }, this);

  // auto update and feed settings
  var _autoUpdateInterval = null;

  var _setAutoUpdateInterval = function() {
    if (_autoUpdateInterval !== null) {
      // remove any existing interval
      clearInterval(_autoUpdateInterval);
      _autoUpdateInterval = null;
    }

    if (_settings.get('autoUpdate')) {
      // user requested auto update

      var feed = _catalog.getFeed();
      if (feed.hasOwnProperty('autoUpdate') && feed.autoUpdate) {
        // and feed supports auto update

        // set update interval
        _autoUpdateInterval = setInterval(function() {
          _catalog.fetch();
          // TODO: anything else?
        }, feed.autoUpdate);
      }
    }
  };

  _settings.on('change:feed', function() {
    _catalog.setFeed(_settings.getFeed());
    _catalog.fetch();
    _setAutoUpdateInterval();
  });

  _settings.on('change:autoUpdate', function() {
    // TODO: trigger fetch first if now-generated > autoUpdate?
    _setAutoUpdateInterval();
  });

  // map geolocation error
  Events.on('locationError', function(e) {
    _messageView.addMessage(e.message, 3000, 'error');
  });

  // on a URL change, update the settings
  Events.on('hashchange', function(/* e */) {
    // parse URL into anonymous object
    var newSettings = UrlManager.parseUrl();

    if (newSettings === null) {
      _settings.reset({ninja: true});
    } else {
      // update the settings object, with url hash values
      _settings.set(newSettings);
    }
  });

  // enter default state
  this.setState(_initialState);

  // do initial fetch
  _catalog.fetch();
  _setAutoUpdateInterval();

  // will update modes if set in URL
  _modeChange();

};

  EarthquakeApp.RETINA_USGS_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAAyCAYAAADiBmE+AAAHHklEQVR42u2d6bGkIBCAJ4QJwRAmBEMwBEIwBDIwBEMwBEIwBEMghN4/+IbnevQFwsyjamq3tlZsm4++QHw8Ho8HALSV/l6Pi0bo6/kgNAB4Yvsm9tsBwAAADgA8nLcZACYA6AGgeSi18GxYOXz4PxYzHgw5DFEfY7jmiblBrc0pPhsV0BbbMaKvJgyYl+qD+hwJ5FgAwAiBb8OElrbx1CD8gX8f+MGaabeBAZtVlmGheoBg4acE+jB/4BcCfhjkOaFuRgJsLqEcBinHK0yWVG34A78M8OcM+hkQz5FDDoOYfD6DHN0ngL9gYC0R/ARhxVlrModZR+11IofLJIP/lfRWCP2ArcKUBn5IIHO2USq/UpsLkaOvEfyFAWhp4A+MZx5Cic5wqi5KVnYtWbbhT071p9uRg5rMzuH+XSjjjuwJ+GlWvnDwKQnccJIIeu6zhevFMTqjCjPtXK8hB9VrPGsA/9DKA2LRpiTwiWHOpHV/ALACr9MjEtOFDN17sY71DMK8qS0d/F0rH5Q91FbVIcKKWZXGAjcwr1uQujAcPRNhfSIW32iTOcRNDnDLwndb+TYauNrAt9RrLmTAhhlOBIhuSGmja7Dx+YyUYRZ5j6CcPlONl2rldwf0S8G3DPCNpteRQEdIsB1SBicCf2eAXUFW/ivAxyTyTPCx13iiPrCMTIxrFmUPaE93M27+vU8YBlGs/LeAb5CxtUP8hlRWdpMwp5IFNT4EfZgVLnviqta6aRPKYHMmK3+1d2NGJoAlgd8T5PGc8q2iZR4fiRuxuuS0b94SLXOjFPoc1uURltESnq/Wqs46uZ/K44312jYD+D1RH2MO8JeNe5ijf38xVsywVn6WWvnCF7CAAb/mSyZQEPgvhj5GFWOwM4DjEVzwfiNmCkJ31JXIHFa+cPA5BsOD8OWOEsFnrGRfGk/OALI7i5KKIyGHI6slsfJQ4e5MkG3KctIB10yulcA3An1MbG8YwBvO3EcYrC5YZXOmfCC8x8q18lGeUeV+fEGYGHvlhjHWz1T6EMIvLZhYtVwoTIgJMeNayt6ZCBqule+iBK1W8J+g87bRQBlworfJCT51091ROGilgliGC26ikMdsJ0GUHzimld/bCVjzG1gag70OeF8z+Aohzza07jgzb0ZAbqPfGG7mgzXmDijWyn8E+MrwoypeGuAD4ViVg1+TAf41GnlKrby/iqOCxbdhMK9WXFEWC673e081g08wNirVHyXwpW9MWYRevaI+Wm5y4biZcwC3D30sG+s0XgxSd6EAVHxbOvjICU5OfmsFf1O80GqGCoe9sFRrqOOiEAh3ihUfAk+BtAbwCZNdBH8t4CfaH2YwcFzF25iKxE/JLVyDsc7m4kEnoB/1Vw340cQflAbb1gx+ZP21vGF3BodVdsc2imPHdR0g9PcKfx8uJpMnZ+qVgr/xqBru/qVZx88N/ua+0hKwh53jRThVFdIKG3MgD608ZjLUCj7Dwx7maEx9dCWBrxj+jL8qOhmSrhnep/BiqhgOrjezuU8HPxoHySFUrdZenbvBV+LymSvR+gV/BG+/SY5HuDjyejPjvwJ8hdLnqAj+UR2/zwW+AqN9jtLaIfyMJMd90gKWwNpRQ8ZFC3wFfVhlfTQMYzDlsPJnYY+5Ai5y8x+3cpt5Y9fqaf0ngc/c+7TksvJH8LfR4tYa5qyu0yJkqmblFpT3yQD9hOE2XIf1Fi4l+NqGg5p7rK7Cwz3NRwthSZKkhOB3d4If+hwqBr/XBJ/4bHDHabV78LeA/wzNCIQtFAljWlsA+C0DfKsNHBN8mwB8WxP4/4EXhTrxD7X6u6MMrDcbif2OlHiSqOcuIfiUF7ybhOBTzs18fTL4P3G/cuLjKIAS+sUmU46xamq1wy14bx+hjLcpIcYnGIJqwY8XrzpEGatXjoOxCjYciCkGQNnrcE96cIWAj/2e14x+rkLBj+P/aSfscYRyJsUqLnD9njC1dPZiliBbxMT3HICJFbw2BfjECeivwi4ix0Pp4KtYJGLVagb+iRCn4RPQXjL3cPJdAKIcg8BjecCdWGcY4M9K40J9eaX7FvA55dKtp5kZfRiB94kHPJZjYvTRCNcA1mraurM2XmsZiX3ZzfYTThgsGRevtemoBvBzfU7yMk6HtN9yResI8n558Qj85rb7fwP4AmsryU1eComxhhyNUq6iDj6j+CBt7xzuW8DPbOU6pRKrtBnEbk9/M/ipv/C+b4y+CfwMFtcDfp/NfCf0N8Jvb5Dhfw/8beAL97VfJV2UlU7Nd2u37py67yjnJkWruN2aPy7fCP7G+kuVPYFgtTnoXwO6GYQHvQZZxlTJPpycxL0ZEw2jdD4u8H6pucbfoPgyw/rVcHfidpf1viA8RkUgwwpRLEfzUG7wPiTYEUBc9bOWgg3wT+BeP0A4IYyTi8qcqD1d/wAO22SQ7bmhfQAAAABJRU5ErkJggg==';

  return EarthquakeApp;
});
