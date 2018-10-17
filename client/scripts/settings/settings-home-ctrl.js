(function () {
    'use strict';

    angular.module('app')
    .controller('settingsHomeCtrl', ['$scope', '$location', '$routeParams', '$http', 'AuthService', 'ModalService','filterFilter','Query','AccountService','CustomMessageService', ctrlFunction]);

    function ctrlFunction($scope, $location, $routeParams, $http, AuthService, ModalService,filterFilter,Query, AccountService, CustomMessageService) {

        function init() {
            $scope.cards = [
                {name: 'Action Plans',route: 'home',click: false},
                {name: 'Settings',route: 'Setting',click: false}
            ]
            $scope.user = Query.getCookie('user');
            AccountService.getCounts($scope.user.userAccountId).then(function(response){
                $scope.count = response.data;
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
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

            });
            // $http.get('/settings/accounts/get-counts?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                
            // });
        }
        init();
        $scope.get = function(type){
            return filterFilter($scope.customMessages, {msgType: type})[0];
        }
        $scope.showGraph = function(index,card){
            if(!card.click){
                angular.forEach($scope.cards, function (card) {
                    card.click = false;
                });
            }
            card.click = !card.click;
            $scope.card = card;
            $scope.card.index = index;
        };
        $scope.createSectionPlan = function () {
            ModalService.showModal({
                templateUrl: "views/wizard/new-section-plan-modal.html",
                controller: "newSectionPlanModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        // $scope.plans.unshift(result);
                    }
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
