'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  version: '<a href="https://github.com/usgs/earthquake-latest-earthquakes' +
      '/blob/master/README.md">Version Info</a>'
};


/**
 * Sets up help view
 * @param options {object}
 */

var AboutView = function (options) {
  var _this,
      _initialize,

      _version;

  _this = View(options);

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
    _version = options.version || null;
  };

  /**
   * Destroy all the things.
   */
  _this.destroy = Util.compose(function () {
    _version = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
  * Creates markup for help page
  */
  _this.render = function () {
    var anssLogo,
        el,
        gsnLogo,
        nehrpLogo;

    anssLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAXCAMAAACbHilqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRF7QgS////XKTUnsfi8n6ADXG3zeX0hbvb9/7+NZHK/f746Pb3+MXDu9rs/vvpsml76lRcSpXIKYC//vn1/NvX+PT0dq/W5DI/9Pv58fj+8aSlYVaI/fz9uc/i2+72++/s/LeqQAAAAx1JREFUeNqsVNuypCoM5SISY9MtoIhuxP//y1loT9eeOrMfTtWkuwwQsshdyG9EXErhkgtR5LaXBf+bJFGhzLK6HNvNdi7/IPHm7+OmUqjgn7EEcmwHJRNDNxaOUqvMt0gW5r9BXWgsmemCwqZEZi4bvZeXuqybHjZwXJU/WfUNEU+D2v2PE0SXh1KmQ4fxEsN72fd/hWo6/XEgElycPiosOI4s47zv+wPBOx/gy6C1qTc0FZnS9+j8YZVKKoxMxSuPS0dKtXSrEGJd5KNx8bihuBmJr1fyE2JA0YWJMG9PZ4ZgKnE1wxCitEPadiGmburkvIq1m6Z5sNr0iBtCWh0HL5GQ56gcUs3iDkmOJUsd1DDAfReMCb1UJslJTJG3Re5ifVCJNQDKSY4LsfU0eAQ214qLzFHc+USin07Zw6ajsLVJab1oq3m6IAoBas9S1pB0ANSIFKRQvaojHj6CisiDiMu25bxtW1XGV290JmWsNaoOg4M1cOwYr1BNxwYoO+hcvT5cCs5jl2ywg8rOSVFtusmb4O1gfEr4YKOMQRq+QEFZ5cHNkIakvUYgVPBK2WS9gYJXsDVtYnQ39S/ztX691ld/vNbdYbG+nHbVvcL6sn3v0tf0Ciolq5RxQPPW2zQcKegAJ9z2iRXN6zrhJzr5EGKWnWhLJBwCsbcrESnQTqnm2dLDWR10CqPzvbGnpsLvuioE3Tk+OzEhPlMk4Imd9u4xdyinGXxv2FmpvtdoBdT6YbQNeeursa1mf0O1tzumZgw3ODon2DZfdSm60l18muWGpLU2jjJKZ5zTmWk0urX8B+qB+kNb7VN37lNzqK3OboLb+0l7490Ma7yvHFvTsOxRYa2ecjhaQ/5unBiXyBhS+RnL8sSwKvmEBj3PE+eF4nkuhClF3m+4nmGZrL6/DMy2QpLLJ1ZtzJUWAizboKGrZSVhbkHxmoKUI6CwZryF6dgvMApyDDNY8YG6TLy6EkbIa2DRtb86t9ztDwXlW8q5QTUn38RtqP13Xv1MEWlK/kfx/4HC1Ced/g0U0rKN/wSq8DPSyD+JfwkwAB0JQqS/aIPkAAAAAElFTkSuQmCC';
    gsnLogo = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAPAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8AAEQgAHgAZAwERAAIRAQMRAf/EAIMAAAICAwAAAAAAAAAAAAAAAAQHAAYCAwUBAAIDAQAAAAAAAAAAAAAAAAQFAQMGAhAAAgIBAwIFAgcAAAAAAAAAAQIDBAUAESESBjFBUSITYQeR0TJSkmMUEQABAwMCBAUFAQAAAAAAAAABABECIRIDMUFRYXEE8MHRIkKRsTJSkhP/2gAMAwEAAhEDEQA/AJ3Fj8pkfuB3ABlGqwjJ2I40eeRV2VizHYMNlXgfU60eOYjijR/aNlme8MzklGJaq013tY6eB2y0gW2fjjevJM8i8jobYSA8bdW3n4amknppxQ3Zf6RytKUiG80x4Ti5O38jHlojbzElSzPWyjgK5KRdUR6kblvr6+ugC94tpFxRaEgWl9WTK+WT95/HQDIlLTHZelX7szUb5GKq4t5SPoeuZSJGnVhyCOWXnR04EwFHpHfklsJxGWTlqlcHurM4yajiY1tpPYMcaVplVqorOIwGLP7t913Tfy8dX4MZEpU83VZyRMw2rI6BEi7alrvWaOX/ABWTHAW3ZCVdgxbbyUg7a5NZu+4RvwPRNjY+ulqJSO7l7P8AuNU74zd7HwLHVt3pbUBNqrGSrMQkgWSQEbqdjuORpvjz4TjiJagNoUh73t5mZIIieo9VnV7L+4T240vVYlkT31Yrdikyhnb2FVJc8NzwORxqDnxAUP0dUdn2maGV8hjUcRxV5qYe9S7byVeXHi/elgsV1yVeWqlaNp4+jpLyTq2ynYcoNvIaDOQGYLsHFK+ieXCw783DfdXr4f7I/wCa/noN0RcOIVfpi1A/c0VA1bc8tqWR7Nk9DRFlG0NmOVVYxKP0shIK+GrSxtd9PDJRjuicwhbImRqduUgfiNiKMhzXnlzEwoWFr3keh/vkX3UHAjQrvHJGQGI4j6H9Od9S9K8+q4tJyGwtL2XfpoNiP5Y8EJLWryR5ebD20r3ElmGfqssr1ZI3nYglwnSthFPHTyfPjnXQJo46eOCqlAETOOTSc3itpFx5fkEz+NBLSr//2Q==';
    nehrpLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAZCAMAAAB97TwtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRF32Fu7amw/fr7EkJw+ufpiqO5Ol6F9tTY8Le94HWA54uU88TJ0hgr09vk6ZOc997hbIikxtPd656m5efsx4ST0qu25IGM/PDx9MzQsbXF3cHK2+PqwEtb2EJR7/H1////g2bP9gAAACB0Uk5T/////////////////////////////////////////wBcXBvtAAAB3UlEQVR42oyUiXbjIAxFhcCsNqTEAdI01v//5UhOJ9NmOWd8vGB8gYf0ZKDnw6jYWuSrut8f4N4q5vbsqimH3MDiYyyvYVC3MU31ex+m5l/B/Zrl4cK4vZqOu6SoXsAO6j6v25UEAAhZNGD0z7CPFflL4maC4E3vIwN3UW/lCa4qI3mR4oFHoKgwofF9xEcY88iIsvkBjnplGc3hFmR0dA+wyS4Tn4TwSQVCKi5/2UMJDKb6AI9aMilPeArbApnMKDS0Pq4rHZe2bMftchR4D5HyJSNvf9HWatvrPM/hyC1tF+44TNJ7hqKA58vgTO7Z0IfWB61P86yu88qU1ZNgk7YHbXkfPrTAcSsMd4YtWr3OM+ywOQi8mklPZDWYznuXLDHczDcsM7fwyZrvsJ20/mGkbDhoyw4vmTVDsXYT2K6dSa2nf7BhmNWfAy1fJyrJkfn6IA7OZYnIMpaFfsIu7nEeNK7ZYPccQZRsjkqTPf+yaM/DSwY9dCpiJF6HouSbM7hdtgfYpyTZzcBDjCsoEWVvp/hsfswq3VxXoYrRWEcwr13HTE1kdj+7CCEENiq+8TPDbdwrpbs0zPtKkdXL/9Yge+m6UyjV3b+rO7+pbip/FzRe/hvt+b/xR4ABAEawWK3XrIaKAAAAAElFTkSuQmCC';

    el = _this.el;

    el.innerHTML = [
      '<h1>About Latest Earthquakes</h1>',
      '<small>' + _version + '</small>',
      '<ul class="no-style separator">',
        '<li>',
          '<i class="material-icons">list</i>',
          '<p>',
            'Clicking the list icon in the top right corner will load the ',
            'earthquake list.',
          '</p>',
        '</li>',
        '<li>',
          '<i class="material-icons">language</i>',
          '<p>',
            'Clicking the map icon in the top right corner will load the ',
            'map.',
          '</p>',
        '</li>',
        '<li>',
          '<i class="material-icons">settings</i>',
          '<p>',
            'Clicking the options icon in the top right corner lets you ',
            'change which earthquakes are displayed, and many other map ',
            'and list options.',
          '</p>',
        '</li>',
        '<li>',
          '<i class="material-icons">help_outline</i>',
          '<p>',
            'Clicking the about icon in the top right corner loads this page.',
          '</p>',
        '</li>',
        '<li>Bookmark to save your settings.</li>',
      '</ul>',
      // LINKS
      '<h2>Links</h2>',
      '<ul class="no-style separator">',
        '<li>',
          '<a href="/data/comcat/latest-eqs.php">',
            'About - Latest Earthquakes',
          '</a>',
        '</li>',
        '<li>',
          '<a href="/data/comcat/data-availability.php">',
            'Missing Earthquakes',
          '</a>',
        '</li>',
        '<li>',
          '<a href="/data/comcat/index.php">',
            'ANSS Comprehensive Earthquake Catalog (ComCat) Documentation',
          '</a>',
        '</li>',
        '<li>',
          '<a href="http://earthquake.usgs.gov/">',
            'Earthquake Hazards Program',
          '</a>',
        '</li>',
        '<li>',
          '<a href="/contactus/index.php">',
            'Contact Us',
          '</a>',
        '</li>',
      '</ul>',
      // LOGOS
      '<h2>In Partnership With</h2>',
      '<ul class="partners no-style separator">',
        '<li class="anss">',
          '<div class="row">',
            '<div class="column mobile-one-of-two logo-image">',
              '<img width="80" height="25" src="', anssLogo, '" ',
                  'aria-describedby="ANSS"/>',
            '</div>',
            '<div class="column mobile-one-of-two">',
              '<a href="/monitoring/anss/" ',
                  'title="Advanced National Seismic System" ',
                  'id="ANSS">',
                'ANSS - Advanced National Seismic System',
              '</a>',
            '</div>',
          '</div>',
        '</li>',
        '<li class="gsn">',
          '<div class="row">',
            '<div class="column mobile-one-of-two logo-image">',
              '<img width="25" height="30" src="', gsnLogo, '" ',
                  'aria-describedby="GSN"/>',
            '</div>',
            '<div class="column mobile-one-of-two">',
              '<a href="/monitoring/gsn/" ',
                'title="Global Seismographic Network" id="GSN">',
                'Global Seismographic Network',
              '</a>',
            '</div>',
          '</div>',
        '</li>',
        '<li class="nehrp">',
          '<div class="row">',
            '<div class="column mobile-one-of-two logo-image">',
              '<img width="44" height="25" src="', nehrpLogo, '" ',
                  'aria-describedby="NEHRP"/>',
            '</div>',
            '<div class="column mobile-one-of-two">',
              '<a href="http://www.nehrp.gov/" ',
                  'title="National Earthquake Hazards Reduction Program" ',
                  'id="NEHRP">',
                'NEHRP National Earthquake Hazards Reduction Program',
              '</a>',
            '</div>',
          '</div>',
        '</li>',
      '</ul>'
    ].join('');
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = AboutView;
