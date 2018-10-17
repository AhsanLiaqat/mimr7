(function () {
    'use strict';

    angular.module('app')
    .controller('actionPlanWizardCtrl', ['$scope', '$location', '$routeParams', '$http', 'AuthService', 'ModalService','filterFilter','CustomMessageService', ctrlFunction]);

    function ctrlFunction($scope, $location, $routeParams, $http, AuthService, ModalService,filterFilter, CustomMessageService) {
        $scope.selected = {};
        $scope.change = function(type){
            $scope.selected = filterFilter($scope.customMessages, {msgType: type})[0];
        }
        $scope.get = function(type){
            return filterFilter($scope.customMessages, {msgType: type})[0];
        }

        CustomMessageService.all().then(function(response){
            $scope.customMessages = response.data;
            $scope.first = $scope.get('Type 1');
            $scope.second = $scope.get('Type 2');
            $scope.third = $scope.get('Type 3');
            $scope.fourth = $scope.get('Type 4');
        },function(err){
            if(err)
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            else
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
        });
        // $http.get('/settings/custom-messages/all').then(function(response) {
            
        // });

        $scope.newActionPlan = function () {
            ModalService.showModal({
                templateUrl: "views/wizard/new-section-plan-modal.html",
                controller: "newSectionPlanModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.createSectionPlan = function () {
            ModalService.showModal({
                templateUrl: "views/wizard/new-section-plan-modal.html",
                controller: "newSectionPlanModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.newActionPlanv2 = function () {
            ModalService.showModal({
                templateUrl: "views/wizard/new-category-plan-modal.html",
                controller: "newCategoryPlanModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
    }
}());
