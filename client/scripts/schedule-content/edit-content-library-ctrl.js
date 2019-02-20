/*Edit-Content-Library*/
/*In this controller we implement functionality for editing the schedule content plan template*/
/*Naveed Iftikhar*/
(function () {
    'use strict';

    angular.module('app')
        .controller('editContentLibraryCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','gameId','$timeout','Query','AccountService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,gameId,$timeout,Query, AccountService) {

        $scope.round={};
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        // fetch and get initial data
        function init() {
            
            $scope.newDate = new Date().toDateString();
            $scope.user = Query.getCookie('user');
            $scope.playGame = {};
            $scope.playGame.articleId = gameId;
            $http.get('/articles/all').then(function(res){
                $scope.articles = res.data;
            });
            $http.get('/content-plan-templates/get/' + gameId).then(function(res){
                $scope.result = res.data;
                console.log('what is actual result is',$scope.result)
                $http.get('settings/organizations/get/'+ $scope.result.player_list.organizationId).then(function(res){
                    $scope.organization = res.data;
                });
            });
            $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                $scope.organizationList = response.data;
            });
        };
        init();



        $scope.getPlayerList = function(){
            $http.get('settings/organizations/get/'+ $scope.result.player_list.organizationId).then(function(res){
                $scope.organization = res.data;
            });
        }

        $scope.scheduleContent = function () {
            // if($scope.page3 && validateValues()){
                if($scope.total_time && $scope.result.player_list.organizationId && $scope.result.playerListId){
                    $http.post('/content-plan-templates/update/' + $scope.result.id, $scope.result)
                    .then(function(response){
                        angular.forEach($scope.result.question_schedulings, function(messageQuestion,ind){
                            $http.post('/question-scheduling/skip/' + messageQuestion.id, {data : {total_time : $scope.total_time*60}})
                            .then(function(resp){
                                $scope.close(response);
                            }); 
                        });
                        toastr.success("Plan template updates Successfully");
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
