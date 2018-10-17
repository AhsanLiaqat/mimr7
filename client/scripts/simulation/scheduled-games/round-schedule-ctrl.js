(function () {
    'use strict';

    angular.module('app')
        .controller('roundScheduleCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','gameId','$timeout','Query', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,gameId,$timeout,Query) {

        $scope.round={};
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        //fetch and set some initial data
        function init() {
            $scope.remaining = false;
            $scope.user = Query.getCookie('user');
            $scope.page3 = true;
            $scope.playGame = {};
            $scope.gameMessages = [];
            $scope.roundsArray=[];
            $scope.showButton="Next";
            $scope.templatePlanMessagesShow =[];
            $http.get('/simulation/schedule-games/get/' + gameId).then(function (response) {
                $scope.playGame = response.data;
                $scope.time = new Date($scope.playGame.start_time).getTime();
	            $http.get("/simulation/game-messages/get-plan-message/" + $scope.playGame.gamePlanId).then(function(response){
	                $scope.gameMessages=response.data;
	                $scope.gameMessages = _.sortBy($scope.gameMessages, function(o) { return  o.order });
		            $http.get('/simulation/schedule-game-messages/get-for-game/' + gameId)
	                .then(function(resp){
	                    $scope.templatePlanMessagesShow=resp.data;
                		$scope.templatePlanMessagesShow = _.sortBy($scope.templatePlanMessagesShow, function(o) { return  o.index });

	                    angular.forEach($scope.templatePlanMessagesShow, function(templatePlanMessage,ind){
	                        templatePlanMessage.msgName = angular.copy((templatePlanMessage.index+1) +" - "+templatePlanMessage.game_message.name);
	                    });  
		                $http.get('/simulation/game-rounds/list/'+gameId).then(function(resp){
		                    $scope.roundsArray=resp.data;
		                    $scope.roundsArray = _.sortBy($scope.roundsArray, function(o) { return  o.createdAt });
		                    $scope.showRoundMessages();
		                    $scope.currentRound = $scope.playGame.roundId;

		                    angular.forEach($scope.roundsArray, function(round,ind){
		                        if(round.status == true){
		                            $scope.currentRound = ind;
		                        }
		                    });
		                });
	                });
	            })
            });
            
        };
        init();
        
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

        //create new round and set messages with offset
        $scope.createRound=function(id){
            if($scope.round.gameMessageId && $scope.round.timeSpan){
                // $scope.round.timeSpan = $scope.round.timeSpan * 60;
                $scope.round.timeleft = $scope.round.timeSpan
                $scope.round.gamePlanTemplateId=gameId;
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
                    var finalData = [];
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

                    // angular.forEach($scope.toSetOff, function(msg,ind){
                    //     if ( ind == 0 ){
                    //         // offset.setSeconds(offset.getSeconds() + ( interval / 2 )) ;
                    //         seconds = ( interval / 2 );
                    //     }
                    //     else{
                    //         seconds += interval;
                    //         // offset.setSeconds(offset.getSeconds() + interval ) ;   
                    //     }
                    //     var dataMessage = {offset: angular.copy(seconds),timeleft: angular.copy(seconds)};
                    //     msg.offset = angular.copy(seconds);
                    //     msg.timeleft = angular.copy(seconds);
                    //     $http.post('/simulation/schedule-game-messages/update/'+msg.id,{data: dataMessage}).then(function(res){
                    //     });
                    // });

                    angular.forEach($scope.toNotSetOff, function(msg,ind){
                        var dataMessage = {offset: 0, timeleft: angular.copy(0)};
                        msg.offset = angular.copy(0);
                        msg.timeleft = angular.copy(0);
                        $http.post('/simulation/schedule-game-messages/update/'+msg.id,{data: dataMessage}).then(function(res){
                        });
                    });
                })
            }else{
                toastr.warning("Please fill all fields");
            }
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

        //associate messages with rounds while fetching
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
            $scope.remaining = false;
        };
        
        $scope.getUserName = function (user) {
            return user.firstName + ' ' + user.lastName;
        };

        //create if last round with no messages or terminate/close modal
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