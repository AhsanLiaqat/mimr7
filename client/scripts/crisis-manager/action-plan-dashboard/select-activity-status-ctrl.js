(function () {
    'use strict';

    angular.module('app')
    .controller('selectActivityStatusCtrl', ['$scope',
    '$rootScope',
    'close',
    '$routeParams',
    '$http',
    'AuthService',
    'initialStatus',
    ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        $routeParams,
        $http,
        AuthService,
        initialStatus
    ) {

        function init() {
            $scope.status = angular.copy(initialStatus);
            $scope.statusOptions = [
                { value: 'incomplete', name: 'No Information' },
                { value: 'in progress', name: 'In Progress' },
                { value: 'completed', name: 'Completed' },
                { value: 'overdue', name: 'Overdue' },
                { value: 'na', name: 'N/A' }];
            };

            init();

            $scope.update = function(){
                close($scope.status);
            };

            $scope.close = function (params) {
                params = (params == null || params == undefined)?'': params;
                close();
            };
        }
    } ());
