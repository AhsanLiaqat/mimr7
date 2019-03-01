(function () {
    'use strict';

    angular.module('app')
        .controller('questionResponsesCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$timeout','$rootScope','Query', playGameCtrl]);

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
                                var found = false;
                                for (var i = 0; i < $scope.playerDetail.player_list.users.length; i++) {
                                    for (var j = 0; j < $scope.playerDetail.player_list.users[i].question_schedulings.length; j++) {
                                        if ($scope.playerDetail.player_list.users[i].question_schedulings[j].id === reslt.id) {
                                            $scope.playerDetail.player_list.users[i].question_schedulings[j] = angular.copy(reslt);
                                            found = true;
                                            break;
                                        }
                                    }
                                    if(found)break;
                                }
                                // var found = false;
                                // for(var i = 0; i < $scope.playContent.question_schedulings.length; i++){
                                //     if($scope.playContent.question_schedulings[i].id === reslt.id){
                                //         $scope.playContent.question_schedulings[i] = angular.copy(reslt);
                                //         found = true;
                                //         break;
                                //     }
                                //     if(found)break;
                                // }
                                // break;
                        }
                    }else{
                        console.log('Recieved Nothing on ---> detail_content:'+$routeParams.gameId);
                    }
                    $scope.$apply();
                });

                SOCKET.on('question_expired:'+$routeParams.gameId, function (response) {
                    console.log('Message Recieved ----> question_expired:'+$routeParams.gameId,response.data);
                    var reslt = response.data;
                    if(reslt){
                        switch (response.action) {
                            case 'sent':
                                var found = false;
                                for (var i = 0; i < $scope.playerDetail.player_list.users.length; i++) {
                                    for (var j = 0; j < $scope.playerDetail.player_list.users[i].question_schedulings.length; j++) {
                                        if ($scope.playerDetail.player_list.users[i].question_schedulings[j].id === reslt.id) {
                                            $scope.playerDetail.player_list.users[i].question_schedulings[j] = angular.copy(reslt);
                                            angular.forEach($scope.playerDetail.player_list.users , function(user){
                                                user.answerQuestions = 0;
                                                angular.forEach(user.question_schedulings,function(item){
                                                    if(item.answer){
                                                        user.answerQuestions++;
                                                    }
                                                });
                                            });
                                            found = true;
                                            break;
                                        }
                                    }
                                    if(found)break;
                                }
                            case 'questionAnwere':
                                var found = false;
                                for (var i = 0; i < $scope.playerDetail.player_list.users.length; i++) {
                                    for (var j = 0; j < $scope.playerDetail.player_list.users[i].question_schedulings.length; j++) {
                                        if ($scope.playerDetail.player_list.users[i].question_schedulings[j].id === reslt.questionSchedulingId) {
                                            $scope.playerDetail.player_list.users[i].question_schedulings[j].answer = reslt;
                                            angular.forEach($scope.playerDetail.player_list.users , function(user){
                                                user.answerQuestions = 0;
                                                angular.forEach(user.question_schedulings,function(item){
                                                    if(item.answer){
                                                        user.answerQuestions++;
                                                    }
                                                });
                                            });
                                            found = true;
                                            break;
                                        }
                                    }
                                    if(found)break;
                                }
                        }
                    }else{
                        console.log('Recieved Nothing on ---> question_expired:'+$routeParams.gameId);
                    }
                    $scope.$apply();
                });
            });
        }

        //fetch and set initial data
        function init() {
            $scope.user = Query.getCookie('user');
            $scope.gameId = $routeParams.gameId;

            // $http.get('/content-plan-templates/play-content-summary/' + $scope.gameId).then(function (response) {
            //     $scope.playContent = response.data;
            //     $scope.time = new Date($scope.playContent.start_time).getTime();
            //     $scope.questionSchedule = [];
            //     angular.forEach($scope.playContent.question_schedulings, function (scheduledQuestion,ind){
            //         if (scheduledQuestion.question){
            //             putData(scheduledQuestion.user.firstName,$scope.questionSchedule,scheduledQuestion,scheduledQuestion.user.id,scheduledQuestion.user.answers);
            //         }else{
            //             putData('N/A',$scope.questionSchedule,null,null,'N/A');
            //         }
            //     });

            // });
            $http.get('/content-plan-templates/get-player-detail/' + $scope.gameId).then(function (response) {
                $scope.playerDetail = response.data;
                angular.forEach($scope.playerDetail.player_list.users , function(user){
                    user.answerQuestions = 0;
                    angular.forEach(user.question_schedulings,function(item){
                        if(item.answer){
                            user.answerQuestions++;
                        }
                    });
                });
                $scope.time = new Date($scope.playerDetail.start_time).getTime();
            });
            setSocketForContentMessages();
        };

        $scope.detailsQuestions = (decider,ques) => {
            let inputs = [];
            if(decider == 'sent'){
                let arr = ques.question_schedulings.filter(function(item){return item.activated == true;});
                inputs.arr = arr;
                inputs.decider = decider;
                callModal(inputs);
            }else if(decider == 'question'){
                let arr = ques.question_schedulings;
                inputs.arr = arr;
                inputs.decider = decider;
                callModal(inputs);
            }else if(decider == 'active'){
                let arr = ques.question_schedulings.filter(function(item){return item.activated == false;});
                inputs.arr = arr;
                inputs.decider = decider;
                callModal(inputs);
            }else if(decider == 'Answered'){
                let arr = ques.question_schedulings.filter(function(item){return item.answer !== null;});
                inputs.arr = arr;
                inputs.decider = decider;
                callModal(inputs);
            }else if(decider == 'expired'){
                let arr = ques.question_schedulings.filter(function(item){return item.answer == null && item.status == true;});
                inputs.arr = arr;
                inputs.decider = decider;
                callModal(inputs);
            }
            function callModal(inputs){
                ModalService.showModal({
                    templateUrl: "views/active-contents/detail-question-responses.html",
                    controller: "detailQuestionResponsesCtrl",
                    inputs: inputs
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function () {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            }
        }


        var putData =  function(search,graph,inc,userId,answers){
            var type = Query.filter(graph,{'name': search},true);
            if(type){
                type.data.push(inc);
            }else{
                graph.push({id:userId,name: search,answers : answers,data: []});
                var type = Query.filter(graph,{'name': search},true);
                type.data.push(inc);
            }
        }

        init();

        $scope.close = function (params) {
            params = (params == null || params == undefined) ? '' : params; 
            // close(params);
        };

    }
}());