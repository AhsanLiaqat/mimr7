(function () {
    'use strict';

    angular.module('app')
    .controller('TeamAlertAckModalCtrl', ['$scope',
    'close',
    ctrlFunction]);

    function ctrlFunction($scope,
        close
    ) {
            $scope.close = function () {
                close();
            };
        }
    }());
