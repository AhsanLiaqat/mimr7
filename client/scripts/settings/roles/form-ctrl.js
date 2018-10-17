(function () {
    'use strict';

    angular.module('app')
        .controller('rolesCreateCtrl', ['$scope', 'close', '$location', '$routeParams', '$http', 'role', 'AuthService','Query','RoleService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http, role, AuthService, Query, RoleService) {
        
        function init() {
            
            $scope.user = Query.getCookie('user');
            if(role !== 'undefined' && role != 1) {
                $scope.role = role;
                $scope.heading = "Create Role";
            }else if(role == 1){
                $scope.heading = "Create Responsibilty Level"
            }else{
                $scope.heaing = "Create Role";
                $scope.role = {};
            }
        }

        $scope.submit = function() {
            var data = {};
            if($scope.role.id == undefined) {
                data.userAccountId = $scope.user.id;
                data.name = $scope.role.name;
                RoleService.save(data).then(function(response){
                    toastr.success("Role saved successfully!");
                    close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/roles/save', {data: data}).then(function(response) {
                    
                // });
            }
            else {
                data.userAccountId = $scope.user.userAccountId;
                RoleService.update($scope.role).then(function(response){
                    toastr.success("Role updated successfully!");
                    close();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/roles/update', {data: $scope.role}).then(function(response) {
                    
                // }); 

            }
           
        }

        $scope.close = function() {
            close();
        }

        init();
        
    }
}());