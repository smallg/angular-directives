(function() {
  'use strict';

  angular
    .module('angularDirectives')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
