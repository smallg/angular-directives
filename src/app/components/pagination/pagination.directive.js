/**
 * <jfy-pagination class="pagination" total-pages="bm.totalPages" page-size="bm.pageSize" total-size="bm.total" query-function="bm.search(start,pageSize)"></jfy-pagination>
 * <jfy-pagination class="pagination" data="anp.drugs" paged-data="pagedItems" page-size="anp.pageSize" client-mode="true"></jfy-pagination>
 */
(function () {
    'use strict';

    angular
        .module('jfy')
        .directive('jfyPagination', jfyPagination);

    /** @ngInject */
    function jfyPagination($filter) {
        var template = '<div class="left" ng-show="totalPages>=1">总共{{totalPages}}页，总共{{totalSize}}记录</div><div class="pull-right"><ul class="pagination" ng-show="totalPages>1"><li ng-class="{active:( currentPage < 1)}"><a href ng-click="previousPage()">{{lblPre}}</a></li>' +
            '<li ng-repeat="n in pages" ng-class="{active: n == currentPage}"><a href ng-click="setPage(n)" ng-bind="n + 1">1</a></li>' +
            '<li ng-class="{active:(currentPage == totalPages-1)}"><a href ng-click="nextPage()" >{{lblNxt}}</a></li></ul></div>';
        var directive = {
            transclude: true,
            restrict: 'E', // only activate on element
            scope: {
                queryFunction: '&',
                totalPages: '@',
                data: '@',
                pagedData: '=',
                totalSize: '@',
                pageSize: '@',
                maxTabs: '@',
                lblPre: '@labelPrevious',
                lblNxt: '@labelNext'
            },
            compile: function (tElement) {
                tElement.html(template);
                return function (scope, element, attrs) {
                    scope.$on('refreshTotalSize', function (e, v) {
                        scope.$parent.totalSize = scope.totalSize = v;
                    });
                    scope.$on('goToFirstPage', function () {
                        scope.$parent.currentPage = scope.currentPage = 0;
                    });
                    var clientMode = angular.isDefined(attrs.clientMode) ? true : false;
                    scope.$parent.currentPage = scope.currentPage = 0;
                    var data = [];
                    var initialized = false;
                    var navigate = clientMode ? navigateClient : navigateServer;

                    if (clientMode) {
                        scope.$parent.$watch(attrs.data, function () {
                            data = scope.$parent.$eval(scope.data) || [];
                            scope.$parent.totalPages = scope.totalPages = Math.ceil(data.length / scope.pageSize);
                            calculatePages();
                            scope.setPage(0);
                        });
                    } else {
                        scope.$parent.$watch(attrs.totalPages, function () {
                            scope.$parent.totalPages = scope.totalPages = scope.$parent.$eval(attrs.totalPages);
                            scope.$parent.totalSize = scope.totalSize = scope.$parent.$eval(attrs.totalSize);
                            calculatePages();
                        });
                    }

                    scope.$watch('currentPage', function () {
                        if (initialized) {
                            calculatePages();
                        }
                    });

                    function init() {
                        initialized = false;
                        if (!scope.pageSize) {
                            scope.pageSize = 10;
                        } else {
                            scope.pageSize = scope.$parent.$eval(scope.pageSize);
                        }
                        if (clientMode) {
                            scope.pagedData = scope.$parent.$eval(scope.pagedData);
                        }
                        if (!scope.maxTabs) {
                            scope.maxTabs = 10;
                        } else {
                            scope.maxTabs = scope.$parent.$eval(scope.maxTabs);
                        }
                        if (!scope.lblPre) {
                            scope.$parent.lblPre = scope.lblPre = '上一页';
                        }
                        if (!scope.lblNxt) {
                            scope.$parent.lblNxt = scope.lblNxt = '下一页';
                        }
                        initialized = true;
                    }

                    function calculatePages() {
                        if (!initialized) {
                            init();
                        }
                        if (!scope.totalPages) {
                            return;
                        }
                        var pagesToGo = (scope.totalPages - scope.currentPage);
                        var startPage, endPage;
                        if (pagesToGo >= scope.maxTabs) {
                            startPage = scope.currentPage;
                            endPage = scope.currentPage + (scope.maxTabs - 1);
                        } else {
                            startPage = scope.totalPages - scope.maxTabs;
                            endPage = scope.totalPages - 1;
                        }
                        scope.$parent.pages = scope.pages = [];
                        var i;
                        for (i = startPage; i <= endPage; i++) {
                            if (i >= 0) {
                                scope.pages.push(i);
                            }
                        }
                        if (i <= scope.currentPage) {
                            scope.$parent.currentPage = scope.currentPage = i - 1;
                        }
                    }

                    function navigateClient() {
                        scope.pagedData = scope.$parent.pagedData = angular.copy($filter('limitTo')(data.slice(scope.currentPage * scope.pageSize), scope.pageSize));
                    }

                    function navigateServer() {
                        scope.queryFunction({start: scope.currentPage, pageSize: scope.pageSize});
                    }

                    scope.$parent.setPage = scope.setPage = function (page) {
                        scope.$parent.currentPage = scope.currentPage = page;
                        navigate();
                    };

                    scope.$parent.previousPage = scope.previousPage = function () {
                        if (!scope.currentPage || scope.currentPage < 1) {
                            return;
                        }
                        scope.$parent.currentPage = scope.currentPage -= 1;
                        navigate();
                    };

                    scope.$parent.nextPage = scope.nextPage = function () {
                        if (scope.currentPage == scope.totalPages - 1) {
                            return;
                        }
                        scope.$parent.currentPage = scope.currentPage += 1;
                        navigate();
                    };
                };
            }
        };
        return directive;
    }
})();
