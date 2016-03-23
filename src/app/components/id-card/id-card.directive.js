/**
 * <id-card-plugin></id-card-plugin>
 */
(function () {
    'use strict';

    angular
        .module('jfy')
        .directive('idCardPlugin', idCardPlugin);

    /** @ngInject */
    function idCardPlugin(toastr, $document, $log) {
        var directive = {
            restrict: 'E',
            replace: true,
            template: '<idcard></idcard>',
            compile: function () {
                return {
                    pre: function preLink(scope, ele) {
                        ele.replaceWith('<object id="idCard" type="application/x-idcardinformationfetcher"></object>');
                    },
                    post: function postLink(scope) {
                        var obj = $document[0].getElementById('idCard');

                        addEvent(obj, "exception", function (json) {
                            $log.warn(json.message);
                        });
                        addEvent(obj, "connected", function () {
                            obj.detect();
                        });
                        addEvent(obj, "cardRead", function (json) {
                            scope.$emit('read-card', json.message);
                        });
                        addEvent(obj, 'cardRemoved', function () {
                            scope.$emit('card-removed');
                        });
                        if (obj.connect) {
                            obj.connect();
                        }
                    }
                }
            }
        };
        return directive;
    }

    var addEvent = function (obj, name, func) {
        if (obj.addEventLister) {
            obj.addEventListener(name, func, false);
        } else if (obj.attachEvent) {
            obj["on" + name] = func;
        } else {
            obj["on" + name] = func;
        }
    };
})();
