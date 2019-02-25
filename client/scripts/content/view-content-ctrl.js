/*View - Content*/
/*In this controller we implement functionality for view contents of articles*/
/*Naveed Iftikhar*/
(function () {
    'use strict';

    angular.module('app')
        .controller('viewContentCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','$sce','$uibModal', addFunction]);

    function addFunction($scope, $routeParams, $http, AuthService, Query, filterFilter,ModalService,$sce,$uibModal) {

        function init() {
            $scope.user = Query.getCookie('user');
            $scope.contentShow = false;
            $scope.chapter = {};
            $scope.data = {};
            $scope.articleId = $routeParams.articleId;
            $http.get('messages/all?id=' + $routeParams.articleId).then(function(response){
                $scope.message = response.data;
            });
            $http.get('/articles/get/' + $routeParams.articleId).then(function(response){
                $scope.article = response.data;
                $scope.currentStatus = $scope.article.chapters[0];
            });

        }


        init();
        $scope.toggleMenu = (question) => {
            question.show = !question.show;
        }
        $scope.addContent = () => {
            $scope.contentShow = !$scope.contentShow;
        }
        $scope.save = () => {
            if($scope.data.id){
                $scope.data.articleId = $scope.message.articleId;
                $http.post('/messages/update/' + $scope.data.id,{data : $scope.data})
                .then(function(res){
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
            }else{
                $scope.data.articleId = $scope.articleId;
                $http.post('/messages/save',{data : $scope.data})
                .then(function(res){
                    $scope.data = res.data;
                    $scope.message.push(res.data);
                    toastr.success('Message Added.', 'Success!');
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
            }
                
        };

        $scope.saveContent = () => {
            $scope.chapter.articleId = $scope.articleId;
            $scope.chapter.name =  'chapter ' + ($scope.article.chapters.length + 1);
            if($scope.chapter.text){
                $http.post('/chapters/save',{data : $scope.chapter}).then(function(res){
                    $scope.article.chapters.push(res.data);
                    $scope.currentStatus = res.data;
                    $scope.contentShow = false;
                    $scope.chapter.name = '';
                    $scope.chapter.text = '';
                });
            }else{
                toastr.error('Enter All Fields');
            }
        }

        $scope.changeStatus = (chap) => {
            $http.get('/chapters/get/' + chap.id).then(function(res){
                $scope.currentStatus = res.data;
            });
        };

        $scope.edit = (question) => {
            $(".add-query").addClass("slide-div");
            $(".questions-wrapper").addClass("questions-wrapper-bg");
            $scope.data = question;
        };

         $('.main-wrapper').click(function(event){
            if(!($(event.target).hasClass('question-manage') || $(event.target).parents('.question-manage').length > 0)){
                angular.forEach( $scope.message , function(value){
                    value.show = false;
                })
                $scope.$apply();
            }
        });

        $scope.delete = (messageId,index) => {
            $http.delete('/messages/remove/' + messageId)
            .then(function(res){
                $scope.data = res.data;
                $scope.message.splice(index,1);
                toastr.success('Question Deleted.', 'Success!');

            });
        };

        //convert html to styled text
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }

    }
}());