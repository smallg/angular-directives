/**
 * Created by dev on 2016/4/8.
 */
(function () {
    'use strict';

    angular
        .module('jfy')
        .directive('printReceipt', printReceipt);

    function printReceipt($window, toastr) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };
        return directive;

        function linkFunc(scope, ele, attrs) {
            var data = scope.$eval(attrs.printReceipt);
            var popupWindow;
            var drugList = '';
            if (data.drugList && data.drugList.length > 0) {
                for (var i = 0; i < data.drugList.length; i++) {
                    drugList += '<li><span class="name">' + data.drugList[i].name + '</span><span class="specification">' + data.drugList[i].specification + '</span><div class="usage">' + data.drugList[i].usage + '</div></li>';
                }
            }
            var innerContents = '<div class="title"><span><p>' + data.store + '</p><p>处方笺</p></span><div><table><tbody><tr><td>普通处方</td></tr><tr><td>当日有效</td></tr></tbody></table></div></div>' +
                '<table class="info"><tbody><tr><td colspan="4"><span>门诊就诊号：<span class="value">' + data.id + '</span></span><span class="pull-right">' + data.date + '</span></td></tr>' +
                '<tr><td>姓名：<span>' + data.name + '</span></td><td>性别：<span>' + data.gender + '</span></td><td>年龄：<span>' + data.age + '</span></td><td>费别：<span>' + data.type + '</span></td></tr>' +
                '<tr><td colspan="2">临床诊断：<span>' + data.diagnose + '</span></td><td colspan="2">科别：<span>' + data.division + '</span></td></tr></tbody></table>' +
                '<div class="rp">' + data.rp + '</div>' +
                '<div class="drug-list"><ol>' + drugList + '</ol></div>' +
                '<table class="sign"><tbody><tr><td colspan="2">医师：<span class="value">' + data.doctor + '</span></td><td colspan="2">药品金额：<span class="value">' + data.total + '</span></td></tr>' +
                '<tr><td>审核：<span class="value">' + data.check + '</span></td><td>调配：<span class="value">' + data.deploy + '</span></td><td>核对：<span class="value">' + data.verify + '</span></td><td>发药：<span class="value">' + data.send + '</span></td></tbody></table>';
            var customStyles = '<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">' +
                '<style>@media print and (min-width:350px){*{font-size:12px}body,html{margin:0;padding:0}.pull-right{float:right}.title{position:relative}.title span{font-weight:700;text-align:center;width:100%;display:inline-block}.title span p{font-size:18px;margin:5px 0}.title span p+p{font-size:16px;font-weight:400}.title>div{position:absolute;right:0;top:0}.title>div table{border:1px solid #000}.title>div table tbody tr:first-child{border-bottom:2px solid #000}table.info tr,table.sign tr{border-bottom:1px solid #000}.title>div table tbody tr td{padding:2px 5px;font-weight:700}table{border-spacing:0;border-collapse:collapse;width:100%}table td,table td span{font-size:14px}table.info tr td{padding:8px 5px}table.info tr td:not(:last-child){border-right:1px solid #000}.rp{margin:10px 0 0 10px;font-size:16px;font-weight:700}.drug-list ol{margin:5px 0;padding-left:30px}.drug-list ol li{padding:5px 0}.drug-list ol li span+span{margin-left:50px}.drug-list ol li span{font-size:12px}.drug-list ol li .usage{margin-top:10px}table.sign tr td{padding:8px 5px}}@media print and (max-width:350px){@page{padding:0;margin:0}*{font-size:8px}body,html{margin:0;padding:0}.pull-right{float:right}.title{position:relative}.title span{font-weight:700;text-align:center;width:100%;display:inline-block}.title span p{font-size:12px;margin:5px 0}.title span p+p{font-size:10px;font-weight:400}.title>div{position:absolute;right:0;top:0}.title>div table{border:1px solid #000}.title>div table tbody tr:first-child{border-bottom:2px solid #000}table.info tr,table.sign tr{border-bottom:1px solid #000}.title>div table tbody tr td{padding:2px 5px;font-weight:700}table{border-spacing:0;border-collapse:collapse;width:100%}table td,table td span{font-size:10px}table.info tr td{padding:8px 5px}table.info tr td:not(:last-child){border-right:1px solid #000}.rp{margin:10px 0 0 10px;font-size:14px;font-weight:700}.drug-list ol{margin:5px 0;padding-left:30px}.drug-list ol li{padding:5px 0}.drug-list ol li span+span{margin-left:50px}.drug-list ol li span{font-size:9px}.drug-list ol li .usage{margin-top:10px}table.sign tr td{padding:8px 5px}}</style>';
            var customScripts = '<script>function printAndClose(){window.print();setTimeout(function(){window.close();},0)}</script>';
            angular.element(ele).bind('click', function () {
                popupWindow = $window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWindow.document.open();
                popupWindow.document.write('<html><head>' + customStyles + '</head><body onload="printAndClose();">' + innerContents + customScripts + '</body></html>');
                popupWindow.document.close();
            })
        }
    }
})();
