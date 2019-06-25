(function () {
    'use strict';

    angular.module('app')
        .controller('addOrganizationModalCtrl', ['$scope', '$location', '$routeParams', '$http', 'AuthService','OrganizationService','close','organizationId', ctrlFunction]);

    function ctrlFunction($scope, $location, $routeParams, $http, AuthService, OrganizationService,close,organizationId) {

        function init() {
            if(organizationId) {
                OrganizationService.get(organizationId).then(function(response){
                    $scope.data = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            }
        }
        $scope.save = function() {
            if(organizationId) { 
                OrganizationService.update($scope.data).then(function(response){
                    toastr.success("Organization updated successfully.");
                    close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            }
            else {
                OrganizationService.save($scope.data).then(function(response){
                    toastr.success("Organization created successfully.");
                    close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            }
           
        };

        init();

        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };

    }

}());
