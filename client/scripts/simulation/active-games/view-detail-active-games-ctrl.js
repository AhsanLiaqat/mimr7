(function () {
    'use strict';

    angular.module('app')
        .controller('viewDetailActiveGameCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$timeout','$rootScope','Query','DynamicFormService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$timeout,$rootScope,Query, DynamicFormService) {
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        $scope.state = function(id){
            $location.path("/simulation/player-page").search({userId: id});;
        }
        $scope.setOffTimeFormat = function (dat) {
            return moment(dat).utc().local().format('mm:ss');
        };

        //organize round message and sort them.
        $scope.showRoundMessages=function(){
            var index=0;
            angular.forEach($scope.roundsArray,function(round){
               var roundMessageArray=[];
                for (var i = index; i < $scope.gameMessages.length; i++) {
                  if(round.messageIndex!=$scope.gameMessages[i].index){
                     roundMessageArray.push($scope.gameMessages[i]);
                  }
                  else{
                    roundMessageArray.push($scope.gameMessages[i]);
                    round.Messages=roundMessageArray;
                    index=i+1; 
                    break;
                  }
                }
            });
        };

        //set sockets for messages
        var setSocketForGameMessages = function () {
            $timeout(function () {
                console.log('Listening ----> game_plan_template_messages:'+$scope.gameId);
                SOCKET.on('game_plan_template_messages:'+$scope.gameId, function (response) {
                    console.log('Message Recieved ----> game_plan_template_messages:'+$scope.gameId,response.data);
                    var message = response.data;
                    if(message){
                        switch (response.action) {
                            case 'update':
                            case 'sent':
                                if($scope.gameMessages){
                                    for (var i = 0; i < $scope.gameMessages.length; i++) {
                                        if ($scope.gameMessages[i].id === message.id) {
                                            $scope.gameMessages[i] = angular.copy(message);
                                            break;
                                        }
                                    }
                                }
                                var found = false;
                                for (var i = 0; i < $scope.roundsArray.length; i++) {
                                    for (var j = 0; j < $scope.roundsArray[i].Messages.length; j++) {
                                        if ($scope.roundsArray[i].Messages[j].id === message.id) {
                                            $scope.roundsArray[i].Messages[j] = angular.copy(message);
                                            found = true;
                                            break;
                                        }
                                    }
                                    if(found)break;
                                }
                                if(response.action == 'sent')toastr.success('Message Sent', 'Success!');
                                break;
                            case 'delete':
                                if($scope.gameMessages){
                                    for (var i = 0; i < $scope.gameMessages.length; i++) {
                                        if ($scope.gameMessages[i].id === message) {
                                            $scope.gameMessages.splice(i,1);
                                            break;
                                        }
                                    }
                                }
                                var found = false;
                                for (var i = 0; i < $scope.roundsArray.length; i++) {
                                    for (var j = 0; j < $scope.roundsArray[i].Messages.length; j++) {
                                        if ($scope.roundsArray[i].Messages[j].id === message) {
                                            $scope.roundsArray[i].Messages.splice(j,1);
                                            found = true;
                                            break;
                                        }
                                    }
                                    if(found)break;
                                }
                                toastr.success('Message Skipped', 'Success!');
                                break;
                            case 'save':
                                if($scope.gameMessages){
                                    $scope.gameMessages.push(message);
                                }
                                toastr.success('New Message Added', 'Success!');
                                break;
                            // case 1:
                            //     day = "Monday";
                            //     break;
                            
                        }
                    }else{
                        console.log('Recieved Nothing on ---> game_plan_template_messages:'+$scope.gameId);
                    }
                    $scope.$apply();
                });
            });
        }


        //set sockets for game
        var setSocketForGame = function () {
            $timeout(function () {
                console.log('Listening ----> simulation_active_game:'+$scope.gameId);
                SOCKET.on('simulation_active_game:'+$scope.gameId, function (response) {
                    console.log('Game Recieved ----> simulation_active_game:'+$scope.gameId,response.data);
                    var data = response.data;
                    if(data){
                        switch (response.action) {
                            case 'update':
                                $scope.playGame.status = data.status;
                                $scope.playGame.start_time = data.start_time;
                                $scope.playGame.resume_date = data.resume_date;
                                $scope.playGame.pause_date = data.pause_date;
                                $scope.playGame.roundId = data.roundId;
                                $scope.time = new Date($scope.playGame.start_time).getTime();
                                break;
                            case 'update_at_round_end':
                                $scope.playGame.status = data.status;
                                $scope.playGame.start_time = data.start_time;
                                $scope.playGame.resume_date = data.resume_date;
                                $scope.playGame.pause_date = data.pause_date;
                                $scope.playGame.roundId = data.roundId;
                                $scope.time = new Date($scope.playGame.start_time).getTime();
                                $scope.currentRound++;
                                break;
                            // case 1:
                            //     day = "Monday";
                            //     break;
                            
                        }
                    }else{
                        console.log('Recieved Nothing on ---> simulation_active_game:'+$scope.gameId);
                    }
                    $scope.$apply();
                });
            });
        }
        var setSocketForGameRounds = function () {
            $timeout(function () {
                console.log('Listening ----> simulation_active_game_rounds:'+$scope.gameId);
                SOCKET.on('simulation_active_game_rounds:'+$scope.gameId, function (response) {
                    console.log('Round Recieved ----> simulation_active_game_rounds:'+$scope.gameId,response.data);
                    var data = response.data;
                    if(data){
                        switch (response.action) {
                        case 'update':
                            for(var i=0; i<$scope.roundsArray.length; i++){
                                if($scope.roundsArray[i].id == data.id){
                                    $scope.roundsArray[i].status = data.status;
                                    $scope.roundsArray[i].timeleft = data.timeSpan;
                                    console.log('round updated',$scope.roundsArray[i]);
                                    break;
                                }   
                            }
                            break;

                        // case 1:
                        //     day = "Monday";
                        //     break;
                    }
                    }else{
                        console.log('Recieved Nothing on ---> simulation_active_game_rounds:'+$scope.gameId);
                    }
                    $scope.$apply();
                });
            });
        }
        var setSocketForForms = function () {
            $timeout(function () {
                console.log('Listening ----> simulation_player_form:' + $scope.playGame.id);
                SOCKET.on('simulation_player_form:' + $scope.playGame.id, function (response) {
                    console.log('Game Recieved ----> Listening ----> simulation_player_form:' + $scope.playGame.id,response.data);
                    var detail = response.data;
                    if(detail){
                        switch (response.action) {
                            case 'new':
                                angular.forEach($scope.questionnaires, function(frm,ind){
                                    if(frm.id == detail.dynamicFormId){
                                        var found = Query.filter(frm.player_form_details,{id: detail.id},false);
                                        if(found.length == 0){
                                            frm.player_form_details.push(detail);
                                        }
                                    }
                                });
                                break;
                            case 'update':
                                angular.forEach($scope.questionnaires, function(frm,ind){
                                    angular.forEach(frm.player_form_details, function(dtl,indx){
                                        if(dtl.id == detail.id){
                                            frm.player_form_details[indx] = angular.copy(detail);
                                        }
                                    });
                                });
                                break;
                        }
                    }else{
                        console.log('Recieved Nothing on ---> simulation_player_form:' + $scope.playGame.id);
                    }
                    $scope.$apply();
                });
            });
        }

        //fetch and set initial data
        function init() {
            $scope.playGame = {};
            $scope.gameMessages = [];
            $scope.user = Query.getCookie('user');
            $scope.gameId = $routeParams.gameId;

            $http.get("/dynamic-form/get?formType=Simulation Game Feedback Questionnaire").then(function(response){
                $scope.questionnaires = response.data;
                // angular.forEach($scope.questionnaires, function(form,ind){
                //     angular.forEach(form.player_form_details, function(detail,ind){
                        
                //     });    
                // });
            });

            $http.get('/simulation/message-responses/all/' + $routeParams.gameId+'/'+$scope.user.id).then(function (res) {
                $scope.message_response = res.data;
            });

            $http.get('/simulation/schedule-games/play-game-summary/' + $scope.gameId).then(function (response) {
                $scope.playGame = response.data;
                // var users = $scope.playGame.roles.map(function(obj) { return obj.user; });
                // $scope.user = users.filter(function(v,i) { return users.indexOf(v) == i; });
                // console.log('&&&&&&&&&&&&&&&&&&&&',$scope.user);
                $scope.time = new Date($scope.playGame.start_time).getTime();
                // $scope.gameMessages = $scope.playGame.template_plan_messages;
                $scope.gameMessages = _.sortBy($scope.playGame.template_plan_messages, function(o) { return  o.index });
                $http.get('/simulation/game-rounds/list/'+$scope.gameId).then(function(resp){
                    $scope.roundsArray = resp.data;
                    $scope.roundsArray = _.sortBy($scope.roundsArray, function(o) { return  o.createdAt });
                    $scope.showRoundMessages();
                    setSocketForGame();
                    setSocketForGameRounds();
                    setSocketForGameMessages();
                    setSocketForForms();
                    $scope.currentRound = $scope.playGame.roundId;
                    angular.forEach($scope.roundsArray, function(round,ind){
                        if(round.status == true){
                            $scope.currentRound = ind;
                        }
                    });
                });
            });

        };


        $scope.view = function(detail) {
            ModalService.showModal({
                templateUrl: "views/dynamic-form/data-view.html",
                controller: "dynamicFormDataViewCtrl",
                inputs : {
                    form_data: detail.submission,
                    form: detail.dynamic_form,
                    game_player : detail.game_player,
                    detailed : true,
                    // tableInfo: undefined
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.sendForm = function(formId,name,details){
            var players = details.map(function (value, label) {
                return value.game_player.id;
            });
            ModalService.showModal({
                templateUrl: "views/simulation/player-lists/selectPlayerList.html",
                controller: "selectPlayerListModalCtrl",
                inputs: {
                    game_players : players
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        angular.forEach(result, function(player,ind){
                            var data = {
                                gamePlayerId: player.id,
                                dynamicFormId: formId,
                                gamePlanTemplateId: $scope.playGame.id
                            }
                            DynamicFormService.sendForm(data).then(function(response){
                                if(ind == result.length -1){
                                    toastr.success('Form '+name+' sent to all users.', 'Success!');
                                }
                            });
                        });
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        }

        init();
        $scope.down = function(num){
            return Math.floor(num);
        }
        
        //generate offsets for messages and save them 
        $scope.generateOffsets = function(){
            var round = $scope.roundsArray[$scope.currentRound];
            angular.forEach(round.Messages, function(msg,ind){
                var dataMessage = {setOffTime : new Date()};
                if(!msg.activated){
                    $http.post('/simulation/schedule-game-messages/update-message-off-set/'+msg.id,{data:dataMessage}).then(function(res){
                    });
                }
            });
        };

        //set stop time for some round
        $scope.setStopTime =  function(){
            var round = $scope.roundsArray[$scope.currentRound];
            $rootScope.pauseCall = setTimeout(function () {
                $http.post('/simulation/schedule-games/update/'+$scope.gameId, {status: 'pause',roundId: $scope.currentRound+1, pause_date: new Date()})
                .then(function(response){
                    $http.post('/simulation/game-rounds/update/'+ round.id, {data: {status: false} }).then(function(resp){
                        $scope.currentRound++;
                    });
                });
            }, (1000 * round.timeleft)); 
        }

        //update gae status for play, pause, resume and stop
        $scope.updateGameStatus = function(status,id){
            var date = new Date();
            var round = $scope.roundsArray[$scope.currentRound];
            if(status == 'play'){
                if(id == 0){
                    //play
                    $http.post('/simulation/schedule-games/update/'+$scope.gameId, {start_time: date, status: status,resume_date: date})
                    .then(function(response){
                        $http.post('/simulation/game-rounds/update/'+ round.id, {data: {status: true,timeleft: round.timeSpan,resume_date: date} } ).then(function(resp){
                            $scope.generateOffsets();
                            // $scope.setStopTime();
                        });
                    });
                }else{
                    //resume
                    $http.post('/simulation/schedule-games/update/'+$scope.gameId, {status: status,resume_date: date})
                    .then(function(response){
                        $http.post('/simulation/game-rounds/update/'+ round.id, {data: {status: true,resume_date: date} } ).then(function(resp){
                            $scope.generateOffsets();
                            // $scope.setStopTime();
                        });
                    }); 
                }
            }else{
                if(id == 0){
                    //pause
                    if($scope.roundsArray.length >= $scope.currentRound + 1){
                        $http.post('/simulation/schedule-games/update/'+$scope.gameId, {status: status,pause_date: date})
                        .then(function(response){
                            $scope.playGame.pause_date = angular.copy(date);
                            var date1 = new Date($scope.playGame.resume_date);
                            var date2 = new Date($scope.playGame.pause_date);
                            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                            var diffForRounds = round.timeleft - ((timeDiff / 1000)).toFixed(0)
                            var timeleft = (diffForRounds > 0)? diffForRounds : 0 ;
                            $http.post('/simulation/game-rounds/update/'+ round.id, {data: {status: false,timeleft: timeleft} } ).then(function(resp){
                            });
                            angular.forEach(round.Messages, function(msg,ind){
                                if(msg.offset != 0 && !msg.activated){
                                    var diff = msg.timeleft - ((timeDiff / 1000)).toFixed(0);
                                    diff = (diff > 0)? diff : 0;
                                    var dataMessage = {timeleft : diff,setOffTime: ''};
                                    $http.post('/simulation/schedule-game-messages/update/'+msg.id,{data:dataMessage}).then(function(res){
                                    });
                                }
                            });
                            // if($rootScope.pauseCall){
                            //     clearTimeout($rootScope.pauseCall);
                            // }
                        });
                    }else{
                        toastr.warning('All rounds completed.', 'Warning!');
                    }
                }else{
                    //stop
                    var found = false;
                    var go = false;
                    if(round){
                        angular.forEach(round.Messages, function(msg,ind){
                            if(msg.activated == false){
                                found = true;
                            }
                        });
                        if(found){
                            var answer = confirm("Current round has some unsend messages, Do you want to close this round?");
                            if (answer == true) {
                                go = true;
                            }
                        }else{
                            go = true;
                        }
                        if(go ==  true){
                           $http.post('/simulation/schedule-games/update/'+$scope.gameId, {status: 'pause',roundId: $scope.currentRound+1, pause_date: new Date()})
                            .then(function(response){
                                $http.post('/simulation/game-rounds/update/'+ round.id, {data: {status: false} }).then(function(resp){
                                });
                            }); 
                        }
                    }else{
                        $scope.cancelgame();
                    }
                }
            }
        }
        
        //show message details
        $scope.showMessageDetail = function(record) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/message-show-modal.html",
                controller: "messageShowDetailCtrl",
                inputs:{
                    message: record
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

        $scope.showMessageResponseDetail = function(message_resp) {
            ModalService.showModal({
                templateUrl: "views/simulation/active-games/view-detail-message-response.html",
                controller: "messageResponseDetailCtrl",
                inputs:{
                    message: message_resp
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //skip message and update
        $scope.skipMessage = function(gameMessage){
            $http.post('/simulation/schedule-game-messages/update/' + gameMessage.id,{data : {skip: true,skipped_At : new Date()}})
            .then(function (response) {
                
            });
        }
        
        //create new message to send
        $scope.addModal = function() {
            ModalService.showModal({
                templateUrl: "views/simulation/scheduled-games/create-assign-message-form.html",
                controller: "createAssignMessageModalCtrl",
                inputs:{
                    roles: $scope.playGame.roles,
                    gameId: $scope.gameId,
                    Msgindex: $scope.gameMessages.length
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        // send any message
        $scope.sendMessage = function (gameMessage) {
            $http.post('/simulation/schedule-game-messages/send-message/' + gameMessage.id)
                .then(function (response) {
                });
        };

        //send all message
        $scope.sendAllMessages = function () {
            angular.forEach($scope.gameMessages, function (gameMessage) {
                $http.post('/simulation/schedule-game-messages/send-message/' + gameMessage.id)
                .then(function (response) {
                });
             
            });
        };

        //cancel game
        $scope.cancelgame =function(){
            $http.post('/simulation/schedule-games/update/'+$scope.gameId, {status: 'stop'})
            .then(function(response){
                $location.path("/simulation/scheduled-games");
            });
        }

        //get some user full name from roles
        $scope.getUserName = function (roleId) {
            if(roleId && $scope.playGame.roles){
                var filteredRole =  filterFilter($scope.playGame.roles, {'id': roleId})[0];
                if(filteredRole){
                    return filteredRole.user.firstName + ' ' + filteredRole.user.lastName;
                }
                else return ""
            }else{
                return ""
            }
        };

        //close modal
        $scope.close = function (params) {
            params = (params == null || params == undefined) ? '' : params; 
            // close(params);
        };

    }
}());