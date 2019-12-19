(function () {
    'use strict';

    angular.module('app')
        .controller('contentLibraryCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','collection','$timeout','Query','AccountService','decider', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,collection,$timeout,Query, AccountService, decider) {

        $scope.round={};
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        // fetch and get initial data
        function init() {
            $scope.decider = decider;
            $scope.newDate = new Date().toDateString();
            $scope.user = Query.getCookie('user');
            $scope.page1 = true;
            $scope.playGame = {};
            if(collection){
                $scope.playGame.articleId = collection.id;
                $scope.collection = collection;
            }
            $http.get('/articles/all').then(function(res){
                $scope.articles = res.data;
            });
            $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                $scope.organizationList = response.data;
            });
            if(collection){
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
            }
        };
        init();

        $scope.getPlayerList = function(){
            $http.get('settings/organizations/get/'+ $scope.playGame.organizationId).then(function(res){
                $scope.organization = res.data;
            });
        }

        $scope.getOneCollection = (articleId) => {
            $http.get('/articles/get/' + articleId).then(function(res){
                $scope.collection = res.data;
                if($scope.collection.kind == 'message'){
                    $http.get('/questions/get/' + $scope.collection.id).then(function(response){
                        $scope.questions = response.data;
                        $scope.filteredQuestions = $filter('filter')($scope.questions, function(item){return item.offset});
                        // $scope.gameMessages = _.sortBy($scope.gameMessages, function(o) { return  o.order });
                    })
                }else{
                    $http.get('/surveys/all?id=' + $scope.collection.id).then(function(response){
                        $scope.surveys = response.data;
                    })
                }
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

        //  var validateValues = function () {
        //     if ($scope.page1){
        //         var passed  = true;
        //         if (!$scope.playGame.organizationId){
        //             toastr.error('Please select a organization', 'Error!');
        //             passed = false;
        //         } else if (!$scope.playGame.playerListId){
        //             toastr.error('Please select Payer List', 'Error!');
        //             passed = false;
        //         }
        //         return passed;
        //     } else if ($scope.page2){
        //         var passed = true;
        //             if ($scope.questions.length == 0){
        //                 toastr.error('Please Add Question First', 'Error!');
        //                 passed = false;
        //             }
        //         return passed;
        //     } else if ($scope.page3){
        //         var passed = true;
        //             // if (!$scope.timeSpan){
        //             //     toastr.error('Please Enter Time Span', 'Error!');
        //             //     passed = false;
        //             // }
        //             if(!$scope.total_time){
        //                 toastr.error('Please Enter Total Time','Error!');
        //                 passed = false;
        //             }
        //         return passed;
        //     } else {
        //         return true;
        //     }
        // };

         var validateModalValues = function () {
            var passed  = true;
            if($scope.filteredQuestions != undefined && $scope.filteredQuestions.length == 0 && $scope.decider == false){
                toastr.error('Please Scheduled Messages First', 'Error!');
                passed = false;
                return passed;
            }else if($scope.surveys != undefined && $scope.surveys.length == 0){
                toastr.error('Please Scheduled Your Surveys First','Error');
                passed = false;
                return passed;
                // if($scope.surveys.length == 0){
                //     toastr.error('Please Scheduled Your Surveys First');
                //     passed = false;
                //     return passed;
                // }
            }else{
                return passed;
            }
            // if($scope.surveys != undefined && $scope.surveys.length == 0){
            //     toastr.error('Please Scheduled Your Surveys First');
            //     passed = false;
            //     return passed;
            // }else{
            //     if($scope.filteredQuestions.length == 0){
            //         toastr.error('Please Scheduled Your Messages First');
            //         passed = false;
            //         return passed;   
            //     }
            // }
        };


        $scope.scheduleContent = function () {
            var quesArray = $scope.questions;
            for(var i = 1 ; i < $scope.repetition; i++){
                quesArray = quesArray.concat($scope.questions);
            }
            // if($scope.page3 && validateValues()){
            if(validateModalValues()){
                if($scope.playGame.articleId && $scope.total_time && $scope.playGame.organizationId && $scope.playGame.playerListId){
                    $http.get('settings/player-lists/get/'+ $scope.playGame.playerListId).then(function(res){
                        $scope.playerListUser = res.data;
                        if($scope.decider == true){
                            $scope.playGame.schedule_type = 'automatic_scheduled';
                        }else{
                            $scope.playGame.schedule_type = 'manual_scheduled';
                        }
                        $http.post('/content-plan-templates/create', $scope.playGame)
                        .then(function(response){
                            $scope.contentPlanTemplateId=response.data.id;
                            toastr.success("Plan template created Successfully");
                            // var interval = ( $scope.timeSpan / $scope.questions.length ) * 60 ;
                            // var seconds = interval;
                            if($scope.collection.kind == 'message'){
                                if($scope.decider == true){
                                    $http.post('/content-plan-templates/update/'+$scope.contentPlanTemplateId, {content_activated: true,play_date: new Date(),start_time : new Date()})
                                    .then(function(response){
                                        var msgPerMinute = Math.floor(($scope.total_working_days * $scope.total_working_hours * 60) / ($scope.questions.length * $scope.repetition));
                                        var start = new Date($scope.playGame.scheduled_date);
                                        start.setDate(start.getDate() + 1);
                                        var daysAhead = $scope.total_working_days;
                                        var holidayList = ['2016-10-15','2016-10-20','2016-10-19','2016-10-18'];
                                        var result = getWorkingDays(start,daysAhead,holidayList);
                                        var counter = 0;
                                        var time = msgPerMinute;
                                        for(var i = 0; i < result.length; i++){
                                            for(var j = counter; j < quesArray.length; j++){
                                                if(time < $scope.total_working_hours * 60){
                                                    var comingDate = new Date(result[i]);
                                                    comingDate.setHours(0,0,0,0);
                                                    var setOffTime = new Date(comingDate.getTime() + time*1000*60 + $scope.total_working_hours*60*1000*60);
                                                    var msg = quesArray[j];
                                                    var messg ={
                                                         index: j,
                                                         contentPlanTemplateId: $scope.contentPlanTemplateId,
                                                         questionId: msg.id,
                                                         setOffTime : setOffTime.toISOString(),
                                                         total_time : $scope.total_time * 60,
                                                         repetition : $scope.repetition
                                                    }
                                                    angular.forEach($scope.playerListUser.users, function(usr,ind){
                                                        $http.post('/question-scheduling/save', {data:messg,userId : usr.id})
                                                        .then(function(){
                                                        close();
                                                        }); 
                                                    });
                                                    time += msgPerMinute; 
                                                    counter++;
                                                }else{
                                                    time = time - $scope.total_working_hours * 60;
                                                    break;
                                                }
                                            }
                                        }
                                    });
                                }else{
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
                                            .then(function(){
                                                close();
                                            }); 
                                        });
                                    });
                                }
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
            }
        // }
        };

        var getWorkingDays = function(start,endCount,holidays){     
            var weekdays = [];
            var current = start;

            var i = 0; 
            while(i < endCount){
                if (!isWeekEnd(current)) {
                    weekdays.push(current);
                    i++;
                }
                var currentObj = new Date(current);
                current = currentObj.addDays(1).format();
            }

            function isWeekEnd(date){
                var dateObj = new Date(date);
                if (dateObj.getDay() == 6 || dateObj.getDay() == 0) {
                    return true;
                }else{
                    if (holidays.contains(date)) {
                        return true;
                    }else{
                        return false;
                    }
                }
            }

            return weekdays;
        }
        Array.prototype.contains = function(obj) {
            var i = this.length;
            while (i--) {
                if (this[i] == obj) {
                    return true;
                }
            }
            return false;
        }

        // get next day
        Date.prototype.addDays = function(days) {
            var dat = new Date(this.valueOf())
            dat.setDate(dat.getDate() + days);
            return dat;
        }

        //format date
        Date.prototype.format = function() {
            var mm = this.getMonth() + 1;
            var dd = this.getDate();
            if (mm < 10) {
                mm = '0' + mm;
            }
            if (dd < 10) {
                dd = '0' + dd;
            }
            return this.getFullYear()+'-'+mm+'-'+dd;
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());
