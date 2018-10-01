(function () {
    'use strict';

    angular.module('app')
    .controller('quickEditUser', ['$scope', 'close', '$routeParams', '$http', 'AuthService', '$location', 'User', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, AuthService, $location, User) {
        function init() {
            $scope.data = User;

        };
        init();

        $scope.submitUser = function () {
            $http.post('users/update', { data: $scope.data }).then(function (res) {
                toastr.info("Update successful");
                close($scope.data);
            });
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params;
            close(params);
        };
    }
}());
