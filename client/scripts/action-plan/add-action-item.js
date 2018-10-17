(function () {
    'use strict';

    angular.module('app')
    .controller('AddActionItemCtrl', ['$scope', 'close', '$location', '$routeParams', '$http', 'Query','DepartmentService','AllCategoryService','TaskService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http,Query,DepartmentService, AllCategoryService, TaskService) {

        function init() {
            $scope.user = Query.getCookie('user');
            DepartmentService.getAll($scope.user.userAccountId).then(function(response){
                $scope.departments = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/settings/departments/all?userAccountId=" + $scope.user.userAccountId ;
            // $http.get(path).then(function(response) {
                
            // });
            AllCategoryService.list($scope.user.userAccountId).then(function(res){
                 $scope.categories = res.data;
             },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
             });
            // $http.get("/settings/all-categories/list").then(function (res) {
               
            // });

        }

        $scope.submit = function(task) {
            TaskService.save(task).then(function(response){
                toastr.success("Task created", 'Success!')
                close(response.data);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/tasks/save', {data: task}).then(function(response) {
                
            // });

        }

        $scope.close = function(params) {
            params = (params == null || params == undefined)?'': params;
            close(params);
        }

        init();

    }
}());
