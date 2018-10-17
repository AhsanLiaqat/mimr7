(function () {
    'use strict';

    angular.module('app')
        .controller('departmentCtrl', ['$scope','$filter', '$location', '$routeParams', '$http', 'AuthService', 'ModalService', 'Query','DepartmentService', ctrlFunction]);

    function ctrlFunction($scope,$filter, $location, $routeParams, $http, AuthService, ModalService, Query,DepartmentService) {

        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

        $scope.departmentTable = function (tableState) {
            $scope.isLoading = true;
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            $scope.user = Query.getCookie('user');
            DepartmentService.getAll($scope.user.userAccountId).then(function(response){
                $scope.departments = response.data;
                $scope.sortByCreate = _.sortBy($scope.departments, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.departments = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/settings/departments/all?userAccountId=" + $scope.user.userAccountId ;
            // $http.get(path).then(function(response) {
                
            // });
        };
        $scope.createModal = function() {
            ModalService.showModal({
                templateUrl: "views/settings/departments/form.html",
                controller: "departmentCreateCtrl",
                inputs : {
                    department: "undefined"
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.departments.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.departmentTable($scope.tableState);
                });
            });
        }

        $scope.editModal = function(dpt) {
             ModalService.showModal({
                templateUrl: "views/settings/departments/form.html",
                controller: "departmentCreateCtrl",
                inputs : {
                    department: dpt
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.departmentTable($scope.tableState);
                });
            });
        };
        $scope.deleteDept = function (dept){
            var id = dept.id;
            DepartmentService.delete(id).then(function(res){
                toastr.success("Delete successful");
                $scope.departmentTable($scope.tableState);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/departments/remove", {id: id}).then(function(res) {

            // });
        }
        $scope.dateFormat = function(dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

    }
}());
