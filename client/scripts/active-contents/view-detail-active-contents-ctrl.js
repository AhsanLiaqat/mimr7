(function () {
    'use strict';

    angular.module('app')
        .controller('viewDetailActiveContentCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$timeout','$rootScope','Query', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$timeout,$rootScope,Query) {
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
        $scope.setOffTimeFormat = function (dat) {
            return moment(dat).utc().local().format('mm:ss');
        };

        var setSocketForContentMessages = function () {
            $timeout(function () {
                console.log('Listening ----> detail_content:'+$routeParams.gameId);
                SOCKET.on('detail_content:'+$routeParams.gameId, function (response) {
                    console.log('Message Recieved ----> detail_content:'+$routeParams.gameId,response.data);
                    var reslt = response.data;
                    if(reslt){
                        switch (response.action) {
                            case 'update':
                                // angular.forEach($scope.questionSchedule, function (question,ind){
                                //     // let questionArr = question.data.filter((q) => {
                                //     //     return q.id == data.id;
                                //     // });
                                //     // console.log(questionArr,"questionArr")
                                //     // if(!questionArr.length){
                                //     //     question.data.push(data);
                                //     // }
                                // var found = false;
                                // for (var i = 0; i < $scope.questionSchedule.length; i++) {
                                //     for (var j = 0; j < $scope.questionSchedule[i].data.length; j++) {
                                //         if ($scope.questionSchedule[i].data[j].id === reslt.id) {
                                //             $scope.questionSchedule[i].data[j] = angular.copy(reslt);
                                //             found = true;
                                //             break;
                                //         }
                                //     }
                                //     if(found)break;
                                // }
                                var found = false;
                                for(var i = 0; i < $scope.playContent.question_schedulings.length; i++){
                                    if($scope.playContent.question_schedulings[i].id === reslt.id){
                                        $scope.playContent.question_schedulings[i] = angular.copy(reslt);
                                        found = true;
                                        break;
                                    }
                                    if(found)break;
                                }
                                break;
                            case 'skip':
                                // for(var i = 0; i < $scope.questionSchedule.length; i++){
                                //     for(var j = 0; j < $scope.questionSchedule[i].data.length; j++){
                                //         if($scope.questionSchedule[i].data[j].id === reslt.id){
                                //             $scope.questionSchedule[i].data[j] = angular.copy(reslt);
                                //             found = true;
                                //             break;
                                //         }
                                //     }
                                //     if(found)break;
                                // }
                                var found = false;
                                for(var i = 0; i < $scope.playContent.question_schedulings.length; i++){
                                    if($scope.playContent.question_schedulings[i].id === reslt.id){
                                        $scope.playContent.question_schedulings[i] = angular.copy(reslt);
                                        found = true;
                                        break;
                                    }
                                    if(found)break;
                                }
                                toastr.success('Message Skipped', 'Success!');
                                break;
                        }
                    }else{
                        console.log('Recieved Nothing on ---> detail_content:'+$routeParams.gameId);
                    }
                    $scope.$apply();
                });
            });
        }

        //fetch and set initial data
        function init() {
            $scope.user = Query.getCookie('user');
            $scope.gameId = $routeParams.gameId;

            $http.get('/content-plan-templates/play-content-summary/' + $scope.gameId).then(function (response) {
                $scope.playContent = response.data;
                $scope.time = new Date($scope.playContent.start_time).getTime();
                // $scope.questionSchedule = [];
                // angular.forEach($scope.playContent.question_schedulings, function (scheduledQuestion,ind){
                //     if (scheduledQuestion.question){
                //         putData(scheduledQuestion.question.name,$scope.questionSchedule,scheduledQuestion,scheduledQuestion.question.id,scheduledQuestion.offset);
                //     }else{
                //         putData('N/A',$scope.questionSchedule,null,null,'N/A');
                //     }
                // });

            });
            setSocketForContentMessages();
        };


        var putData =  function(search,graph,inc,questionId,offset){
            var type = Query.filter(graph,{'name': search},true);
            if(type){
                type.data.push(inc);
            }else{
                graph.push({id:questionId,name: search,offset : offset,data: []});
                var type = Query.filter(graph,{'name': search},true);
                type.data.push(inc);
            }
        }

        init();

        $scope.showMessageDetail = function(record) {
            ModalService.showModal({
                templateUrl: "views/content-messages/message-show-modal.html",
                controller: "messageShowDetailCtrl",
                inputs:{
                    message: record,
                    activeRecord : 'activeRecord',
                    messageListing : null,
                    questionDetail : null

                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result && result !== ''){
                    }
                });
            });
        };

        $scope.showQuestionDetail = function(record) {
            ModalService.showModal({
                templateUrl: "views/content-messages/message-show-modal.html",
                controller: "messageShowDetailCtrl",
                inputs:{
                    message: record,
                    activeRecord : null,
                    messageListing : null,
                    questionDetail : 'questionDetail'
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result && result !== ''){
                    }
                });
            });
        };

        $scope.sendQuestion = function (contentQuestion) {
            $http.post('/question-scheduling/send-question/' + contentQuestion.id).then(function (response) {
            });
        };

        $scope.skipQuestion = function(contentQuestion){
            $http.post('/question-scheduling/update/' + contentQuestion.id,{data : {skip: true,skipped_At : new Date()}})
            .then(function (response) {
                
            });
        }

        $scope.cancelContent =function(){
            $http.post('/content-plan-templates/cancel-content/'+$scope.gameId, {status: 'stop'})
            .then(function(response){
                $location.path("/closed-contents");
            });
        }

        //close modal
        $scope.close = function (params) {
            params = (params == null || params == undefined) ? '' : params; 
            // close(params);
        };

    }
}());