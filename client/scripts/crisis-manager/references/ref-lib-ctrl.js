(function () {
    'use strict';

    angular.module('app')
        .controller('referenceLibCtrl', ['$scope', 'ModalService', '$http', '$location', '$uibModal', '$rootScope', '$route', 'AuthService','LibraryService', libraryFunc]);

    function libraryFunc($scope, ModalService, $http, $location, $uibModal, $rootScope, $route, AuthService, LibraryService) {

        function init() {
            $scope.libReferences = [];

            LibraryService.all().then(function(res){
                $scope.libReferences = res.data;
                $scope.sortByCreate = _.sortBy($scope.libReferences, function (o) { return new Date(o.createdAt); });
                $scope.libReferences = $scope.sortByCreate.reverse();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/libraries/all").then(function (res) {
                
            // });
        }
        init();

        $scope.editModal = function (Id) {
            console.log('herweasd', Id);
            ModalService.showModal({
                templateUrl: "views/settings/libraries/form.html",
                controller: "libEditCtrl",
                inputs: {
                    id: Id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    init();
                });
            });
        }

        var imageModal = function (record) {
            $uibModal.open({
                templateUrl: 'views/settings/libraries/lib-image.html',
                size: 'lg',
                windowClass: 'image-modal' + record.id,
                controller: function ($scope, $uibModalInstance) {
                    var self = this;
                    $scope.record = record;
                    $scope.size = 100;
                    $scope.maximized = false;
                    var getWindow = function () {
                        if (!self.window) {
                            self.parent = angular.element('.image-modal' + record.id);
                            self.window = self.parent.find('.modal-dialog');
                        }
                        return self.window;
                    };
                    $scope.maximize = function () {
                        var win = getWindow();
                        self.parent.addClass('max');
                        $scope.maximized = true;
                    };
                    $scope.restore = function () {

                        var win = getWindow();
                        self.parent.removeClass('max');
                        $scope.maximized = false;
                    };
                    $scope.close = function () {
                        $uibModalInstance.close();
                    }
                    $scope.zoom = function (dir) {
                        switch (dir) {
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

        var pdfModal = function (record) {
            $uibModal.open({
                templateUrl: 'views/settings/libraries/lib-pdf.html',
                size: 'lg',
                windowClass: 'pdf-modal pdf-modal' + record.id,
                controller: function ($scope, $uibModalInstance, $sce) {
                    var self = this;
                    $scope.record = record;
                    $scope.size = 100;
                    $scope.url = $sce.trustAsResourceUrl(record.url);
                    $scope.maximized = false;
                    var getWindow = function () {
                        if (!self.window) {
                            self.parent = angular.element('.pdf-modal' + record.id);
                            self.window = self.parent.find('.modal-dialog');
                        }
                        return self.window;
                    };
                    $scope.maximize = function () {
                        var win = getWindow();
                        self.parent.addClass('max');
                        $scope.maximized = true;
                    };
                    $scope.restore = function () {
                        var win = getWindow();
                        self.parent.removeClass('max');
                        $scope.maximized = false;
                    };
                    $scope.close = function () {
                        $uibModalInstance.close();
                    }

                }
            });
        };

        var videoModal = function (record, size) {
            $uibModal.open({
                templateUrl: 'views/settings/libraries/lib-video.html',
                size: size,
                windowClass: 'video-modal' + record.id,
                controller: function ($scope, $uibModalInstance, $sce, $window) {
                    var self = this;
                    $scope.record = record;
                    $scope.maximize = function () {
                        $scope.API.toggleFullScreen();
                    };
                    $scope.restore = function () {
                        $scope.API.toggleFullScreen();
                    };
                    $scope.close = function () {
                        $uibModalInstance.close();
                    }
                    $scope.API = null;
                    $scope.onPlayerReady = function (API) {
                        $scope.API = API;
                    };
                    $scope.config = {
                        sources: [
                            { src: $sce.trustAsResourceUrl(record.url), type: record.mimetype },
                        ],
                        theme: "bower_components/videogular-themes-default/videogular.css"
                    };
                }
            });
        };

        $scope.preview = function (record) {
            console.log(record);
            switch (record.type) {
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
        }

        $scope.checkNoReferences = function(){
            return $scope.libReferences.length > 0 ? true : false;
        };

        $scope.dateFormat = function (dat) {
            return dat ? moment(dat).utc().local().format('HH:mm DD-MM-YYYY') : 'None';
        };

        $scope.shortUrl = function (url) {
            if (url){
                if (url.indexOf('https') !== -1){
                    return url.replace('https://','');
                }else if(url.indexOf('http') !== -1){
                    return url.replace('http://','');
                }else{
                    return url
                }
            }
        };
    }

}());
