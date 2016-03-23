/**
 * <input type="text" class="form-control" input-enter="mm.search(0)" ng-model="bm.test"/>
 */
(function () {
    'use strict';

    angular
        .module('jfy')
        .directive('inputEnter', inputEnter);

    function inputEnter() {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };
        return directive;

        function linkFunc(scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.inputEnter);
                    });

                    event.preventDefault();
                }
            });
        }
    }
})();
