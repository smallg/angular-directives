/**
 * Created by dev on 2016/6/6.
 */
/*eslint-disable */
(function () {
    'use strict';

    angular
        .module('jfy')
        .directive('jfyMap', jfyMap);

    /** @ngInject */
    function jfyMap() {
        var template = '<div id="map-container">' +
            '<div id="map-content"></div>' +
            '<div id="top-content"></div>' +
            '</div>';
        var directive = {
            transclude: true,
            restrict: 'E',
            scope: {
                cities: '@',
                locations: '@'
            },
            compile: function (tElement) {
                tElement.html(template);
                return function (scope) {
                    var locations = null;
                    var cities = null;
                    var map;

                    function init() {
                        map = new BMap.Map('map-content');
                        map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_SMALL}));
                        map.enableScrollWheelZoom();
                        map.clearOverlays();
                    }

                    function getBoundary() {
                        var bdary = new BMap.Boundary();
                        map.clearOverlays();
                        for (var i = 1; i < cities.length; i++) {
                            bdary.get(cities[i].name, function (rs) {
                                var count = rs.boundaries.length;
                                for (var j = 0; j < count; j++) {
                                    var ply = new BMap.Polygon(rs.boundaries[j], {strokeWeight: 3, strokeColor: "#ff0000", strokeOpacity: "0.5", fillOpacity: "0.1"}); //建立多边形覆盖物
                                    map.addOverlay(ply);
                                }
                            });
                        }
                        bdary.get(cities[0].name, function (rs) {
                            var count = rs.boundaries.length;
                            for (var j = 0; j < count; j++) {
                                var ply = new BMap.Polygon(rs.boundaries[j], {strokeWeight: 3, strokeColor: "#ff0000", strokeOpacity: "0.5", fillOpacity: "0.1"}); //建立多边形覆盖物
                                map.addOverlay(ply);
                                map.setViewport(ply.getPath());
                            }
                        });
                    }

                    function makeMarkers() {
                        for (var m = 0; m < 5; m++) {
                            var point = new BMap.Point(locations[m].location.longitude, locations[m].location.latitude);
                            var marker = new BMap.Marker(point);
                            var label = new BMap.Label(m + 1, {offset: new BMap.Size(5, 2)});
                            label.setStyle({color: 'blue', fontWeight: 'bold', fontSize: "14px", border: 0, background: 0});
                            marker.setLabel(label);
                            map.addOverlay(marker);
                            addClickHandler(locations[m].name, locations[m].address, marker);
                        }

                        for (var n = 5; n < locations.length; n++) {
                            var point = new BMap.Point(locations[n].location.longitude, locations[n].location.latitude);
                            var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                                offset: new BMap.Size(10, 25),
                                imageOffset: new BMap.Size(0, 0 - 12 * 25)
                            });
                            var marker = new BMap.Marker(point, {icon: myIcon, title: n + 1});
                            map.addOverlay(marker);
                            addClickHandler(locations[n].name, locations[n].address, marker);
                        }
                    }

                    function addClickHandler(name, address, marker) {
                        marker.addEventListener("click", function (e) {
                            openInfo(name, address, e)
                        });
                    }

                    function openInfo(name, address, e) {
                        var opts = {
                            width: 100,
                            height: 50,
                            title: '<b>' + name + '</b>',
                            enableMessage: true
                        };
                        var p = e.target;
                        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                        var infoWindow = new BMap.InfoWindow('<b>' + address + '</b>', opts);
                        map.openInfoWindow(infoWindow, point);
                    }

                    function showRightTop() {
                        var topHtml = '';
                        for (var p = 0; p < 5; p++) {
                            topHtml += '<li data-longitude="' + locations[p].location.longitude + '" data-latitude="' + locations[p].location.latitude + '">' + (p + 1) + ': ' + locations[p].name + '</li>';
                        }
                        topHtml = '<ul id="top-five">' + topHtml + '</ul>';
                        jQuery('#top-content').html(topHtml);
                    }

                    function addTopMenuEvents() {
                        jQuery("#top-five li").bind('click', function () {
                            var currentLongitude = $(this).attr('data-longitude');
                            var currentLatitude = $(this).attr('data-latitude');
                            var mkrs = map.getOverlays();
                            for (var i = 0; i < mkrs.length; i++) {
                                if (mkrs[i].toString() === '[object Marker]') {
                                    mkrs[i].setAnimation('');
                                }
                            }
                            for (var j = 0; j < mkrs.length; j++) {
                                if (mkrs[j].toString() === '[object Marker]') {
                                    if (mkrs[j].point.lat == currentLatitude && mkrs[j].point.lng == currentLongitude) {
                                        var point = new BMap.Point(currentLongitude, currentLatitude);
                                        map.centerAndZoom(point, 15);
                                        mkrs[j].setAnimation(BMAP_ANIMATION_BOUNCE);
                                    }
                                }
                            }
                        });
                    }

                    scope.$on('init-map', function (e, d) {
                        locations = d.locations;
                        cities = d.cities;
                        init();
                        getBoundary();
                        makeMarkers();
                        showRightTop();
                        addTopMenuEvents();
                    });
                };
            }
        };
        return directive;
    }
})();