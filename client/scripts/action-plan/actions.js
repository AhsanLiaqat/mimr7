(function () {
    'use strict';

    angular.module('app')
    .controller('ActionCtrl', ['$scope', 'ModalService', '$routeParams', '$http', 'AuthService','ActionService', ctrlFunction]);

    function ctrlFunction($scope, ModalService, $routeParams, $http, AuthService, ActionService) {

        function init() {
            ActionService.all().then(function(response){
                $scope.actions = filterFilter(response.data, { 'active': true });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/actions/all').then(function(response) {
                
            // });
        }

        $scope.dateFormat = function(dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        $scope.deleteAction = function(Id) {
            ModalService.showModal({
                templateUrl: "views/modal.delete.html",
                controller: "actionDeleteCtrl",
                inputs : {
                    actionId: Id
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    init();
                });
            });
        };

        init();

    }
}());
