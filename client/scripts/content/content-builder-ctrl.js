/*Content - Builder*/
/*In this controller we implement functionality for making complete content with highlights and messages*/
/*Naveed Iftikhar*/
(function () {
    'use strict';

    angular.module('app')
        .controller('contentBuilderCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','$sce','$uibModal', addFunction]);

    function addFunction($scope, $routeParams, $http, AuthService, Query, filterFilter,ModalService,$sce,$uibModal) {

        function init() {
            $scope.user = Query.getCookie('user');
            $scope.contentShow = false;
            $scope.contentToShow = true;
            $scope.highlightsToShow = false;
            $scope.messagesToShow = false;
            $scope.chapter = {};
            $scope.messageRes = {};
            $scope.data = {};
            $scope.articleId = $routeParams.articleId;
            $http.get('/articles/all').then(function(response){
                $scope.article = response.data;
                $scope.currentArticle = $scope.article[0];
                $scope.message = $scope.currentArticle.messages;
                $scope.questions = $scope.message[0].questions;
                $scope.chapters = $scope.currentArticle.chapters;
                $scope.currentStatus = $scope.chapters[0]; 
            });
        }

        $scope.changeArticle = function (record) {
            $scope.selectedArticle = record;
            $http.get('/articles/get/' + $scope.selectedArticle.id).then(function(response){
                $scope.currentArticle = response.data;
                $scope.message = $scope.currentArticle.messages;
                $scope.chapters = $scope.currentArticle.chapters;
                $scope.currentStatus = $scope.chapters[0]; 
            });
        };


        init();

        $scope.toggleMenu = (question) => {
            question.show = !question.show;
        }

        $scope.toggleList = (messageRes) => {
            messageRes.show = !messageRes.show;
        }

        $scope.toggleContentList = () => {
            $scope.contentToShow = true;
            $scope.highlightsToShow = false;
            $scope.messagesToShow = false;
        }

        $scope.toggleHighlightList = () => {
            $scope.contentToShow = false;
            $scope.highlightsToShow = true;
            $scope.messagesToShow = false;
        }

        $scope.toggleMessageList = () => {
            $scope.contentToShow = false;
            $scope.highlightsToShow = false;
            $scope.messagesToShow = true;
        }

        $scope.close = () => {
            $(".add-query").removeClass("slide-div");
            $(".questions-wrapper").removeClass("questions-wrapper-bg");
        } 

        $scope.addContent = () => {
            $scope.contentShow = !$scope.contentShow;
        }
        $scope.save = () => {
            if($scope.data.id){
                $scope.data.articleId = $scope.currentArticle.id;
                $http.post('/messages/update',{data : $scope.data})
                .then(function(res){
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
            }else{
                if($scope.data.content){
                    $scope.data.articleId = $scope.currentArticle.id;
                    $http.post('/messages/save',{data : $scope.data})
                    .then(function(res){
                        $scope.data = res.data;
                        $scope.message.push(res.data);
                        toastr.success('Message Added.', 'Success!');
                        $(".add-query").removeClass("slide-div");
                        $(".questions-wrapper").removeClass("questions-wrapper-bg");
                    });
                }else{
                    toastr.error('Enter All Fields');
                }
            }
                
        };

        $scope.addCollection = function () {
            ModalService.showModal({
                templateUrl: "views/content/new-content-making.html",
                controller: "addArticleModalCtrl",
                inputs: {
                    gameId: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.article.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.saveMessage = () => {
            if($scope.data.id){
                $scope.data.messageId = $scope.msg.id;
                $scope.data.articleId = $scope.currentArticle.id;
                $http.post('/questions/update/' + $scope.data.id,{data : $scope.data})
                .then(function(res){
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
            }else{
                if($scope.data.name && $scope.msg.id){
                    $scope.data.messageId = $scope.msg.id;
                    $scope.data.articleId = $scope.currentArticle.id;
                    $http.post('/questions/save',{data : $scope.data})
                    .then(function(res){
                        $scope.data = res.data;
                        $scope.questions.push(res.data);
                        toastr.success('Message Added.', 'Success!');
                        $(".add-query").removeClass("slide-div");
                        $(".questions-wrapper").removeClass("questions-wrapper-bg");
                    });
                }else{
                    toastr.error('Enter All Fields');
                }
            }
                
        };

        $scope.changeHighlight = (chkId) => {
            $scope.msg = Query.filter($scope.message, { id: chkId}, true);
            Query.setCookie('highlightSelected', $scope.msg.id);
            $http.get('/questions/all/' + $scope.msg.id).then(function(res){
                $scope.questions = res.data;
                console.log('--',$scope.questions);
            });
        };

        $scope.changeMessage = (chkId) => {
            $scope.ques = Query.filter($scope.questions, { id: chkId}, true);
            console.log('--',$scope.ques);
            Query.setCookie('messageSelected', $scope.ques.id);
            $http.get('/responses/get/' + $scope.ques.id).then(function(res){
                $scope.messageRes = res.data;
                console.log('--',$scope.messageRes);
            });
        };

        $scope.saveContent = () => {
            $scope.chapter.articleId = $scope.currentArticle.id;
            $scope.chapter.name =  'chapter ' + ($scope.chapters.length + 1);
            if($scope.chapter.text){
                $http.post('/chapters/save',{data : $scope.chapter}).then(function(res){
                    $scope.chapters.push(res.data);
                    $scope.currentStatus = res.data;
                    $scope.contentShow = false;
                    $scope.chapter.name = '';
                    $scope.chapter.text = '';
                });
            }else{
                toastr.error('Enter All Fields');
            }
        }

        $scope.saveResponse = () => {
            if($scope.data.id){
                $scope.data.questionId = $scope.ques.id;
                $scope.data.articleId = $scope.currentArticle.id;
                $http.post('/responses/update/' + $scope.data.id,{data : $scope.data})
                .then(function(res){
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
            }else{
                if(!$scope.messageRes){
                    if($scope.data.name && $scope.ques.id){
                        $scope.data.questionId = $scope.ques.id;
                        $scope.data.articleId = $scope.currentArticle.id;
                        $http.post('/responses/save',{data : $scope.data})
                        .then(function(res){
                            $scope.messageRes = res.data;
                            toastr.success('Response Added.', 'Success!');
                            $(".add-query").removeClass("slide-div");
                            $(".questions-wrapper").removeClass("questions-wrapper-bg");
                        });
                    }else{
                        toastr.error('Enter All Fields');
                    }
                }else{
                    toastr.error('Response is Already Exist');
                }
            }
                
        };

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

        $('.main-wrapper').click(function(event){
            if(!($(event.target).hasClass('question-manage') || $(event.target).parents('.question-manage').length > 0)){
                angular.forEach( $scope.questions , function(value){
                    value.show = false;
                })
                $scope.$apply();
            }
        });

        $('.main-wrapper').click(function(event){
            if(!($(event.target).hasClass('question-manage') || $(event.target).parents('.question-manage').length > 0)){
                $scope.messageRes.show = false;
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
        $scope.deleteResponse = (responseId,index) => {
            $http.delete('/responses/remove/' + responseId)
            .then(function(res){
                $scope.messageRes = '';
                toastr.success('Response Deleted.', 'Success!');
            });
        };

        $scope.deleteMessage = (questionId,index) => {
            $http.delete('/questions/delete/' + questionId)
            .then(function(res){
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