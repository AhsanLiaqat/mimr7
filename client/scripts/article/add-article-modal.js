(function () {
    'use strict';

    angular.module('app')
    .controller('addArticleModalCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query','close', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query, close) {

        $scope.save = function () {
            $http.post('/article/articles/save',{data : $scope.data})
            .then(function(res){
                $scope.data = res.data;
                toastr.success('Content Added.', 'Success!');
                $scope.close(res.data);
            });
        };

        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };
    }
}());