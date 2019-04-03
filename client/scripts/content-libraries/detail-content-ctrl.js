/*Detail - Content*/
/*In this controller we implement functionality for detail contents of articles*/
/*Naveed Iftikhar*/
(function () {
    'use strict';

    angular.module('app')
        .controller('detailContentCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','$sce','$uibModal', addFunction]);

    function addFunction($scope, $routeParams, $http, AuthService, Query, filterFilter,ModalService,$sce,$uibModal) {

        function init() {
            $scope.user = Query.getCookie('user');
            $scope.contentShow = false;
            $scope.chapter = {};
            $scope.data = {};
            $scope.contentId = $routeParams.contentId;
            $http.get('/chapters/get/' + $scope.contentId).then(function (respp) {
                $scope.chapter = respp.data;
                $scope.currentStatus = $scope.chapter;
                $http.get('/articles/get/' + $scope.chapter.articleId).then(function(response){
                    $scope.article = response.data;
                });
                $http.get('messages/all?id=' + $scope.chapter.articleId).then(function(response){
                    $scope.message = response.data;
                });
            });
            

        }


        init();
        $scope.toggleMenu = (question) => {
            question.show = !question.show;
        }
        // $scope.addContent = () => {
        //     $scope.contentShow = !$scope.contentShow;
        // }
        $scope.save = () => {
            if($scope.data.id){
                $scope.data.articleId = $scope.article.id;
                $http.post('/messages/update',{data : $scope.data})
                .then(function(res){
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
            }else{
                if($scope.data.content){
                    $scope.data.articleId = $scope.article.id;
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

        // $scope.saveContent = () => {
        //     $scope.chapter.articleId = $scope.articleId;
        //     $scope.chapter.name =  'chapter ' + ($scope.article.chapters.length + 1);
        //     if($scope.chapter.text){
        //         $http.post('/chapters/save',{data : $scope.chapter}).then(function(res){
        //             $scope.article.chapters.push(res.data);
        //             $scope.currentStatus = res.data;
        //             $scope.contentShow = false;
        //             $scope.chapter.name = '';
        //             $scope.chapter.text = '';
        //         });
        //     }else{
        //         toastr.error('Enter All Fields');
        //     }
        // }

        $scope.changeStatus = (chap) => {
            // $http.get('/chapters/get/' + chap.id).then(function(res){
                $scope.currentStatus = chap;
            // });
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