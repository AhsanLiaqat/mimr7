(function () {
    'use strict';

    angular.module('app')
        .controller('locationMapPageCtrl', ['$scope',
            '$rootScope',
            '$routeParams',
            '$http',
            'AuthService',
            '$location',
            '$timeout',
            'ModalService',
            'Query',
            'IncidentShapeService',
            'MessageService',
            'IncidentService',
            'MapImageService',
            ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        $routeParams,
        $http,
        AuthService,
        $location,
        $timeout,
        ModalService,
        Query,
        IncidentShapeService,
        MessageService,
        IncidentService,
        MapImageService) {
        $scope.deleteAllShape = function () {
            for (var i = 0; i < $scope.all_overlays.length; i++) {
                if ($scope.all_overlays[i].type != google.maps.drawing.OverlayType.MARKER) {
                    $scope.all_overlays[i].overlay.setMap(null);
                }
            }
            $scope.all_overlays = [];
        }

        function init() {
            $scope.user = Query.getCookie('user');
            $scope.shapes = [];
            $scope.note = '';
            $scope.markers = [];
            $scope.shapeMade = false;
            $scope.all_overlays = [];
            $scope.selectedShape = {};
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
            $scope.mapdata = {}

            // Properties initialization
            if ($routeParams && $routeParams.incidentId) {
                IncidentService.get($routeParams.incidentId).then(function(result){
                  $scope.incident = result.data;
                    $timeout(function () {
                        IncidentShapeService.all($scope.incident.id).then(function(resp){
                          if(resp.data.length > 0){
                              IO.OUT(resp.data[0].shapes,$scope.map);
                            }
                            for (var i = 0; i < $scope.all_overlays.length; i++) {
                              $scope.all_overlays[i].overlay.setMap($scope.map);
                            }
                        },function(err){
                          if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                          else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.get("/incident-shapes/all?incidentId="+$scope.incident.id).then(function (resp) {
                            
                        // });



                        var location = $scope.incident.locations[0].geometry.location;
                        // Draw basic map
                        $scope.map = new google.maps.Map(document.getElementById('map'), {
                            zoom: 13,
                            center: location
                        });

                 // Drawing tools on map
                        var drawingManager = new google.maps.drawing.DrawingManager({
                            drawingControlOptions: {
                                position: google.maps.ControlPosition.TOP_RIGHT
                            },
                            markerOptions: { icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },
                            circleOptions: {
                                draggable: true,
                                editable: true,
                                zIndex: 1
                            },
                            polygonOptions: {
                                draggable: true,
                                clickable: true,
                                editable: true,
                                zIndex: 1
                            },
                            polylineOptions: {
                                clickable: true,
                                draggable: true,
                                editable: true,
                                zIndex: 1
                            },
                            rectangleOptions: {
                                clickable: true,
                                editable: true,
                                draggable: true,
                                zIndex: 1
                            }
                        });
                        drawingManager.setMap($scope.map);

                        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
                            $scope.all_overlays.push(e);
                            if (e.type == google.maps.drawing.OverlayType.MARKER) {
                                var newShape = e.overlay;
                                newShape.type = e.type;
                                $scope.markers.push(newShape);
                            }
                            drawingManager.setDrawingMode(null);
                            var newShape = e.overlay;
                            $timeout(function () {
                              if(!$scope.selectedShape){
                                $scope.shapeMade = false;
                              }
                            });
                            newShape.type = e.type;
                            google.maps.event.addListener(newShape, 'click', function () {
                                $scope.setSelection(newShape);

                            });
                            $timeout(function () {
                              $scope.setSelection(newShape);
                            });
                        });

                        google.maps.event.addListener($scope.map, 'click', $scope.clearSelection);

                        // Create the search box and link it to the UI element.
                        var input = document.getElementById('pac-input');
                        console.log(input);
                        var searchBox = new google.maps.places.SearchBox(input);
                        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                        // Bias the SearchBox results towards current map's viewport.
                        $scope.map.addListener('bounds_changed', function () {
                            searchBox.setBounds($scope.map.getBounds());
                        });

                        var markers = [];
                        // Listen for the event fired when the user selects a prediction and retrieve
                        // more details for that place.
                        searchBox.addListener('places_changed', function() {
                          var places = searchBox.getPlaces();

                          if (places.length == 0) {
                            return;
                          }

                          // Clear out the old markers.
                          markers.forEach(function(marker) {
                            marker.setMap(null);
                          });
                          markers = [];

                          // For each place, get the icon, name and location.
                          var bounds = new google.maps.LatLngBounds();
                          places.forEach(function(place) {
                            if (!place.geometry) {
                              console.log("Returned place contains no geometry");
                              return;
                            }
                            var icon = {
                              url: place.icon,
                              size: new google.maps.Size(71, 71),
                              origin: new google.maps.Point(0, 0),
                              anchor: new google.maps.Point(17, 34),
                              scaledSize: new google.maps.Size(25, 25)
                            };

                            // Create a marker for each place.
                            markers.push(new google.maps.Marker({
                              map: $scope.map,
                              icon: icon,
                              title: place.name,
                              position: place.geometry.location
                            }));

                            if (place.geometry.viewport) {
                              // Only geocodes have viewport.
                              bounds.union(place.geometry.viewport);
                            } else {
                              bounds.extend(place.geometry.location);
                            }
                          });
                          $scope.map.fitBounds(bounds);
                        });

                        // Markers for Schools and Hospitals
                        _.each($scope.incident.locations, function (loc) {
                            var marker = new google.maps.Marker({
                                position: loc.geometry.location,
                                title: loc.address,
                                map: $scope.map
                            });
                            $scope.markers.push(marker);
                        });

                        var legend = document.getElementById('legend');
                        $scope.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

                        var notes = document.getElementById('notes');
                        $scope.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(notes);

                        $timeout(function () {
                            $("#legend").show();
                            $("#notes").show();
                        });
                    }, 500);
                },function(err){
                  if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                  else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/api/incidents/get?id=' + $routeParams.incidentId)
                // .then(function (result) {

                    
                // })
            }
        };

        init();

        $scope.exportPNG = function () {
          html2canvas($('#map'), {
              useCORS: true,
              onrendered: function (canvas) {
                var dataUrl = canvas.toDataURL("image/png");
                window.open(dataUrl, "", "width=700,height=700");
                var a = document.createElement('a');
                a.href = dataUrl;
                a.download = "Map_file.png";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

              }
          });
        };

        var IO={
          //returns array with storable google.maps.Overlay-definitions
          IN:function(arr,//array with google.maps.Overlays
                      encoded//boolean indicating if pathes should be stored encoded
                      ){
              $scope.shapes = [];
                 var  goo=google.maps,
                  shape,tmp;

              for(var i = 0; i < arr.length; i++)
              {
                shape=arr[i];
                tmp={type:this.t_(shape.type),id:shape.id||null};
                switch(tmp.type){
                   case 'CIRCLE':
                      tmp.radius=shape.overlay.getRadius();
                      tmp.geometry=this.p_(shape.overlay.getCenter());
                    break;
                   case 'MARKER':
                      tmp.geometry=this.p_(shape.overlay.getPosition());
                    break;
                   case 'RECTANGLE':
                      tmp.geometry=this.b_(shape.overlay.getBounds());
                     break;
                   case 'POLYLINE':
                      tmp.geometry=this.l_(shape.overlay.getPath(),encoded);
                     break;
                   case 'POLYGON':
                      tmp.geometry=this.m_(shape.overlay.getPaths(),encoded);

                     break;
               }
               tmp.notes = arr[i].notes;
               $scope.shapes.push(tmp);
            }
            return $scope.shapes;
          },
          //returns array with google.maps.Overlays
          OUT:function(arr,//array containg the stored shape-definitions
                       map//map where to draw the shapes
                       ){
            $scope.deleteAllShape();
              // $scope.shapes = [];
                var goo=google.maps,
                  map=map||null,
                  shape,tmp;
              for(var i = 0; i < arr.length; i++){
                shape=arr[i];
                switch(shape.type){
                   case 'CIRCLE':
                     tmp=new goo.Circle({ editable: true,draggable:true,clickable: true,
                      radius:Number(shape.radius),
                                        center:this.pp_.apply(this,shape.geometry)});
                     tmp.getCenter();
                    break;
                   case 'MARKER':
                     tmp=new goo.Marker({ editable: true,draggable:true,clickable: true,position:this.pp_.apply(this,shape.geometry)});
                    break;
                   case 'RECTANGLE':
                     tmp=new goo.Rectangle({ editable: true,draggable:true,clickable: true,bounds:this.bb_.apply(this,shape.geometry)});
                     break;
                   case 'POLYLINE':
                     tmp=new goo.Polyline({editable: true,draggable:true,clickable: true,path:this.ll_(shape.geometry)});
                     break;
                   case 'POLYGON':
                     tmp=new goo.Polygon({editable: true,draggable:true,clickable: true,paths:this.mm_(shape.geometry)});
                     break;
               }

               tmp.type =shape.type;
               tmp.map = map;
               tmp.id = shape.id;
               // tmp.notes = arr[i].notes;
               addListenersOnShapes(tmp);

               var shap = {
                overlay: tmp,
                notes: arr[i].notes,
                type: shape.type.toLowerCase()
               }
               $scope.all_overlays.push(shap);
            }

            return $scope.all_overlays;
          },
          l_:function(path,e){
            path=(path.getArray)?path.getArray():path;
            if(e){
              return google.maps.geometry.encoding.encodePath(path);
            }else{
              var r=[];
              for(var i=0;i<path.length;++i){
                r.push(this.p_(path[i]));
              }
              return r;
            }
          },
          ll_:function(path){
            if(typeof path==='string'){
              return google.maps.geometry.encoding.decodePath(path);
            }
            else{
              var r=[];
              for(var i=0;i<path.length;++i){
                r.push(this.pp_.apply(this,path[i]));
              }
              return r;
            }
          },

          m_:function(paths,e){
            var r=[];
            paths=(paths.getArray)?paths.getArray():paths;
            for(var i=0;i<paths.length;++i){
                r.push(this.l_(paths[i],e));
              }
             return r;
          },
          mm_:function(paths){
            var r=[];
            for(var i=0;i<paths.length;++i){
                r.push(this.ll_.call(this,paths[i]));

              }
             return r;
          },
          p_:function(latLng){
            return([latLng.lat(),latLng.lng()]);
          },
          pp_:function(lat,lng){
            return new google.maps.LatLng(lat,lng);
          },
          b_:function(bounds){
            return([this.p_(bounds.getSouthWest()),
                    this.p_(bounds.getNorthEast())]);
          },
          bb_:function(sw,ne){
            return new google.maps.LatLngBounds(this.pp_.apply(this,sw),
                                                this.pp_.apply(this,ne));
          },
          t_:function(s){
            var t=['CIRCLE','MARKER','RECTANGLE','POLYLINE','POLYGON'];
            for(var i=0;i<t.length;++i){
               if(s===google.maps.drawing.OverlayType[t[i]]){
                 return t[i];
               }
            }
          }

        }

        $scope.save_shapes = function(){
          IO.IN($scope.all_overlays,false);
          var data = {
              shapes: $scope.shapes,
              incidentId: $scope.incident.id,
              userAccountId: $scope.user.userAccountId
          }
          IncidentShapeService.save(data).then(function(result){
            IncidentShapeService.all($scope.incident.id).then(function(resp){
              if(resp.data.length > 0){
                    IO.OUT(resp.data[0].shapes,$scope.map);
                  }
                  for (var i = 0; i < $scope.all_overlays.length; i++) {
                    $scope.all_overlays[i].overlay.setMap($scope.map);

                  }
            },function(err){
              if(err)
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
              else
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/incident-shapes/all?incidentId="+$scope.incident.id).then(function (resp) {
                  
            // });
          },function(err){
            if(err)
              toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            else
              toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
          });
          // $http.post("/incident-shapes/save",data).then(function (result) {
              
          // });
        }
        $scope.createImageLink = function () {
            html2canvas($('#map'), {
                useCORS: true,
                onrendered: function (canvas) {
                    var data = {}
                    var dataUrl = canvas.toDataURL("image/png");
                    data.incidentId = $scope.incident.id;
                    data.base64 = dataUrl;
                    MapImageService.mapImage(data).then(function(res){
                      ModalService.showModal({
                            templateUrl: "views/dashboard/show-map-path.html",
                            controller: function () {
                                this.path = 'Location Map : ' + res.data.path;
                                $scope.msg = '';
                                $scope.msg = 'Location Map : ' + res.data.path;
                                var postMessage = function (data) {
                                     if (data.message != '' && data.message != undefined){
                                        $scope.message = '';
                                        data.userId = $scope.user.id
                                        MessageService.save(data).then(function(res){
                                          toastr.success('message sent to dashboard');
                                        },function(err){
                                          if(err)
                                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                          else
                                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                        });
                                        // $http.post("/messages/save", { data: data }).then(function (res) {
                                            
                                        // });
                                    }
                                };
                                this.sendLinkMessage = function () {
                                    var data = {};
                                    data.message = $scope.msg;
                                    data.incidentId = $scope.incident.id;
                                    postMessage(data);
                                    // navigator.geolocation.getCurrentPosition(function (position) {
                                    //     data.coords = _.extend({}, position.coords);
                                    // }, function () {
                                    //     postMessage(data);
                                    // });
                                };
                            },
                            controllerAs: "futurama"
                        }).then(function (modal) {
                            modal.element.modal({ backdrop: 'static', keyboard: false });
                            modal.close.then(function () {
                                $('.modal-backdrop').remove();
                                $('body').removeClass('modal-open');
                            });
                        });
                    },function(err){
                      if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                      else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/api/map-images/map-image', { data: data }).then(function (res) {
                        
                    // });
                }
            });
        }
        var addListenersOnShapes = function(shape) {

          google.maps.event.addListener(shape, 'click', function (event) {
            $timeout(function () {
              $scope.setSelection(shape);

            });
          });
        }




        $scope.showMarkers = function (type, place_types, icon, radius) {
            radius = radius || 50000;
            if (!$scope.mapdata[type]) {
                $scope.mapdata[type] = [];
            }
            if ($scope.mapdata[type].length) {
                _.each($scope.mapdata[type], function (marker1) {
                    marker1.setMap($scope.map);
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
                // $scope.markers.push(marker);
            };
            service.nearbySearch(request, callback);

        };

        $scope.hideMarkers = function (type) {
            _.each($scope.mapdata[type], function (marker) {
                marker.setMap(null);
            });
        };

        function setMapOnAll(map) {
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(map);
            }
        }

        $scope.clearMarkers = function () {
            setMapOnAll(null);
        }

        $scope.showMarkersMark = function () {
            setMapOnAll($scope.map);
        }

        $scope.deleteMarkers = function () {
            $scope.clearMarkers();
            $scope.markers = [];
        }

        $scope.doToggle = function (icon) {
            if (!icon.show) {
                $scope.showMarkers(icon.name, icon.types, icon.icon);
            } else {
                $scope.hideMarkers(icon.name);
            }
        }

        $scope.clearSelection = function () {
            if ($scope.selectedShape) {
              $timeout(function () {
                $scope.shapeMade = false;
                $scope.selectedShape = null;
                $scope.infowindow.close();
                $scope.markerx.setMap(null);
              });
            }
        }
        $scope.infowindow = new google.maps.InfoWindow({
          content: 'Notes'
        });
        $scope.markerx = new google.maps.Marker({
          title: 'Notes',
          map: $scope.map
        });

        var m_ = function(paths,e){
            var r=[];
            paths=(paths.getArray)?paths.getArray():paths;
            for(var i=0;i<paths.length;++i){
                r.push(l_(paths[i],e));
              }
             return r;
          }
        var l_ =function(path,e){
            path=(path.getArray)?path.getArray():path;
            if(e){
              return google.maps.geometry.encoding.encodePath(path);
            }else{
              var r=[];
              for(var i=0;i<path.length;++i){
                r.push(p_(path[i]));
              }
              return r;
            }
          }
        var p_ = function(latLng){
            return([latLng.lat(),latLng.lng()]);
          }
        $scope.setSelection = function (shape) {
          $scope.infowindow.close();
          $scope.markerx.setMap(null);
            $timeout(function () {
              $scope.shapeMade = true;
              $scope.selectedShape = shape;
              for (var i = 0; i < $scope.all_overlays.length; i++) {
                if ($scope.all_overlays[i].overlay === $scope.selectedShape) {
                  $scope.note = $scope.all_overlays[i].notes;
                  if($scope.all_overlays[i].notes != ''){
                    if($scope.all_overlays[i].type == 'circle'){
                      $scope.markerx = new google.maps.Marker({
                        position: $scope.all_overlays[i].overlay.getCenter(),
                        title: 'Notes',
                        map: $scope.map
                      });
                    }else if($scope.all_overlays[i].type == 'polygon'){
                      var arr = m_($scope.all_overlays[i].overlay.getPaths(),false);
                      $scope.markerx = new google.maps.Marker({
                        position: {
                          lat: arr[0][0][0],
                          lng: arr[0][0][1]
                        },
                        title: 'Notes',
                        map: $scope.map
                      });
                    }
                    else if($scope.all_overlays[i].type == 'polyline'){
                      var arr = l_($scope.all_overlays[i].overlay.getPath(),false);
                      $scope.markerx = new google.maps.Marker({
                        position: {
                          lat: arr[0][0],
                          lng: arr[0][1]
                        },
                        title: 'Notes',
                        map: $scope.map
                      });
                    }
                    else if($scope.all_overlays[i].type == 'rectangle'){
                     var arr = $scope.all_overlays[i].overlay.getBounds();
                      $scope.markerx = new google.maps.Marker({
                        position: {
                          lat: arr.f.f,
                          lng: arr.b.f
                        },
                        title: 'Notes',
                        map: $scope.map
                      });
                    }

                    $scope.infowindow = new google.maps.InfoWindow({
                      content: $scope.all_overlays[i].notes
                    });
                    $scope.infowindow.open($scope.map, $scope.markerx);
                  }
                }
              }
            });
        }

        $scope.save_notes = function () {
            if ($scope.selectedShape) {
              for (var i = 0; i < $scope.all_overlays.length; i++) {
                if ($scope.all_overlays[i].overlay === $scope.selectedShape) {
                    $scope.all_overlays[i].notes = angular.copy($scope.note);
                    $scope.save_shapes();
                  }
              }
            }
        }

        $scope.deleteSelectedShape = function () {
            if ($scope.selectedShape) {
              for (var i = 0; i < $scope.all_overlays.length; i++) {
                if ($scope.all_overlays[i].overlay === $scope.selectedShape) {
                    $scope.all_overlays[i].overlay.setMap(null);
                    $scope.all_overlays.splice(i,1);
                  }
              }
              $scope.selectedShape.setMap(null);
            }
        }
    }
}());
