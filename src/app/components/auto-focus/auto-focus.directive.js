(function () {
    'use strict';

    angular
        .module('ui')
        .directive('autoFocus', autoFocus);

    function autoFocus($timeout) {
        var directive = {
            restrict: 'A',
            scope: {
                trigger: '@autoFocus'
            },
            link: linkFunc
        };
        return directive;

        function linkFunc(scope, el) {
            scope.$watch('trigger', function (value) {
                if (value == 'true') {
                    $timeout(function () {
                        el[0].focus();
                    });
                }
            });
        }
    }
})();
