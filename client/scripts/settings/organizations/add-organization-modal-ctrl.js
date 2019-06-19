(function () {
    'use strict';

    angular.module('app')
        .controller('addOrganizationModalCtrl', ['$scope', '$location', '$routeParams', '$http', 'AuthService','OrganizationService','close', ctrlFunction]);

    function ctrlFunction($scope, $location, $routeParams, $http, AuthService, OrganizationService,close) {

        function init() {
            // if($routeParams.id !== undefined) {
            //     OrganizationService.get($routeParams.id).then(function(response){
            //         $scope.data = response.data;
            //     },function(err){
            //         if(err)
            //             toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            //         else
            //             toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            //     });
            //     // var path = "/settings/organizations/get?id=" + $routeParams.id;
            //     // $http.get(path).then(function(response) {
                    
            //     // });
            // }
        }
        $scope.save = function() {
            // if($routeParams.id !== undefined) { 
                // OrganizationService.update($scope.data).then(function(response){
                //     toastr.success("Organization updated successfully.");
                //     $location.path('/settings/organizations')
                // },function(err){
                //     if(err)
                //         toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                //     else
                //         toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                // });
                // $http.post('/settings/organizations/update', {data: $scope.data}).then(function(response) {
                    
                // });
            // }
            // else {
                OrganizationService.save($scope.data).then(function(response){
                    toastr.success("Organization created successfully.");
                    close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/organizations/save', {data: $scope.data}).then(function(response) {
                    
                // });
            // }
           
        };

        init();

        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };

    }

}());
