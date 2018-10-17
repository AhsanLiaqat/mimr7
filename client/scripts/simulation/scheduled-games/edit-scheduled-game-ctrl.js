(function () {
    'use strict';

    angular.module('app')
        .controller('editScheduledGameCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter', 'gameId','AccountService','Query', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter, gameId, AccountService,Query) {

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
        
        //fetch and set initial data
        function init() {
            $scope.newDate = new Date().toDateString();
            $scope.page1 = true;
            $scope.playGame = {};
            $scope.gameMessages = [];
            $http.get('/simulation/game-player-lists/all').then(function (response) {
                $scope.playerlists = response.data;
            });
            $scope.gameId = gameId;
            $http.get('/simulation/schedule-games/get/' + gameId).then(function (response) {
                $scope.playGame = response.data;
                $scope.time = new Date($scope.playGame.start_time).getTime();
                $scope.gameMessages = $scope.playGame.template_plan_messages;
                $scope.templatePlanMessagesShow = _.sortBy($scope.gameMessages, function(o) { return  o.index });
                angular.forEach($scope.templatePlanMessagesShow, function(templatePlanMessage,ind){
                    templatePlanMessage.msgName=angular.copy(templatePlanMessage.game_message.name);
                });
                $http.get('/simulation/game-rounds/list/'+$scope.gameId).then(function(resp){
                    $scope.roundsArray = resp.data;
                    $scope.roundsArray = _.sortBy($scope.roundsArray, function(o) { return  o.id });
                    $scope.showRoundMessages();
                    $scope.currentRound = $scope.playGame.roundId;

                    angular.forEach($scope.roundsArray, function(round,ind){
                        if(round.status == true){
                            $scope.currentRound = ind;
                        }
                    });
                });
            });
            

            $http.get('/simulation/games/all').then(function (response) {
                $scope.gameTemplates = response.data;
            });
            AccountService.allOrganization().then(function(response){
                $scope.organizations = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/accounts/all-organizations').then(function (response) {
                
            // });
        };


        $scope.setOffTimeFormat = function (dat) {
            return moment(dat).utc().local().format('mm:ss');
        };

        //clear all rounds
        $scope.deleteRounds = function(){
            angular.forEach($scope.roundsArray, function(round,ind){
                $http.delete('/simulation/game-rounds/delete/'+round.id).then(function(resp){
                });
            });
            close();
        };
        $scope.to = function(num){
            return num.toFixed(2);
        }

        // associate messages to rounds
        $scope.showRoundMessages=function(){
            var index=0;
            angular.forEach($scope.roundsArray,function(round){
               var roundMessageArray=[];
                for (var i = index; i < $scope.templatePlanMessagesShow.length; i++) {

                    $scope.templatePlanMessagesShow[i].offset = $scope.templatePlanMessagesShow[i].offset / 60;
                    $scope.templatePlanMessagesShow[i].offset = parseFloat($scope.templatePlanMessagesShow[i].offset.toFixed(2));
                    if(round.messageIndex!=$scope.templatePlanMessagesShow[i].index){
                        roundMessageArray.push($scope.templatePlanMessagesShow[i]);
                    }
                    else{
                        roundMessageArray.push($scope.templatePlanMessagesShow[i]);
                        round.Messages=roundMessageArray;
                        index=i+1; 
                        break;
                    }
                }
            });
        };
        init();

        //validates game
        var validateGame = function () {
            if ($scope.page1){
                var passed  = true;
                if (!$scope.playGame.gamePlanId){
                    toastr.error('Please select a game template', 'Error!');
                    passed = false;
                } else if (!$scope.playGame.scheduled_date){
                    toastr.error('Please select Game Schedule Date', 'Error!');
                    passed = false;
                } else if (!$scope.playGame.gamePlayerListId){
                    toastr.error('Please select Player List', 'Error!');
                    passed = false;
                }
                return passed;
            } else if ($scope.page2){
                var passed = true;
                angular.forEach($scope.playGame.roles, function (role) {
                    if (!role.playerId){
                        toastr.error('Please select user for all roles', 'Error!');
                        passed = false;
                    }
                });
                return passed;
            } else {
                return true;
            }
        };

        //validates user
        // var validatePreviousUsers = function () {
        //     var passed = true;
        //     if (!$scope.users || $scope.users.length === 0){
        //         passed = false;
        //     } else if ($scope.playGame.client.group === 'Internal Organizations' && $scope.users[0].userType === 'External'){
        //         passed = false;
        //     } else if ($scope.playGame.client.group === 'Internal Organizations' && $scope.users[0].userType === null && $scope.users[0].userAccountId !== $scope.playGame.client.id){
        //         passed = false;
        //     } else if ($scope.playGame.client.group === 'External Organizations' && $scope.users[0].userType === null){
        //         passed = false;
        //     } else if ($scope.playGame.client.group === 'External Organizations' && $scope.users[0].userType === 'External' && $scope.users[0].organizationId !== $scope.playGame.client.id){
        //         passed = false;
        //     }
        //     return passed;
        // };

        //go on next page and computes roles to show
        $scope.next = function () {
            if ($scope.page1 && validateGame()) {
                $scope.game_player_list = Query.filter($scope.playerlists,{id: $scope.playGame.gamePlayerListId},true);
                console.log($scope.game_player_list);
                if ($scope.gamePlan && $scope.gamePlan.id !== $scope.playGame.gamePlanId) {
                    $http.get('/simulation/games/'+$scope.playGame.gamePlanId+'/get-roles')
                    .then(function (response) {
                        $scope.gamePlan = response.data;
                        $scope.gameMessages = $scope.gamePlan.assigned_game_messages;
                        $scope.playGame.roles = [];

                        angular.forEach($scope.gamePlan.assigned_game_messages, function (assignedMessage) {
                            angular.forEach(assignedMessage.roles, function (role) {
                                if (!filterFilter($scope.playGame.roles, {'id': role.id})[0]){
                                    $scope.playGame.roles.push(role);
                                }
                            });
                        });
                        
                        $scope.page1 = false;
                        $scope.page2 = true;
                    });
                }else{
                    
                    $scope.page1 = false;
                    $scope.page2 = true;
                }
                
                // if (!validatePreviousUsers()){
                //     $http.post('/users/getOrganizationUsers', $scope.playGame.client)
                //     .then(function(response){
                //         $scope.users = response.data;
                //     });
                // }

            } else if ($scope.page2 && validateGame()) {
                $scope.page2 = false;
                $scope.page3 = true;
            }
        };

        $scope.back = function () {
            if ($scope.page2) {
                $scope.page2 = false;
                $scope.page1 = true;
            } else {
                $scope.page3 = false;
                $scope.page2 = true;
            }
        };
        
        $scope.getUserName = function (user) {
            return user.firstName + ' ' + user.lastName;
        };

        //update game
        $scope.updateSchedule = function () {
            if ($scope.playGame.client.group === 'Internal Organizations'){
                $scope.playGame.userAccountId = angular.copy($scope.playGame.client.id);
            } else {
                $scope.playGame.organizationId = angular.copy($scope.playGame.client.id);
            }
            delete $scope.playGame.client;
            $http.post('/simulation/schedule-games/update/'+$scope.playGame.id, $scope.playGame)
            .then(function(response){
                var gamePlanTemplate = response.data;
                angular.forEach($scope.roundsArray, function (round) {
                    angular.forEach(round.Messages, function (msg) {
                        
                        var dataMessage = {offset: msg.offset*60};
                        $http.post('/simulation/schedule-game-messages/update/'+msg.id,{data:dataMessage}).then(function(res){
                        });
                    });
                });
                gamePlanTemplate.type = 0;
                $scope.close(gamePlanTemplate);                      
            });
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());