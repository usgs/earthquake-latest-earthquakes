'use strict';

var EventSummaryFormat = require('summary/EventSummaryFormat'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (data) {
    var eventSummaryFormat,
        markup;

    eventSummaryFormat = EventSummaryFormat();
    markup = eventSummaryFormat.format(data.features[0]);

    document.querySelector('#event-summary-format-example').appendChild(markup);
  },
  error: function (e) {
    document.querySelector('#event-summary-format-example').innerHTML = [
      '<p class="alert error">',
        'Failed to create a download view.',
        '</p>'
    ].join('');
    console.log(e);
  }
});
