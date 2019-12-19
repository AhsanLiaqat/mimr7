(function () {
    'use strict';

    angular.module('app')
        .controller('classStudentsCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','$sce','$uibModal','students', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter,ModalService,$sce,$uibModal,students) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        //fetch and set initial data
        function init() {
            $scope.students = students;
        }

        init();
    }
}());