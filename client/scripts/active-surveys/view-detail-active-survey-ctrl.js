
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
                                var found = false;
                                for(var i = 0; i < $scope.survey_summary.scheduled_surveys.length; i++){
                                    if($scope.survey_summary.scheduled_surveys[i].id === reslt.id){
                                        $scope.survey_summary.scheduled_surveys[i] = angular.copy(reslt);
                                        found = true;
                                        break;
                                    }
                                    if(found)break;
                                }
                                break;
                            case 'skip':
                                var found = false;
                                for(var i = 0; i < $scope.survey_summary.scheduled_surveys.length; i++){
                                    if($scope.survey_summary.scheduled_surveys[i].id === reslt.id){
                                        $scope.survey_summary.scheduled_surveys[i] = angular.copy(reslt);
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
            });
            setSocketForContentMessages();
        };

        init();

        
        $scope.sendSurvey = function (survy) {
            $http.post('/scheduled-surveys/send-survey/' + survy.id).then(function (response) {
            });
        };

        $scope.skipSurvey = function(survy){
            $http.post('/scheduled-surveys/update/' + survy.id,{data : {skip: true,skipped_At : new Date()}})
            .then(function (response) {
                
            });
        }

        $scope.closeSurvey =function(){
            $http.post('/content-plan-templates/cancel-survey/'+$scope.surveyId, {status: 'stop'})
            .then(function(response){
                $location.path("/closed-surveys");
            });
        }

        //close modal
        $scope.close = function (params) {
            params = (params == null || params == undefined) ? '' : params; 
            // close(params);
        };

    }
}());