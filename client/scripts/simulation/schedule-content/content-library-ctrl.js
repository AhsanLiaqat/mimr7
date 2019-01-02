(function () {
    'use strict';

    angular.module('app')
        .controller('contentLibraryCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','gameId','$timeout','Query','AccountService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,gameId,$timeout,Query, AccountService) {

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
            $scope.playGame.articleId = gameId;
            $http.get('/articles/all').then(function(res){
                $scope.articles = res.data;
            });
            $http.get('/users/list2').then(function(res){
                $scope.users = res.data;
            });
            $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                $scope.organizationList = response.data;
            });
            $http.get('/questions/get/' + gameId).then(function(response){
                $scope.questions = response.data;
                // $scope.gameMessages = _.sortBy($scope.gameMessages, function(o) { return  o.order });
            })
        };
        init();

        $scope.getPlayerList = function(){
            $http.get('settings/organizations/get/'+ $scope.playGame.organizationId).then(function(res){
                $scope.organization = res.data;
            });
        }

        $scope.next = function () {
            if($scope.page2 == true){
                $scope.page2 = false;
                $scope.page3 = true;
                $scope.page1 = false;
            }
            if($scope.page1 == true){
                $scope.page1 = false;
                $scope.page2 = true;
                $scope.page3 = false;
            }
        };

        $scope.scheduleContent = function () {
            $scope.playGame.scheduled_date = new Date().toDateString();
            $http.post('/content-plan-templates/create', $scope.playGame)
            .then(function(response){
                $scope.contentPlanTemplateId=response.data.id;
                toastr.success("Plan template created Successfully");
                var interval = ( $scope.timeSpan / ($scope.questions.length * $scope.users.length) ) * 60 ;
                var seconds = interval;
                angular.forEach($scope.questions, function(messageQuestion,ind){
                    if ( ind == 0 ){
                        seconds = ( interval / 2 );
                    }
                    else{
                        seconds += interval;
                    }
                    var messg ={
                         index: ind,
                         contentPlanTemplateId: $scope.contentPlanTemplateId,
                         questionId: messageQuestion.id,
                         offset: angular.copy(seconds),
                         total_time : $scope.total_time * 60
                    }
                    angular.forEach($scope.users, function(usr,ind){
                        $http.post('/question-scheduling/save', {data:messg})
                        .then(function(resp){
                            $scope.close();
                        }); 
                    });

                });
            });

        };

        


        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());
