(function () {
    'use strict';

    angular.module('app')
        .controller('contentLibraryCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','collection','$timeout','Query','AccountService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,collection,$timeout,Query, AccountService) {

        $scope.round={};
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        // fetch and get initial data
        function init() {
            
            $scope.newDate = new Date().toDateString();
            $scope.user = Query.getCookie('user');
            $scope.page1 = true;
            $scope.playGame = {};
            $scope.playGame.articleId = collection.id;
            $http.get('/articles/all').then(function(res){
                $scope.articles = res.data;
            });
            $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                $scope.organizationList = response.data;
            });
            if(collection.kind == 'message'){
                $http.get('/questions/get/' + collection.id).then(function(response){
                    $scope.questions = response.data;
                    $scope.filteredQuestions = $filter('filter')($scope.questions, function(item){return item.offset});
                    // $scope.gameMessages = _.sortBy($scope.gameMessages, function(o) { return  o.order });
                })
            }else{
                $http.get('/surveys/all?id=' + collection.id).then(function(response){
                    $scope.surveys = response.data;
                })
            }
            $scope.collection = collection;
        };
        init();

        $scope.getPlayerList = function(){
            $http.get('settings/organizations/get/'+ $scope.playGame.organizationId).then(function(res){
                $scope.organization = res.data;
            });
        }

        $scope.next = function () {
            var passed = true;
            if($scope.page2 && validateValues()){
                $scope.page2 = false;
                $scope.page3 = true;
                $scope.page1 = false;
            }
            if ($scope.page1 && validateValues()) {
                $scope.page1 = false;
                $scope.page2 = true;
                $scope.page3 = false;
            }
        };

         var validateValues = function () {
            if ($scope.page1){
                var passed  = true;
                if (!$scope.playGame.organizationId){
                    toastr.error('Please select a organization', 'Error!');
                    passed = false;
                } else if (!$scope.playGame.playerListId){
                    toastr.error('Please select Payer List', 'Error!');
                    passed = false;
                }
                return passed;
            } else if ($scope.page2){
                var passed = true;
                    if ($scope.questions.length == 0){
                        toastr.error('Please Add Question First', 'Error!');
                        passed = false;
                    }
                return passed;
            } else if ($scope.page3){
                var passed = true;
                    // if (!$scope.timeSpan){
                    //     toastr.error('Please Enter Time Span', 'Error!');
                    //     passed = false;
                    // }
                    if(!$scope.total_time){
                        toastr.error('Please Enter Total Time','Error!');
                        passed = false;
                    }
                return passed;
            } else {
                return true;
            }
        };

        $scope.scheduleContent = function () {
            // if($scope.page3 && validateValues()){
                if($scope.total_time && $scope.playGame.organizationId && $scope.playGame.playerListId){
                    $http.get('settings/player-lists/get/'+ $scope.playGame.playerListId).then(function(res){
                        $scope.playerListUser = res.data;
                        $http.post('/content-plan-templates/create', $scope.playGame)
                        .then(function(response){
                            $scope.contentPlanTemplateId=response.data.id;
                            toastr.success("Plan template created Successfully");
                            // var interval = ( $scope.timeSpan / $scope.questions.length ) * 60 ;
                            // var seconds = interval;
                            if($scope.collection.kind == 'message'){
                                angular.forEach($scope.filteredQuestions, function(messageQuestion,ind){
                                    // if ( ind == 0 ){
                                        // seconds = ( interval / 2 );
                                    // }
                                    // else{
                                        // seconds += interval;
                                    // }
                                    var messg ={
                                         index: ind,
                                         contentPlanTemplateId: $scope.contentPlanTemplateId,
                                         questionId: messageQuestion.id,
                                         offset: messageQuestion.offset,
                                         total_time : $scope.total_time * 60
                                    }
                                    angular.forEach($scope.playerListUser.users, function(usr,ind){
                                        $http.post('/question-scheduling/save', {data:messg,userId : usr.id})
                                        .then(function(resp){
                                            close(resp);
                                        }); 
                                    });
                                });
                            }else{
                                angular.forEach($scope.surveys, function(survy,ind){
                                    var surveyData ={
                                         contentPlanTemplateId : $scope.contentPlanTemplateId,
                                         surveyId : survy.id,
                                         offset : survy.offset,
                                         expiryTime : $scope.total_time * 60,
                                         repeatTime : survy.repeatTime,
                                         type : survy.type,
                                         dynamicFormId : survy.dynamicFormId,
                                         articleId : survy.articleId
                                    }
                                    angular.forEach($scope.playerListUser.users, function(usr,ind){
                                        $http.post('/scheduled-surveys/save', {data:surveyData,userId : usr.id})
                                        .then(function(resp){
                                            close();
                                        }); 
                                    });
                                });
                            }
                        });
                    });
                }else{
                    toastr.error('Please Enter All Fields','Error!');
                }
            // }
        };

        


        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());
