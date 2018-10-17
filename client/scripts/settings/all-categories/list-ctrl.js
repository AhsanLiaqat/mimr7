(function () {
    'use strict';

    angular.module('app')
    .controller('allCategoriesCtrl', ['$scope','$filter', '$location', '$routeParams', '$http', 'AuthService', 'ModalService', 'Query','AllCategoryService', ctrlFunction]);

    function ctrlFunction($scope,$filter, $location, $routeParams, $http, AuthService, ModalService,Query, AllCategoryService) {

        function init() {
        }
        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

        $scope.categoryTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            $scope.user = Query.getCookie('user');
            AllCategoryService.list($scope.user.userAccountId).then(function(response){
                $scope.categories = response.data;
                $scope.sortByCreate = _.sortBy($scope.categories, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.categories = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/settings/all-categories/list?accountId=" + $scope.user.userAccountId ;
            // $http.get(path).then(function(response) {
                
            // });
        };

        $scope.createModal = function() {
            ModalService.showModal({
                templateUrl: "views/settings/all-categories/form.html",
                controller: "categoryCreateCtrl",
                inputs : {
                    category: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.categories.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.editModal = function(cat ,index) {
            ModalService.showModal({
                templateUrl: "views/settings/all-categories/form.html",
                controller: "categoryCreateCtrl",
                inputs : {
                    category: cat
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $scope.categories[index] = result;
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.deletecat = function (dept, index){
            AllCategoryService.delete(dept.id).then(function(res){
                toastr.success("Delete successful");
                $scope.categories.splice(index,1);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/all-categories/delete", {id: dept.id}).then(function(res) {
                
            // });
        }

        $scope.dateFormat = function(dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
        init();
    }
}());
