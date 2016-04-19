'use strict';


var GenericCollectionView = require('core/GenericCollectionView');


var genericCollectionView;

genericCollectionView = GenericCollectionView({
  el: document.querySelector('#generic-collection-view-example')
});

genericCollectionView.collection.reset([
  {id: 'example-1', value: 'Example #1'},
  {id: 'example-2', value: 'Example #2'},
  {id: 'example-3', value: 'Example #3'},
  {id: 'example-4', value: 'Example #4'}
]);
