/**
 * <scanner-detect></scanner-detect>
 */
(function () {
    'use strict';

    angular
        .module('jfy')
        .directive('scannerDetect', scannerDetect);

    /** @ngInject */
    /** @ngInject */
    function scannerDetect(toastr, $document, $log) {
        var directive = {
            restrict: 'E',
            replace: true,
            template: '<scanner-detect-plugin></scanner-detect-plugin>',
            compile: function () {
                return {
                    pre: function preLink(scope, ele) {
                        ele.replaceWith('<object id="scanner-detect" type="application/x-barcodescanner"></object>');
                    },
                    post: function postLink(scope) {
                        var obj = $document[0].getElementById('scanner-detect');

                        addEvent(obj, "exception", function (json) {
                            $log.warn(json.message);
                        });
                        addEvent(obj, "scannerConnected", function (json) {
                            $log.info('scanner connected ' + json);
                        });
                        addEvent(obj, "barcodeRead", function (barcode) {
                            scope.$emit('bar-code', barcode.replace(/\r\n/g, ''));
                        });
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
