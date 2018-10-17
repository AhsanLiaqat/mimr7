(function () {
    'use strict';

    angular.module('app')
    .controller('capacityCtrl', ['$scope', '$location', '$routeParams', '$http', 'AuthService', 'ModalService','$filter','CapacityService', ctrlFunction]);

    function ctrlFunction($scope, $location, $routeParams, $http, AuthService, ModalService, $filter,CapacityService) {

        function init() {
            $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
            $scope.pageItems = 10;
            $scope.editFields = false;
            $scope.actionFields = true;
        }

        $scope.loadList = function(){
            CapacityService.list().then(function(res){
                $scope.capacity = res.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/capacities/list").then(function(res){
                
            // });
        }

        $scope.usersTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            CapacityService.list().then(function(response){
                angular.forEach(response.data, function(elem, index1){
                    elem.availableOnRequest = parseInt(elem.availableOnRequest);
                });
                
                $scope.capacity = response.data;
                console.log('Capecity',$scope.capacity);
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
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/capacities/list").then(function(response){
                
            // });
        };

        $scope.CreateCapacity = function () {
            ModalService.showModal({
                templateUrl: "views/capacity/capacity.edit.html",
                controller: "capacityCreateCtrl",
                inputs: {
                    capacity: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.loadList();
                });
            });
        };

        $scope.editCapacity = function (capacity, index) {
            ModalService.showModal({
                templateUrl: "views/capacity/capacity.edit.html",
                controller: "capacityCreateCtrl",
                inputs: {
                    capacity: capacity
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.loadList();
                });
            });
        };

        $scope.toggle = function(c){

            c.used = c.used? false:true;
            CapacityService.save(c).then(function(response){
                toastr.success('Capacity updated.', 'Success!');
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/capacities/save",  {data: c})
            // .then(function (response) {
                
            // });
        }

        $scope.deleteCapacity = function (cat_Id, index) {
            var data = {};
            data.id = cat_Id;
            console.log(cat_Id);
            CapacityService.delete(cat_Id).then(function(res){
                $scope.capacity.splice(index, 1);
                toastr.success("Capacity deleted successfully");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/capacities/remove',{data: data}).then(function(res) {
                
            // });
        };

        $scope.toggleEditFields = function(){
            $scope.editFields = true;
            $scope.actionFields = false;
        }

        $scope.toggleCancelFields = function(){
            $scope.editFields = false;
            $scope.actionFields = true;
        }

        $scope.toggleSaveFields = function(){

            $scope.editFields = false;
            $scope.actionFields = true;
            CapacityService.saveDashBoardFields($scope.capacity).then(function(){

            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/capacities/save-dash-board-fields", {data: $scope.capacity}).then(function(){

            // });
        }

        $scope.assetsInfo = function (info) {
            ModalService.showModal({
                templateUrl: "views/capacity/assets-info-modal.html",
                controller: "assetsInfoModalCtrl",
                inputs: {
                    info: info
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        init();
    }
}());
