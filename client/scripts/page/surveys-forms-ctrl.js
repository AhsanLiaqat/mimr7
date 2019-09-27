(function () {
    'use strict';

    angular.module('app')
        .controller('SurveysQuestionsCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$timeout','Query', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$timeout,Query, AccountService) {

        // $scope.round={};
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        var setSocketForSurveyQuestions = function () {
            $timeout(function () {
                console.log('Listening ----> survey_forms:'+$routeParams.scheduledSurveyId);
                SOCKET.on('survey_forms_expiry:'+$routeParams.scheduledSurveyId, function (response) {
                    console.log('Content Recieved ----> survey_forms:'+$routeParams.scheduledSurveyId,response.data);
                    var data = response.data;
                    if(data){
                        switch(response.action){
                            case 'sent':
                            if(data.status == true){
                                $scope.page1 = false;
                                $scope.page2 = true;
                                $scope.page3 = false;
                            }
                        }
                    }else{
                        console.log('Recieved Nothing on ---> survey_forms:');

                    }           
                });
            });
        }
        $scope.TEXT_FIELD = "TEXT_FIELD";
        $scope.TEXT_AREA = "TEXT_AREA";
        $scope.CHECK_BOX = "CHECK_BOX";
        $scope.SELECT_BOX = "SELECT_BOX";
        $scope.RADIO_BUTTON = "RADIO_BUTTON";
        function init() {
            $scope.model = {};
            $scope.model.data = [];
            $scope.page1 = true;
            $scope.page2 = false;
            $scope.page3 = false;
            $scope.newDate = new Date().toDateString();
            $scope.user = Query.getCookie('user');
            $http.get('/scheduled-surveys/get/' + $routeParams.scheduledSurveyId).then(function(res){
                $scope.form = res.data;
                console.log('what is form data',$scope.form);
                if($scope.form.data){
                    $scope.page1 = false;
                    $scope.page2 = false;
                    $scope.page3 = true;
                }
                if($scope.form.status == true){
                    $scope.page1 = false;
                    $scope.page2 = true;
                    $scope.page3 = false;
                }
                $scope.time = new Date($scope.form.content_plan_template.start_time);
                setSocketForSurveyQuestions();
            });
        };
        init();

        $scope.submit = function (model) {
            $http.get('/dynamic-form/one/' + $scope.form.dynamic_form.id).then(function(res){
                $scope.result = res.data;
                if($scope.result.data){
                    toastr.success("Your Response Already Submitted Successfully");
                }else{
                    var dataObj = {};
                    for (var key in model) {
                        eval('dataObj.'+ key + "=model[key]")
                    }
                    $scope.answer = {
                        dynamicFormId : $scope.form.dynamic_form.id,
                        data : JSON.stringify(dataObj),
                        userId : $routeParams.userId,
                        contentPlanTemplateId : $scope.data.content_plan_template.id,
                        scheduledSurveyId : $scope.form.id
                    }
                    $http.post('/survey-form-data/save', $scope.answer)
                    .then(function(response){
                        $scope.survey_form = response.data;
                        toastr.success("Survey Submitted Successfully");
                        $scope.page1 = false;
                        $scope.page2 = false;
                        $scope.page3 = true;
                    });
                }
            });
        };

    }
}());
