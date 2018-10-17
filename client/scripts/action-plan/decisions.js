(function () {
    'use strict';

    angular.module('app')
    .controller('DecisionsCtrl', ['$scope', 'ModalService', '$routeParams', '$http', 'AuthService','DecisionService', ctrlFunction]);

    function ctrlFunction($scope, ModalService, $routeParams, $http, AuthService, DecisionService) {

        function init() {
            DecisionService.all().then(function(response){
                $scope.decisions = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/decisions/all').then(function(response) {
                
            // });
        }

        $scope.dateFormat = function(dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        $scope.deleteDecision = function(Id) {
            ModalService.showModal({
                templateUrl: "views/modal.delete.html",
                controller: "DecisionDeleteCtrl",
                inputs : {
                    decisionId: Id
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
