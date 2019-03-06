(function () {
    'use strict';

    angular.module('app')
    .controller('newQuestionCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query','close','questionId', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query, close,questionId) {
        $scope.init = () => {
            $scope.questionId = questionId;
            if($scope.questionId){
                $http.get('/questions/one/' + $scope.questionId)
                .then(function(res){
                    $scope.data = res.data;
                });    
            }
            $http.get('/messages/all-messages')
            .then(function(res){
                $scope.messages = res.data;
            });
        }

        $scope.getArticleList = () => {
            $http.get('/messages/get/?id=' + $scope.data.messageId)
            .then(function(res){
                $scope.article = res.data;
            });
        }
        $scope.init();
        $scope.save = function () {
            $scope.data.messageId = $scope.data.messageId;
            if($scope.article == undefined){
                $scope.data.articleId = $scope.data.articleId;
            }else{
                $scope.data.articleId = $scope.article.articleId;
            }
            if($scope.questionId){
                $http.post('/questions/update/' + $scope.questionId,{data : $scope.data})
                .then(function(res){
                    $scope.data = res.data;
                    toastr.success('Question Updated.', 'Success!');
                    close(res.data);
                });
            }else{
                $http.post('/questions/save',{data : $scope.data})
                .then(function(res){
                    $scope.data = res.data;
                    toastr.success('Question Added.', 'Success!');
                    close(res.data);
                });
            }
                
        };

        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };
    }
}());