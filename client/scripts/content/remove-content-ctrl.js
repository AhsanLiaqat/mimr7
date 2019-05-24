(function () {
    'use strict';

    angular.module('app')
    .controller('removeContentCtrl', ['$scope',
        '$rootScope',
        'close',
        '$routeParams',
        '$http',
        'AuthService',
        '$location',
        ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        $routeParams,
        $http,
        AuthService,
        $location
        ) {

        function init() {
            $scope.answer = '';
        };
        init();
        $scope.submit = function(){
            var data = {};
            data.answer = $scope.answer;
            console.log(data);
            close(data);
        }
    }
} ());
