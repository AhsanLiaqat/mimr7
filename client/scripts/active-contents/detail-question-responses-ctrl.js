(function () {
    'use strict';

    angular.module('app')
        .controller('detailQuestionResponsesCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','$sce','$uibModal','arr','decider', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter,ModalService,$sce,$uibModal,arr, decider) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        //fetch and set initial data
        function init() {
            $scope.documents = [];
            $scope.records = arr;
            $scope.decider = decider;
            $scope.user = Query.getCookie('user');
        }

        init();

        //convert html to styled text
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }

    }
}());