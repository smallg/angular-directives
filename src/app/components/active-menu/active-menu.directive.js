(function () {
    'use strict';

    angular
        .module('jfy')
        .directive('activeMenu', activeMenu);

    function activeMenu() {
        var directive = {
            restrict: 'A',
            scope: {},
            link: linkFunc
        };
        return directive;

        function linkFunc(scope, ele) {
            angular.element(ele).find('li a').bind('click', function (e) {
                angular.element(".left-menu h4").removeClass('active');
                angular.element(e.target).parents().find('.panel.panel-open h4').addClass('active');
                angular.element(".left-menu ul li").removeClass('active');
                angular.element(e.target.parentNode).addClass('active');
            });
        }
    }
})();
