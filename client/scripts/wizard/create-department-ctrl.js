(function () {
    'use strict';

    angular.module('app')
        .controller('departmentCreateModalCtrl', ['$scope', 'close', '$location', '$routeParams', '$http', 'AuthService', 'Query','DepartmentService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http, AuthService, Query, DepartmentService) {

        function init() {
            $scope.user = Query.getCookie('user');
        }

        $scope.submit = function(name) {
                var data = {};
                data.userAccountId = $scope.user.userAccountId;
                data.name = name;
                DepartmentService.create(data).then(function(response){
                    toastr.success("Department saved successfully!");
                    close(response.data);
                },function(response){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/departments/save', {data: data}).then(function(response) {
                    
                // });

        }

        $scope.close = function() {
            close();
        }

        init();

    }
}());
