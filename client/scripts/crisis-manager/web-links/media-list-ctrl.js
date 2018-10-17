(function () {
    'use strict';

    angular.module('app')
    .controller('mediaListCtrl', ['$scope', '$rootScope', '$routeParams', '$http', 'ModalService', 'AuthService', '$location', '$filter','Query','LibraryService', ctrlFunction]);
    function ctrlFunction($scope, $rootScope, $routeParams, $http, ModalService, AuthService, $location, $filter ,Query, LibraryService) {
        function init() {
            $scope.user = Query.getCookie('user');
            LibraryService.userLib($scope.user.userAccountId).then(function(res){
                $scope.libReferences = res.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/libraries/user-lib?userAccountId=" + $scope.user.userAccountId).then(function (res) {
                
            // });
        };
        init();
        $scope.viewLink = function (link){
            ModalService.showModal({
                templateUrl: "views/crisis-manager/web-links/media-view-template.html",
                controller: "mediaViewModalCtrl",
                inputs: {
                    link: link
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

    }
} ());
