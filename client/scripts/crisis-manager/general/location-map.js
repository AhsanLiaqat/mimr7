(function () {
    'use strict';

    angular.module('app')
        .controller('locationMapCtrl', ['$scope',
            '$rootScope',
            'close',
            'incident',
            '$routeParams',
            '$http',
            'AuthService',
            '$location',
            '$timeout',
            'IncidentService',
            ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        incident,
        $routeParams,
        $http,
        AuthService,
        $location,
        $timeout,
        IncidentService) {

        function init() {
            // Properties initialization
            $scope.data = {
                locations: [""]
            };
            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
            $scope.icons = [
            {
                name: 'Schools',
                icon: iconBase + 'schools_maps.png',
                types: ['school'],
                show: false
            },

            {
                name: 'Hospital',
                icon: iconBase + 'hospitals_maps.png',
                types: ['hospital'],
                show: false
            }
            ];
            $scope.mapdata = {};

            $scope.incident = {};
            $scope.incident.id = incident.id;
            IncidentService.get($scope.incident.id).then(function(result){
                $scope.incident = result.data;
                if($scope.incident.locations.length > 0){
                    console.log('comes in')
                    $scope.noloc = true;
                    $scope.addloc = false;
                    $scope.showmap();

                }else{
                    $scope.addloc = true;
                    $scope.noloc = false;
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

            });
            // $http.get('/api/incidents/get?id=' + $scope.incident.id).then(function (result) {
             
            // });


        };

        init();
        $scope.showmap = function(){

             $timeout(function () {
                var location = $scope.incident.locations[0].geometry.location;

                // Draw basic map
                $scope.map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 13,
                    center: location
                });

                // Drawing tools on map
                var drawingManager = new google.maps.drawing.DrawingManager();
                drawingManager.setMap($scope.map);

                // Create the search box and link it to the UI element.
                var input = document.getElementById('pac-input');
                var searchBox = new google.maps.places.SearchBox(input);
                $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                // Bias the SearchBox results towards current map's viewport.
                $scope.map.addListener('bounds_changed', function () {
                    searchBox.setBounds($scope.map.getBounds());
                });

                // Markers for Schools and Hospitals
                _.each($scope.incident.locations, function (loc) {
                    var marker = new google.maps.Marker({
                        position: loc.geometry.location,
                        title: loc.address,
                        map: $scope.map
                    });
                });

                var legend = document.getElementById('legend');
                $scope.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

                $timeout(function () {
                    $("#legend").show();
                });
            }, 100);
        };
        var input = document.getElementById('locationInput');
        var inputs = document.getElementsByClassName("locations");
        $scope.close = function () {
            close();
        };

        function downloadCanvas(link, canvasId, filename) {
            link.href = document.getElementById(canvasId).toDataURL();
            link.download = filename;
        }

        $scope.exportPNG = function(){
        	html2canvas($('#map'), {
                useCORS: true,
                onrendered: function(canvas) {
                    var dataUrl= canvas.toDataURL("image/png");
                	window.open(dataUrl,"","width=700,height=700");
                }
            });
        };


        $scope.showMarkers = function (type, place_types, icon, radius) {
            radius = radius || 50000;
            if (!$scope.mapdata[type]) {
                $scope.mapdata[type] = [];
            }
            if ($scope.mapdata[type].length) {
                _.each($scope.mapdata[type], function (marker) {
                    marker.setMap($scope.map);
                });
                return;
            }

            var request = {
                location: $scope.incident.locations[0].geometry.location,
                radius: radius,
                types: place_types
            };
            var service = new google.maps.places.PlacesService($scope.map);

            function callback(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                }
            }

            // Places map markers
            function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    icon: icon,
                    position: place.geometry.location,
                    title: place.name
                });
                $scope.mapdata[type].push(marker);
            };

            service.nearbySearch(request, callback);

        };

        $scope.hideMarkers = function (type) {
            _.each($scope.mapdata[type], function (marker) {
                marker.setMap(null);
            });
        };
        $scope.remove = function (idx) {
            $scope.data.locations.splice(idx, 1);
        };

        $scope.addLocation = function () {
            $scope.data.locations.push("");
        };
        $scope.updateIncident = function (){
            $scope.data.id = $scope.incident.id;
            IncidentService.update($scope.data).then(function(response){
                if(response.data != null){
                $scope.incident.locations = angular.copy($scope.data.locations);
                $scope.addloc = false;
                $scope.noloc = true;
                $scope.showmap();
                console.log($scope.incident);
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/api/incidents/update", { data: $scope.data }).then(function (response) {
                
            // });
        }
        $scope.doToggle = function (icon) {
            if (!icon.show) {
                $scope.showMarkers(icon.name, icon.types, icon.icon);
            } else {
                $scope.hideMarkers(icon.name);
            }
        }
    }
} ());
