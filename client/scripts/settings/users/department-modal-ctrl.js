(function () {
    'use strict';

    angular.module('app')
        .controller('departmentModalCtrl', ['$scope', 'close', '$filter','$routeParams', '$http', 'AuthService', '$location','DepartmentService', ctrlFunction]);

        function ctrlFunction($scope, close ,$filter,$routeParams, $http, AuthService, $location,DepartmentService) {

             function init() {
                $scope.data={};

             }

             $scope.submit = function(name){
                $scope.data.name = name;
                DepartmentService.create($scope.data).then(function(response){
                    toastr.success("Department updated successfully!");
                    close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/departments/save', {data: $scope.data}).then(function(response) {
                    
                // });
             }
             init();

             $scope.close = function() {
             };
        }
}());
