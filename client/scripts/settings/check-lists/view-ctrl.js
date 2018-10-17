(function () {
    'use strict';

    angular.module('app')
    .controller('checkListViewCtrl', ['$scope', 'close', '$filter', '$location', '$routeParams','$route', '$http', 'AuthService', 'checklist', ctrlFunction]);

    function ctrlFunction($scope, close, $filter, $location, $routeParams,$route, $http, AuthService, checklist) {

        function init() {
            $scope.checklist = checklist;
            if($scope.checklist && $scope.checklist.tasks){
                $scope.tasks = $scope.checklist.tasks;
            }
        };
        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.tasks = $filter('orderBy')($scope.tasks, rowName);

        };
        $scope.close = function() {
            close();
        }
        init();
    }
}());
