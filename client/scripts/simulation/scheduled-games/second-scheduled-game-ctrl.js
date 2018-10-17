(function () {
    'use strict';

    angular.module('app')
        .controller('secondScheduledGameCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','gameId','$timeout','Query','AccountService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,gameId,$timeout,Query, AccountService) {

        $scope.round={};
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        // fetch and get initial data
        function init() {
            
            $scope.newDate = new Date().toDateString();
            $scope.remaining = false;
            $scope.user = Query.getCookie('user');
            $scope.page1 = true;
            $scope.playGame = {};
            $scope.gamePlan = {};
            $scope.gameMessages = [];

            $scope.showButton="Next";

            $scope.playGame.gamePlanId=gameId;
            $scope.setGame=true;
            $http.get('/simulation/games/all').then(function (response) {
                $scope.gameTemplates = response.data;
            });
            $http.get("/simulation/game-messages/get-plan-message/" + gameId).then(function(response){
                $scope.gameMessages=response.data;
                $scope.gameMessages = _.sortBy($scope.gameMessages, function(o) { return  o.order });
            })
            $http.get('/simulation/game-player-lists/all').then(function (response) {
                $scope.playerlists = response.data;
            });
            // AccountService.allOrganization().then(function(response){
            //     $scope.organizations = response.data;
            // },function(err){
            //     if(err)
            //         toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            //     else
            //         toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            // });
            // $http.get('/settings/accounts/all-organizations').then(function (response) {
            //     $scope.organizations = response.data;
            // });
        };
        init();

        //delete from roles array
        $scope.deleteRolesfromArray = function(ind){
            $scope.playGame.roles.splice(ind,1);
        }

        $scope.CreateGamePlayerList = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/player-lists/form.html",
                controller: "gamePlayerListModalCtrl",
                inputs: {
                    list: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $http.get('/simulation/game-player-lists/all').then(function (response) {
                        $scope.playerlists = response.data;
                    });
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        //validate game form data
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
                    toastr.error('Please select PLayer list', 'Error!');
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
         
        //validates users
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

        //control flow
        $scope.showRound=function(){
            $scope.round={};
            var round_id = $scope.roundsArray.length+1;
            $scope.round.name='Round '+ round_id;
            $scope.page4=true;
            $scope.page3=false;
        }

        $scope.setOffTimeFormat = function (dat) {
            return moment(dat).utc().local().format('mm:ss');
        };

        //create round and set message
        $scope.createRound=function(id){
            $scope.round.gamePlanTemplateId=$scope.gamePlanTemplate.id;

            angular.forEach($scope.templatePlanMessagesShow,function(messg){  
                if(messg.id==$scope.round.gameMessageId){
                    $scope.round.messageIndex=messg.index;
                }
            })           
            $http.post('/simulation/game-rounds/create',{ data: $scope.round }).then(function(response){
                toastr.success("Round created Successfully");
                $scope.roundsArray.push(response.data);
                $scope.page4 = false;
                $scope.page3 = true; 

                $scope.showRoundMessages();
                $scope.toSetOff = [];
                $scope.toNotSetOff = [];
                var finalData = []
                // angular.forEach(points, function (fromAgenda,ind){
                    
                // });
                var round = $scope.roundsArray[$scope.roundsArray.length - 1];
                angular.forEach(round.Messages, function(msg,ind){
                    if(msg.game_message && (msg.game_message.type == 'Message' || msg.game_message.type == 'Task')){
                        if (msg.game_message.order){
                            putData(msg.game_message.order,finalData,msg);
                        }else{
                            putData('N/A',finalData,msg);
                        }
                        // $scope.toSetOff.push(msg);
                    }else{
                        $scope.toNotSetOff.push(msg);
                    }
                });

                if(finalData.length != 0 ){
                    var interval = ( round.timeSpan / finalData.length ) * 60 ;
                }else{
                    var interval = ( round.timeSpan ) * 60 ;
                }
                var seconds = interval;
                angular.forEach(finalData, function(indexData,ind){
                    if ( ind == 0 ){
                        seconds = ( interval / 2 );
                    }
                    else{
                        seconds += interval;
                    }
                    angular.forEach(indexData.data, function(msg,ind){
                        var dataMessage = {offset: angular.copy(seconds)};
                        msg.offset = angular.copy(seconds);
                        $http.post('/simulation/schedule-game-messages/update/'+msg.id,{data: dataMessage}).then(function(res){
                        });
                    });
                });

                angular.forEach($scope.toNotSetOff, function(msg,ind){
                    var dataMessage = {offset: 0};
                    msg.offset = angular.copy(0);
                    $http.post('/simulation/schedule-game-messages/update/'+msg.id,{data: dataMessage}).then(function(res){
                    });
                });
                
            })
        }   
        var putData =  function(search,graph,inc){
            var type = Query.filter(graph,{'name': search},true);
            if(type){
                type.data.push(inc);
            }else{
                graph.push({name: search,data: []});
                var type = Query.filter(graph,{'name': search},true);
                type.data.push(inc);
            }
        }

        //generate rounds with messages
        $scope.showRoundMessages=function(){
            var index=0;
            angular.forEach($scope.roundsArray,function(round){
               var roundMessageArray=[];
                for (var i = index; i < $scope.templatePlanMessagesShow.length; i++) {
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
            $scope.remainingMessages = [];
            for (var i = index; i < $scope.templatePlanMessagesShow.length; i++) {
               $scope.remainingMessages.push($scope.templatePlanMessagesShow[i]);
            }
        }

        //open next page
        $scope.next = function () {
            $scope.templatePlanMessagesShow =[];
            var passed = true;
            if ($scope.page1 && validateGame()) {
                $http.get('/simulation/games/'+$scope.playGame.gamePlanId+'/get-roles')
                .then(function (response) {
                    $scope.gamePlan = response.data;
                    $scope.playGame.roles = $scope.gamePlan.roles;
                    angular.forEach($scope.playGame.roles, function (role) {
                        if(role.game_plan_team){
                            role.to_show = role.game_plan_team.name + " - " + role.name;
                        }
                        else {
                            role.to_show = role.name;

                        }
                        delete role.game_plan_team;
                    });
                    // if ($scope.playGame.client.group === 'Internal Organizations'){
                    //     $scope.playGame.userAccountId = angular.copy($scope.playGame.client.id);
                    // } else {
                    //     $scope.playGame.organizationId = angular.copy($scope.playGame.client.id);
                    // }
                    // delete $scope.playGame.client;

                    $scope.game_player_list = Query.filter($scope.playerlists,{id: $scope.playGame.gamePlayerListId},true);
                    $scope.page1 = false;
                    $scope.page2 = true;
                    $scope.showButton="Scheduled Game";
                });
                // if (!validatePreviousUsers()){
                //     $http.post('/users/getOrganizationUsers', $scope.playGame.client)
                //     .then(function(response){
                //         $scope.users = response.data;
                //     });
                // }

            } else if ($scope.page2 && validateGame()) {
                // $scope.playGame.gamePlayerListId = $scope.game_player_list
                $http.post('/simulation/schedule-games/create', $scope.playGame)
                .then(function(response){
                    $scope.gamePlanTemplateId=response.data.id;
                    $scope.gamePlanTemplate = response.data;
                    toastr.success("Plan template created Successfully");
                    $scope.roundsArray=[];
                    if($scope.gameMessages.length > 0){
                        angular.forEach($scope.gameMessages, function(gameMessage,ind){
                            var mess ={
                                 // gameMessageId: gameMessage.id,
                                 userAccountId: $scope.user.userAccountId
                            }
                            var rolex = [];
                            if(gameMessage.assigned_game_message){
                                angular.forEach(gameMessage.assigned_game_message.roles, function(role,ind){
                                    rolex.push(role.id);
                                });
                            }
                            var data = {assignedMessage: mess, roles: rolex};
                            $http.post('/simulation/game-assign-messages/create', { data: data }).then(function (response) {
                                var messg ={
                                     index: ind,
                                     assignedGameMessageId: response.data.id,
                                     gamePlanTemplateId: $scope.gamePlanTemplateId,
                                     userAccountId: $scope.user.userAccountId,
                                     gameMessageId: gameMessage.id
                                }
                                $http.post('/simulation/schedule-game-messages/save', {data:messg})
                                .then(function(resp){
                                    gameMessage.templatePlanMessageId=resp.data.id;
                                }); 
                            });
                            if($scope.gameMessages.length == ind+1){
                                close($scope.gamePlanTemplateId);
                            }
                        });
                    }else{
                        close($scope.gamePlanTemplateId);
                    }
                    
                });
            }

        };

        $scope.back = function () {
            if ($scope.page2) {
                
                $scope.page2 = false;
                $scope.page1 = true;
                $scope.showButton="Next";
            }
            else if($scope.page4){
                $scope.page4=false;
                $scope.page3=true;
            }
             else {
                $scope.page3 = false;
                $scope.page2 = true;
                $scope.showButton="Scheduled Game";
                
            }
        };
        
        $scope.getUserName = function (user) {
            return user.firstName + ' ' + user.lastName;
        };

        //schedule game
        $scope.scheduleGame = function () {
          if($scope.remainingMessages.length==0){
            toastr.error("No More Messages");
            close();
          }  
          else{
            $scope.showRound();
            $scope.remaining = true;
            // $scope.round.timeSpan=30;
            var length=$scope.remainingMessages.length-1;
            $scope.round.gameMessageId=$scope.remainingMessages[length].id;
            // $scope.createRound(0);
          }
        };
        $scope.endgame = function () {
            $scope.createRound(0);
            close();
        };


        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());