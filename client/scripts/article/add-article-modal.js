(function () {
    'use strict';

    angular.module('app')
    .controller('addArticleModalCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query','close','gameId', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query, close,gameId) {
        $scope.gameId = gameId;
        if(gameId){
            $http.get('/articles/get/' + gameId)
            .then(function (response) {
                $scope.data = response.data;
                if($scope.data.private == true){
                    $scope.data.private = 'true';
                }else{
                    $scope.data.private = 'false';
                }

                if($scope.data.saleable == true){
                    $scope.data.saleable = 'true';
                }else{
                    $scope.data.saleable = 'false';
                }

            });
        }
        $scope.save = function () {
            if($scope.data.id == null){
                $http.post('/articles/save',{data : $scope.data})
                .then(function(res){
                    $scope.data = res.data;
                    toastr.success('Content Added.', 'Success!');
                    $scope.close(res.data);
                });
            }else{
                $http.post('/articles/update/' + $scope.data.id,{data : $scope.data})
                .then(function(res){
                    $scope.data = res.data;
                    toastr.success('Content Added.', 'Success!');
                    $scope.close(res.data);
                });
            }
        };

        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };
    }
}());