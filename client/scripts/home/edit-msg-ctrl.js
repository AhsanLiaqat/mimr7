(function () {
    'use strict';

    angular.module('app')
        .controller('editMsgModalCtrl', ['$scope', 'close', '$location', '$routeParams', '$http','email','sms', 'AuthService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http,email,sms,  AuthService) {
        
        function init() {
            $scope.email = email;
            $scope.sms = sms;
            $scope.data = {};
            $scope.data.email = $scope.email;
            $scope.data.sms = $scope.sms;
        }
        $scope.close = function() {
            close($scope.data);
        }

        init();
        
    }
}());