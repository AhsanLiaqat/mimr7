(function () {
    'use strict';

    angular.module('app')
    .controller('capacityMainCtrl', ['$scope', '$location', '$routeParams', '$http', 'AuthService','ModalService','$filter','CapacityService', ctrlFunction]);

    function ctrlFunction($scope, $location, $routeParams, $http, AuthService, ModalService, $filter, CapacityService) {

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
            CapacityService.list().then(function(response){
                $scope.capacity = response.data;
                $scope.a = _.sortBy($scope.capacity, function (o) { return new Date(o.updatedAt); });
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.capacity = result;

                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG)
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/capacities/list").then(function(response){
                
            // });
        };

        $scope.CreateCapacity = function () {
            ModalService.showModal({
                templateUrl: "views/settings/capacities/form.html",
                controller: "capacityFormCtrl",
                inputs: {
                    capacity: null
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

        $scope.editCapacity = function (capacity, index) {
            ModalService.showModal({
                templateUrl: "views/settings/capacities/form.html",
                controller: "capacityFormCtrl",
                inputs: {
                    capacity: capacity
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
            CapacityService.delete(data.id).then(function(res){
                $scope.capacity.splice(index, 1);
                toastr.success("Capacity deleted successfully");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.delete('/settings/capacities/remove/'+data.id).then(function(res) {
                
            // });
        };

        init();
    }
}());
