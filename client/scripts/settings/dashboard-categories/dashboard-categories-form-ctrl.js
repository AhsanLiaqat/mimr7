(function () {
    'use strict';

    angular.module('app')
    .controller('dashboardCategoriesFormCtrl', ['$scope', 'close', '$routeParams', '$http', 'incidents','category', 'Query','DashboardCategoryService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, incidents, category, Query,DashboardCategoryService) {

        function init() {

            if($routeParams.id !== undefined) {
                $scope.classId = $routeParams.id;
            }
            $scope.data = category;
            $scope.incidents = incidents;
            $scope.user = Query.getCookie('user');
        }

        $scope.submit = function() {
            if($scope.data.id === undefined) {
                $scope.data.userAccountId = $scope.user.userAccountId;
                DashboardCategoryService.create($scope.data).then(function(response){
                    toastr.success("Dashboard category saved successfully!");
                    close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/dashboard-categories/category-save', {data: $scope.data}).then(function(response) {
                  
                // });
            }
            else {
                $scope.data.incident = null;
                DashboardCategoryService.update($scope.data).then(function(response){
                    toastr.success("Dashboard category updated successfully!");
                    close();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/dashboard-categories/update', {data: $scope.data}).then(function(response) {

                // });
            }
        };
        $scope.close = function() {
            close();
        }
        init();

    }
}());
