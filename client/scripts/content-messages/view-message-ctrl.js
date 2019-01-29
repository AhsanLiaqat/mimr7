(function () {
    'use strict';

    angular.module('app')
        .controller('viewMessageCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','$sce','$uibModal', addFunction]);

    function addFunction($scope, $routeParams, $http, AuthService, Query, filterFilter,ModalService,$sce,$uibModal) {

        function init() {
            $scope.heading = 'Show Message Detail';
            $scope.user = Query.getCookie('user');
            $http.get('messages/get?id=' + $routeParams.messageId).then(function(response){
                $scope.message = response.data;
            });
            $http.get('questions/all/' + $routeParams.messageId).then(function(response){
                $scope.questions = response.data;
            });
        }

        init();
        $scope.toggleMenu = (question) => {
            question.show = !question.show;
        }
        $scope.save = function () {
            if($scope.data.id){
                $scope.data.messageId = $scope.message.id;
                $scope.data.articleId = $scope.message.articleId;
                $http.post('/questions/update/' + $scope.data.id,{data : $scope.data})
                .then(function(res){
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
            }else{
                $scope.data.messageId = $scope.message.id;
                $scope.data.articleId = $scope.message.articleId;
                $http.post('/questions/save',{data : $scope.data})
                .then(function(res){
                    $scope.data = res.data;
                    $scope.questions.push(res.data);
                    toastr.success('Question Added.', 'Success!');
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
            }
                
        };

        $scope.edit = function(question){
            $(".add-query").addClass("slide-div");
            $(".questions-wrapper").addClass("questions-wrapper-bg");
            $scope.data = question;
        };

         $('.main-wrapper').click(function(event){
            if(!($(event.target).hasClass('question-manage') || $(event.target).parents('.question-manage').length > 0)){
                angular.forEach( $scope.questions , function(value){
                    value.show = false;
                })
                $scope.$apply();
            }
        });

        $scope.delete = function(questionId,index){
            $http.delete('/questions/delete/' + questionId)
            .then(function(res){
                $scope.data = res.data;
                $scope.questions.splice(index,1);
                toastr.success('Question Deleted.', 'Success!');

            });
        };

        //convert html to styled text
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }

    }
}());