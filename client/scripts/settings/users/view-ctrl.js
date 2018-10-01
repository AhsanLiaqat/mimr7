(function () {
    'use strict';

    angular.module('app')
        .controller('userViewCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'id','AccountService','LocationService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, AuthService, id, AccountService, LocationService) {
        
        $scope.close = function(result) {
 	        close(result);
        };

        function init() {
            var path = '/users/get';
            $http.post('/users/get', {id: id}).then(function(res) {
                $scope.data = res.data;
                $scope.notEdit = true;
            });

            AuthService.user().then(function(response) {
                // var path = '/settings/accounts/get?id=' + response.id;
                if(response.id !== undefined) {
                    AccountService.get(response.id).then(function(account){
                        if(account.data.id !== undefined) {
                            LocationService.get(account.data.id).then(function(locations){
                                $scope.locations = locations.data;
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // var query = '/settings/locations/get?id=' + account.data.id;
                            // $http.get(query).then(function(locations) {
                                
                            // });
                        }
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get(path).then(function(account) {
                        
                    // });
                }
            });
        }

        init();

    }

}());
