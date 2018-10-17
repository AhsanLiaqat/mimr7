(function () {
    'use strict';

    angular.module('app')
    .controller('quickCreateUser', ['$scope', 'close', '$http', 'AuthService', '$location','Query', ctrlFunction]);

    function ctrlFunction($scope, close, $http, AuthService, $location,Query) {
        function init() {

            $scope.data = {};
            $scope.user = Query.getCookie('user');
            $scope.data.userCountry = $scope.user.userCountry;
            $scope.data.countryCode = $scope.user.countryCode;
        };
        init();

        $scope.submitUser = function () {
            if($scope.data.firstName == undefined || $scope.data.lastName == undefined || $scope.data.email == undefined || $scope.data.password == undefined || $scope.data.mobilePhone == undefined){
                toastr.error("Fill required(*) fieled!");
            }else {
                $http.post('/users/create', { data: $scope.data }).then(function (res) {
                    toastr.success("User added successfully");
                    close(res.data);
                });
            }

        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params;
            close(params);
        };
    }
}());
