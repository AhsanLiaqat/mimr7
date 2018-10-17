(function () {
    'use strict';

    angular.module('app')
        .controller('ReferenceLibraryCtrl', ['$scope', '$http', '$rootScope', '$route', 'AuthService', '$routeParams', 'ModalService','$window','Query','$uibModal','IncidentService', messageCtrl]); // overall control


    function messageCtrl($scope, $http, $rootScope, $route, AuthService, $routeParams, ModalService,$window,Query,$uibModal, IncidentService) {

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
        function init() {
            $scope.user = Query.getCookie('user');
            setTimeout(function(){ $rootScope.fixedHeader = false; }, 10);
            console.log($routeParams);
            $scope.userAccountId = $routeParams.userAccountId;
            if ($routeParams.userAccountId === undefined) {
                $http.get("/users/me").then(function (res) {
                    $scope.user = res.data;
                    IncidentService.all($scope.user.userAccountId).then(function(res){
                        $scope.incidents = res.data;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get("/api/incidents/all?userAccountId=" + $scope.user.userAccountId)
                    //     .then(function (res) {
                            
                    // });
                });
            } else {
                var query = "/settings/libraries/all";
                $http.get(query).then(function (response) {
                    $scope.libraries = response.data;
                    $scope.libraries = Query.sort($scope.libraries,'title',false,false);
                    // $http.get('/messages/all/' + $scope.user.id + '/' + $scope.incident.id).then(function (res) {
                    //     $scope.sortByCreated = _.sortBy(res.data, function (o) { return new Date(o.updatedAt); });
                    //     $scope.messages = $scope.sortByCreated.reverse();
                    //     if ($scope.messages.length === 0) {
                    //         $scope.noMessage = true;
                    //     }
                    // });
                })
            }
        }

        navigator.geolocation.getCurrentPosition(function (position) { })
        var userAgent = $window.navigator.userAgent;
        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                console.log(key);
            }
        };

        $scope.shortUrl = function (url) {
            if(url){
                if (url.indexOf('https') !== -1){
                    return url.replace('https://','');
                }else if(url.indexOf('http') !== -1){
                    return url.replace('http://','');
                }else{
                    return url
                }
            }
        };
        $scope.preview = function(record){
            switch (record.type){
                case "image":
                    imageModal(record);
                    break;
                case "video":
                    videoModal(record, 'lg');
                    break;
                case "pdf":
                    pdfModal(record);
                    break;
                case "audio":
                    videoModal(record, 'md');
                    break;
            }
        };
        var imageModal = function(record){
            $uibModal.open({
                  templateUrl: 'views/settings/libraries/lib-image.html',
                  size: 'lg',
                  windowClass: 'image-modal' + record.id,
                  controller: function($scope, $uibModalInstance) {
                      var self = this;
                    $scope.record = record;
                    $scope.size = 100;
                    $scope.maximized = false;
                    var getWindow = function(){
                        if (!self.window){
                            self.parent = angular.element('.image-modal' + record.id);
                            self.window = self.parent.find('.modal-dialog');
                        }
                        return self.window;
                    };
                    $scope.maximize = function(){
                        var win = getWindow();
                        self.parent.addClass('max');
                        $scope.maximized = true;
                    };
                    $scope.restore = function(){

                        var win = getWindow();
                        self.parent.removeClass('max');
                        $scope.maximized = false;
                    };
                    $scope.close = function(){
                        $uibModalInstance.close();
                    }
                    $scope.zoom = function(dir){
                        switch(dir){
                            case 'in':
                                $scope.size += 5;
                                break;
                            case 'out':
                                $scope.size -= 5;
                                break;
                        }
                    }
                  }
            });
        };

        var pdfModal = function(record){
            $uibModal.open({
                  templateUrl: 'views/settings/libraries/lib-pdf.html',
                  size: 'lg',
                  windowClass: 'pdf-modal pdf-modal' + record.id,
                  controller: function($scope, $uibModalInstance, $sce) {
                      var self = this;
                    $scope.record = record;
                    $scope.size = 100;
                    $scope.url = $sce.trustAsResourceUrl(record.url);
                    $scope.maximized = false;
                    var getWindow = function(){
                        if (!self.window){
                            self.parent = angular.element('.pdf-modal' + record.id);
                            self.window = self.parent.find('.modal-dialog');
                        }
                        return self.window;
                    };
                    $scope.maximize = function(){
                        var win = getWindow();
                        self.parent.addClass('max');
                        $scope.maximized = true;
                    };
                    $scope.restore = function(){
                        var win = getWindow();
                        self.parent.removeClass('max');
                        $scope.maximized = false;
                    };
                    $scope.close = function(){
                        $uibModalInstance.close();
                    }

                  }
            });
        };

        var videoModal = function(record, size){
            $uibModal.open({
                  templateUrl: 'views/settings/libraries/lib-video.html',
                  size: size,
                  windowClass: 'video-modal' + record.id,
                  controller: function($scope, $uibModalInstance, $sce, $window) {
                    var self = this;
                    $scope.record = record;
                    $scope.maximize = function(){
                        $scope.API.toggleFullScreen();
                    };
                    $scope.restore = function(){
                        $scope.API.toggleFullScreen();
                    };
                    $scope.close = function(){
                        $uibModalInstance.close();
                    }
                    $scope.API = null;
                    $scope.onPlayerReady = function(API) {
                        $scope.API = API;
                    };
                    $scope.config = {
                            sources: [
                                {src: $sce.trustAsResourceUrl(record.url), type: record.mimetype},
                            ],
                            theme: "bower_components/videogular-themes-default/videogular.css"
                        };
                  }
            });
        };

        $scope.logout = function () {
            AuthService.logout();
        }

        init();
    }
}());
