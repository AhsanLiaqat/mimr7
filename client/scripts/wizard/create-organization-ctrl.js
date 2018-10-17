(function () {
    'use strict';

    angular.module('app')
        .controller('OrganizationCreateCtrl', ['$scope', 'close', '$location', '$routeParams', '$http', 'AuthService', 'Query','OrganizationService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http, AuthService, Query, OrganizationService) {

        function init() {
            $scope.user = Query.getCookie('user');
            $scope.data = {};


        }

        $scope.submit = function() {
                var data = {};
                data.userAccountId = $scope.user.userAccountId;
                data.name = name;
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

        }

        $scope.close = function() {
            close();
        }

        init();

    }
}());
