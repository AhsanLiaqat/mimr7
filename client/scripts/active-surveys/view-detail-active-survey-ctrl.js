
(function () {
    'use strict';

    angular.module('app')
        .controller('viewDetailActiveSurveyCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$timeout','$rootScope','Query', activeSurveyCtrl]);

    function activeSurveyCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$timeout,$rootScope,Query) {
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
        $scope.setOffTimeFormat = function (dat) {
            return moment(dat).utc().local().format('mm:ss');
        };

        var setSocketForContentMessages = function () {
            $timeout(function () {
                console.log('Listening ----> detail_survey:'+$routeParams.surveyId);
                SOCKET.on('detail_survey:'+$routeParams.surveyId, function (response) {
                    console.log('Message Recieved ----> detail_survey:'+$routeParams.surveyId,response.data);
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
                                for(var i = 0; i < $scope.survey_summary.question_schedulings.length; i++){
                                    if($scope.survey_summary.question_schedulings[i].id === reslt.id){
                                        $scope.survey_summary.question_schedulings[i] = angular.copy(reslt);
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
                                for(var i = 0; i < $scope.survey_summary.question_schedulings.length; i++){
                                    if($scope.survey_summary.question_schedulings[i].id === reslt.id){
                                        $scope.survey_summary.question_schedulings[i] = angular.copy(reslt);
                                        found = true;
                                        break;
                                    }
                                    if(found)break;
                                }
                                toastr.success('Message Skipped', 'Success!');
                                break;
                        }
                    }else{
                        console.log('Recieved Nothing on ---> detail_survey:'+$routeParams.surveyId);
                    }
                    $scope.$apply();
                });
            });
        }

        //fetch and set initial data
        function init() {
            $scope.user = Query.getCookie('user');
            $scope.surveyId = $routeParams.surveyId;

            $http.get('/content-plan-templates/survey-summary/' + $scope.surveyId).then(function (response) {
                $scope.survey_summary = response.data;
                $scope.time = new Date($scope.survey_summary.start_time).getTime();
                // $scope.questionSchedule = [];
                // angular.forEach($scope.survey_summary.question_schedulings, function (scheduledQuestion,ind){
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

        $scope.sendSurvey = function (survy) {
            $http.post('/scheduled-surveys/send-survey/' + survy.id).then(function (response) {
            });
        };

        $scope.skipSurvey = function(contentQuestion){
            $http.post('/scheduled-surveys/update/' + survy.id,{data : {skip: true,skipped_At : new Date()}})
            .then(function (response) {
                
            });
        }

        $scope.cancelContent =function(){
            $http.post('/content-plan-templates/cancel-content/'+$scope.surveyId, {status: 'stop'})
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