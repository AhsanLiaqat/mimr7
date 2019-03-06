(function () {
    'use strict';

    angular.module('app')
    .controller('newContentCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query','close','contentId','articleId', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query, close,contentId,articleId) {
        $scope.init = () => {
            $scope.contentId = contentId;
            $scope.articleId = articleId;
            if($scope.contentId){
                $http.get('/chapters/get/' + $scope.contentId)
                .then(function(res){
                    $scope.data = res.data;
                    $scope.articleId = $scope.data.articleId;
                });    
            }
            if(articleId){
                $http.get('/articles/get/' + articleId)
                .then(function(res){
                    $scope.article = res.data;
                });
            }
            $http.get('/articles/all')
            .then(function(res){
                $scope.articles = res.data;
            });
        }
        $scope.init();

        $scope.getChaptersList = () => {
            $http.get('/articles/get/' + $scope.articleId)
            .then(function(res){
                $scope.article = res.data;
            });
        }

        $scope.save = function () {
            if($scope.contentId){
                $http.post('/chapters/update/' + $scope.contentId,{data : $scope.data})
                .then(function(res){
                    $scope.data = res.data;
                    toastr.success('Question Updated.', 'Success!');
                    close(res.data);
                });
            }else{
                if($scope.articleId){
                    $scope.data.name =  'chapter ' + ($scope.article.chapters.length + 1);
                    $scope.data.articleId = $scope.articleId;
                    $http.post('/chapters/save',{data : $scope.data})
                    .then(function(res){
                        $scope.data = res.data;
                        toastr.success('Question Added.', 'Success!');
                        close(res.data);
                    });
                }else{
                    toastr.error('Enter All Fields');
                }
            }
                
        };

        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };
    }
}());