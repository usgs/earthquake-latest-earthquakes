'use strict';

var EventSummaryView = require('summary/EventSummaryView'),
    Model = require('mvc/Model'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (data) {
    var eventSummaryView,
        markup;

    eventSummaryView = EventSummaryView({
      el: document.getElementById('event-summary-view-example'),
      model: Model({
        'event': data.features[0]
      })
    });
    eventSummaryView.onEventSelect();
  },
  error: function (e) {
    document.querySelector('#event-summary-view-example').innerHTML = [
      '<p class="alert error">',
        'Failed to create a EventSummaryView.',
        '</p>'
    ].join('');
    console.log(e);
  }
});
