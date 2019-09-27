(function () {
    'use strict';

    angular.module('app')
        .controller('surveysResponsesCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$timeout','$rootScope','Query', surveyResponsesCtrl]);

    function surveyResponsesCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$timeout,$rootScope,Query) {
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
        $scope.setOffTimeFormat = function (dat) {
            return moment(dat).utc().local().format('mm:ss');
        };

        var setSocketForContentMessages = function () {
            $timeout(function () {
                console.log('Listening ----> detail_survey:'+$routeParams.contentPlanTemplateId);
                SOCKET.on('detail_survey:'+$routeParams.contentPlanTemplateId, function (response) {
                    console.log('Message Recieved ----> detail_survey:'+$routeParams.contentPlanTemplateId,response.data);
                    var reslt = response.data;
                    if(reslt){
                        switch (response.action) {
                            case 'update':
                                var found = false;
                                for (var i = 0; i < $scope.surveyDetail.player_list.users.length; i++) {
                                    for (var j = 0; j < $scope.surveyDetail.player_list.users[i].scheduled_surveys.length; j++) {
                                        if ($scope.surveyDetail.player_list.users[i].scheduled_surveys[j].id === reslt.id) {
                                            $scope.surveyDetail.player_list.users[i].scheduled_surveys[j] = angular.copy(reslt);
                                            found = true;
                                            break;
                                        }
                                    }
                                    if(found)break;
                                }
                                // var found = false;
                                // for(var i = 0; i < $scope.playContent.scheduled_surveys.length; i++){
                                //     if($scope.playContent.scheduled_surveys[i].id === reslt.id){
                                //         $scope.playContent.scheduled_surveys[i] = angular.copy(reslt);
                                //         found = true;
                                //         break;
                                //     }
                                //     if(found)break;
                                // }
                                // break;
                        }
                    }else{
                        console.log('Recieved Nothing on ---> detail_survey:'+$routeParams.contentPlanTemplateId);
                    }
                    $scope.$apply();
                });

                SOCKET.on('survey_summary_page:'+$routeParams.contentPlanTemplateId, function (response) {
                    console.log('Message Recieved ----> survey_summary_page:'+$routeParams.contentPlanTemplateId,response.data);
                    var reslt = response.data;
                    if(reslt){
                        switch (response.action) {
                            case 'sent':
                                var found = false;
                                for (var i = 0; i < $scope.surveyDetail.player_list.users.length; i++) {
                                    for (var j = 0; j < $scope.surveyDetail.player_list.users[i].scheduled_surveys.length; j++) {
                                        if ($scope.surveyDetail.player_list.users[i].scheduled_surveys[j].id === reslt.id) {
                                            $scope.surveyDetail.player_list.users[i].scheduled_surveys[j] = angular.copy(reslt);
                                            angular.forEach($scope.surveyDetail.player_list.users , function(user){
                                                user.answerQuestions = 0;
                                                angular.forEach(user.scheduled_surveys,function(item){
                                                    if(item.submission){
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
                            case 'survey_submission':
                                var found = false;
                                for (var i = 0; i < $scope.surveyDetail.player_list.users.length; i++) {
                                    for (var j = 0; j < $scope.surveyDetail.player_list.users[i].scheduled_surveys.length; j++) {
                                        if ($scope.surveyDetail.player_list.users[i].scheduled_surveys[j].id === reslt.questionSchedulingId) {
                                            $scope.surveyDetail.player_list.users[i].scheduled_surveys[j].submission = reslt;
                                            angular.forEach($scope.surveyDetail.player_list.users , function(user){
                                                user.answerQuestions = 0;
                                                angular.forEach(user.scheduled_surveys,function(item){
                                                    if(item.submission){
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
                        console.log('Recieved Nothing on ---> survey_summary_page:'+$routeParams.contentPlanTemplateId);
                    }
                    $scope.$apply();
                });
            });
        }

        //fetch and set initial data
        function init() {
            $scope.user = Query.getCookie('user');
            $scope.contentPlanTemplateId = $routeParams.contentPlanTemplateId;

            // $http.get('/content-plan-templates/play-content-summary/' + $scope.contentPlanTemplateId).then(function (response) {
            //     $scope.playContent = response.data;
            //     $scope.time = new Date($scope.playContent.start_time).getTime();
            //     $scope.questionSchedule = [];
            //     angular.forEach($scope.playContent.scheduled_surveys, function (scheduledQuestion,ind){
            //         if (scheduledQuestion.question){
            //             putData(scheduledQuestion.user.firstName,$scope.questionSchedule,scheduledQuestion,scheduledQuestion.user.id,scheduledQuestion.user.answers);
            //         }else{
            //             putData('N/A',$scope.questionSchedule,null,null,'N/A');
            //         }
            //     });

            // });
            $http.get('/content-plan-templates/get-survey-detail/' + $scope.contentPlanTemplateId).then(function (response) {
                $scope.surveyDetail = response.data;
                angular.forEach($scope.surveyDetail.player_list.users , function(user){
                    user.answerQuestions = 0;
                    angular.forEach(user.scheduled_surveys,function(item){
                        if(item.submission){
                            user.answerQuestions++;
                        }
                    });
                });
                $scope.time = new Date($scope.surveyDetail.start_time).getTime();
            });
            setSocketForContentMessages();
        };

        $scope.detailSurveys = (decider,ques) => {
            let inputs = [];
            if(decider == 'sent'){
                let arr = ques.scheduled_surveys.filter(function(item){return item.activated == true;});
                inputs.arr = arr;
                inputs.decider = decider;
                inputs.type = 'survey_summary';
                callModal(inputs);
            }else if(decider == 'question'){
                let arr = ques.scheduled_surveys;
                inputs.arr = arr;
                inputs.decider = decider;
                inputs.type = 'survey_summary';
                callModal(inputs);
            }else if(decider == 'active'){
                let arr = ques.scheduled_surveys.filter(function(item){return item.activated == false;});
                inputs.arr = arr;
                inputs.decider = decider;
                inputs.type = 'survey_summary';
                callModal(inputs);
            }else if(decider == 'Answered'){
                let arr = ques.scheduled_surveys.filter(function(item){return item.submission !== null;});
                inputs.arr = arr;
                inputs.decider = decider;
                inputs.type = 'survey_summary';
                callModal(inputs);
            }else if(decider == 'expired'){
                let arr = ques.scheduled_surveys.filter(function(item){return item.submission == null && item.status == true;});
                inputs.arr = arr;
                inputs.decider = decider;
                inputs.type = 'survey_summary';
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