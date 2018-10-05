(function () {
    'use strict';

    angular.module('app')
        .controller('messageShowDetailCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter', 'message','ModalService','$sce','$uibModal', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter, message,ModalService,$sce,$uibModal) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        //fetch and set initial data
        function init() {
            $scope.documents = [];
            $scope.message = angular.copy(message);
            $scope.heading = 'Show Message Detail';
            $http.get('/simulation/game-libraries/all').then(function (response) {
                var library = response.data;
                _.each(library, function (doc) {
                    if(doc.mimetype !== null){
                        $scope.documents.push(doc);
                    }
                });
            });
            $scope.user = Query.getCookie('user');
        }

        init();

        //convert html to styled text
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }

        //check link if empty
        $scope.checkLink = function (link) {
            if (!link || link === '') {
                return true;
            } else {
                return false;
            }
        }
        
        //show and open link
        $scope.showLink = function (link) {
            ModalService.showModal({
                templateUrl: "views/simulation/my-messages/media-link-modal.html",
                inputs: { link: link },
                controller: function ($scope, $http, $sce, $location, AuthService, ModalService, close, link) {
                    $scope.liblink = $sce.trustAsResourceUrl(link);
                    $scope.link = $sce.trustAsResourceUrl(link);
                    $scope.clearBrowser = function () {
                        $scope.liblink = '';
                        $scope.link = '';
                    }
                    $scope.RefreshPage = function () {
                        $scope.link = 'abcd';
                        $scope.link = $scope.liblink;
                    };
                    $scope.refreshframe = function () {
                        $scope.link = $sce.trustAsResourceUrl($scope.liblink);
                    };
                    $scope.close = function () {
                        close();
                    };
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        // view video library
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

        //view image library
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
                        myMessagesCtrl
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

        //view pdf library
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

        //preview attachement
        $scope.previewAttachment = function (record) {
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
        };
          
    }
}());