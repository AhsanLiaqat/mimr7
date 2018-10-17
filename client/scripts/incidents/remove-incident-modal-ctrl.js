(function () {
    'use strict';

    angular.module('app')
    .controller('removeIncidentCtrl', ['$scope',
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
            $scope.noSelectedColorsArr = [];
            angular.forEach($scope.colorPalettes, function(value,key) {
                if ($scope.selectedColorsArr.indexOf(value.color) < 0) {
                    $scope.noSelectedColorsArr.push(value.color);
                }
            });
            var data = {};
            data.answer = $scope.answer;
            console.log(data);
            close(data);
        }
    }
} ());
