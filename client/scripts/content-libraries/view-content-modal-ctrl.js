(function () {
    'use strict';

    angular.module('app')
        .controller('viewContentModalCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','$sce','$uibModal','content', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter,ModalService,$sce,$uibModal,content) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        //fetch and set initial data
        function init() {
            $scope.content = angular.copy(content);
            $scope.user = Query.getCookie('user');
        }

        init();

        //convert html to styled text
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }

    }
}());