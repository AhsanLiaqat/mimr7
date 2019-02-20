(function () {
    'use strict';

    angular.module('app')
        .controller('messageShowDetailCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter', 'message','ModalService','$sce','$uibModal','activeRecord','messageListing','questionDetail', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter, message,ModalService,$sce,$uibModal,activeRecord,messageListing,questionDetail) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        //fetch and set initial data
        function init() {
            $scope.documents = [];
            $scope.activeRecord = activeRecord;
            $scope.messageListing = messageListing;
            $scope.questionDetail = questionDetail;
            $scope.message = angular.copy(message);
            $scope.user = Query.getCookie('user');
        }

        init();

        //convert html to styled text
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }

    }
}());