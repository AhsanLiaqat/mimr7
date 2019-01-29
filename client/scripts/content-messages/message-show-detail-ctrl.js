(function () {
    'use strict';

    angular.module('app')
        .controller('messageShowDetailCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter', 'message','ModalService','$sce','$uibModal', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter, message,ModalService,$sce,$uibModal) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        //fetch and set initial data
        function init() {
            $scope.documents = [];
            $scope.message = angular.copy(message);
            $scope.heading = 'Show Message Detail';
            $scope.user = Query.getCookie('user');
        }

        init();

        //convert html to styled text
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }

    }
}());