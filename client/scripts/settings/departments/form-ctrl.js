(function () {
    'use strict';

    angular.module('app')
        .controller('departmentCreateCtrl', ['$scope', 'close', '$location', '$routeParams', '$http', 'AuthService', 'department', 'Query','DepartmentService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http, AuthService, department, Query,DepartmentService) {

        function init() {
            $scope.user = Query.getCookie('user');
            if(department !== undefined) {
                $scope.name = department.name;
            }
        }

        $scope.submit = function(name) {
            if(department !== 'undefined') {
                department.name = name;
                DepartmentService.update(department).then(function(response){
                    toastr.success("Department updated successfully!");
                    close(response);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/departments/update', {data: department}).then(function(response) {
                    
                // });
            }
            else {
                var data = {};
                data.userAccountId = $scope.user.userAccountId;
                data.name = name;
                if(data.name != null){
                    DepartmentService.create(data).then(function(response){
                        toastr.success("Department saved successfully!");
                        close(data);
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/departments/save', {data: data}).then(function(response) {
                        
                    // });
                }else{
                    toastr.error("Please provide Name");
                }
            }

        }

        $scope.close = function() {
            close();
        }

        init();

    }
}());
