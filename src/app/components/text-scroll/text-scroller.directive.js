/**
 * <text-scroller items="items"></text-scroller>
 */
(function () {
    'use strict';

    angular
        .module('jfy')
        .directive('textScroller', textScroller);

    function textScroller() {
        var directive = {
            restrict: 'E',
            scope: {
                items: '='
            },
            template: '<div class="bar-code-content"><ul></ul></div>',
            link: linkFunc,
            controller: ScrollerController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        function linkFunc(scope, el, attr, vm) {
            scope.$watch(function () {
                return vm.items;
            }, function (newV) {
                if (newV == undefined) {
                    return;
                }
                var res = '<span>' + newV.substring(0, 5) + '</span><span>' + newV.substring(5, 10) + '</span><span>' + newV.substring(10, 15) + '</span><span>' + newV.substring(15) + '</span>';
                el.find('ul').css('bottom', '-30px').append('<li>' + res + '</li>');
                el.find('ul').animate({
                    bottom: '0px'

                }, 500);
            }, true);
        }

        function ScrollerController() {
        }
    }
})();
