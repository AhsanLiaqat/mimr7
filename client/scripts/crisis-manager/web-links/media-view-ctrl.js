(function () {
    'use strict';

    angular.module('app')
    .controller('mediaViewModalCtrl', ['$scope', '$rootScope', 'close', 'ModalService', '$routeParams', '$http', 'AuthService', '$location', '$filter', 'link', '$sce', 'filterFilter','Query', ctrlFunction]);
    function ctrlFunction($scope, $rootScope, close, ModalService, $routeParams, $http, AuthService, $location, $filter, link, $sce, filterFilter ,Query) {

        function init() {
            $scope.link = $sce.trustAsResourceUrl(link);
            Query.setCookie('mediaLink',$scope.link)
        };
        init();

        $scope.close = function(){
            close();
        };
    }
} ());
