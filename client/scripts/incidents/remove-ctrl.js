(function () {
    'use strict';

    angular.module('app')
        .controller('removeCtrl', ['$scope', 'close', '$routeParams', teamFunction]);

        function teamFunction($scope, close, $routeParams,n) {

            function init() {
               
            }

            $scope.submit = function() {
                close("delete");
            };

            $scope.close = function(response) {
                close();
            };


            init();
        }
}());
