(function () {
    'use strict';

    angular.module('app')
    .controller('scenarioCtrl', ['$scope', '$location', '$routeParams', '$http', 'AuthService','ModalService','$filter','ScenarioService', ctrlFunction]);

    function ctrlFunction($scope, $location, $routeParams, $http, AuthService, ModalService, $filter, ScenarioService) {

        function init() {
            $scope.items = [{name: '10 items per page', val: 10},
             {name: '20 items per page', val: 20},
             {name: '30 items per page', val: 30},
             {name: 'show all items', val: 30000}]
             $scope.pageItems = 10;
        }

        $scope.usersTable = function (tableState) {
            $scope.isLoading = true;
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     
            var number = pagination.number || 10;

            ScenarioService.list().then(function(response){
                $scope.scenarios = response.data;
                $scope.a = _.sortBy($scope.scenarios, function (o) { return new Date(o.updatedAt); });
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.scenarios = result;

                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            
            // $http.get("/settings/scenarios/list").then(function(response){
                
            // });
        };

        $scope.CreateScenario = function () {
            ModalService.showModal({
                templateUrl: "views/settings/scenarios/form.html",
                controller: "scenarioFormCtrl",
                  inputs: {
                    scenario: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.usersTable($scope.tableState);
                });
            });
        };

        $scope.editScenario = function (scenario, index) {
            ModalService.showModal({
                templateUrl: "views/settings/scenarios/form.html",
                controller: "scenarioFormCtrl",
                inputs: {
                    scenario: scenario
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.usersTable($scope.tableState);
                });
            });
        };

        $scope.deleteCapacity = function (cat_Id, index) {
           var data = {};
           data.id = cat_Id;
           ScenarioService.delete(data.id).then(function(res){
                $scope.scenarios.splice(index, 1);
                toastr.success("Scenario deleted successfully");
           },function(err){
            if(err)
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            else
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
           });
           // $http.post('/settings/scenarios/remove',{data: data}).then(function(res) {
                
           //  });
        };

       init();

   }

}());
