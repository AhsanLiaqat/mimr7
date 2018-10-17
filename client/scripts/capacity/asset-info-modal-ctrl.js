(function () {
    'use strict';

    angular.module('app')
    .controller('assetsInfoModalCtrl', ['$scope', 'close', '$http', 'AuthService', 'info', ctrlFunction]);
    function ctrlFunction($scope, close, $http, AuthService, info    ) {

        function init() {
            $scope.info = info;
        };
        init();
        $scope.close = function () {
            close();
        };
    }
    angular.module('app').
    filter('htmlToPlaintext', function() {
        return function(text) {
            return angular.element(text).text();
        }
    }
);
}());
