(function () {
    'use strict';

    angular.module('app')
        .controller('messageViewCtrl', ['$scope', 'close', '$filter','$routeParams', '$http', 'AuthService', '$location', 'msg', ctrlFunction]);

        function ctrlFunction($scope, close ,$filter,$routeParams, $http, AuthService, $location, msg) {

             function init() {
                $scope.message = msg;
             }
             init();

             $scope.close = function() {
 	            close();
             };
        }
}());
