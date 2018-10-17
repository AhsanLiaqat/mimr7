(function () {
    'use strict';

    angular.module('app')
    .controller('dashboardCategoriesCtrl', ['$scope','$filter', 'ModalService', '$location', '$routeParams', '$http', 'AuthService', 'Query','DashboardCategoryService','IncidentService', ctrlFunction]);
    function ctrlFunction($scope, $filter, ModalService, $location, $routeParams, $http, AuthService, Query,DashboardCategoryService, IncidentService) {
        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        function init() {
            if($routeParams.id !== undefined) {
                $scope.classId = $routeParams.id;
                DashboardCategoryService.getAll($scope.classId).then(function(res){
                     $scope.categories = res.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = '/settings/dashboard-categories/all?id=' + $scope.classId;
                // $http.get(path).then(function(res) {
                   
                // });
            }
            else{
                DashboardCategoryService.getAllCategories().then(function(res){
                    $scope.categories = res.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/settings/dashboard-categories/all-categories').then(function(res) {
                    
                // });
            }
            $scope.user = Query.getCookie('user');
            IncidentService.all($scope.user.userAccountId).then(function(response){
                $scope.incidents = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/api/incidents/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            // });
        }

        $scope.dashCatTable = function(tableState){
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            if($routeParams.id !== undefined) {
                $scope.classId = $routeParams.id;
                var dashboard = DashboardCategoryService.getAll($scope.classId);
                dashboard.then(function(res){
                    $scope.categories = res.data;
                    tableState = tableFunction(tableState,res)
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = '/settings/dashboard-categories/all?id=' + $scope.classId;
                // $http.get(path).then(function(res) {
                 
                // });
            }
            else{
                var dashboard = DashboardCategoryService.getAllCategories();
                dashboard.then(function(res){
                    $scope.categories = res.data;
                    tableState = tableFunction(tableState,res)
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/settings/dashboard-categories/all-categories').then(function(res) {
                  
                // });
            }
            $scope.user = Query.getCookie('user');
            IncidentService.all($scope.user.userAccountId).then(function(response){
                $scope.incidents = response.data;
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/api/incidents/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            // });
            var tableFunction = function(tableState,response) {
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
                return tableState;
            }
        }

        $scope.deleteCategory = function (cat_Id, index) {
            var data = {};
            data.id = cat_Id;
            var dashboard = DashboardCategoryService.delete(data.id);
            dashboard.then(function(res){
                console.log(res.data);
                if(res.data.success){
                   $scope.categories.splice(index, 1);
                   toastr.success(AppConstant.DELETE_SUCCESS_MSG);
                }else {
                   toastr.error(AppConstant.DELETE_ERROR_MSG);
                }
            })
           // $http.post('/settings/dashboard-categories/remove',{data: data}).then(function(res) {
          
           //  });
        };

        $scope.newCategory = function(cat) {
            ModalService.showModal({
                templateUrl: "views/settings/dashboard-categories/form.html",
                controller:  "dashboardCategoriesFormCtrl",
                inputs: {
                    category: cat,
                    incidents: $scope.incidents
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    init();
                });
            });
        }
        init();
    }
}());
