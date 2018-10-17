(function () {
    'use strict';

    angular.module('app')
        .controller('messageResponseDetailCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','$sce','$uibModal','message', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter,ModalService,$sce,$uibModal, message) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        function init() {
            $scope.message = angular.copy(message);
        }

        init();

        
          
    }
}());