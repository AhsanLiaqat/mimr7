(function () {
    'use strict';

    angular.module('app')
        .controller('simulationLoginCtrl', ['$scope', '$filter','$routeParams', '$http', 'AuthService', '$location','$uibModal','ModalService','$sce','$timeout','Query','MessageService','DynamicFormService', ctrlFunction]);

        function ctrlFunction($scope ,$filter,$routeParams, $http, AuthService, $location,$uibModal,ModalService,$sce,$timeout,Query, MessageService,DynamicFormService) {

            var make_arrays = function(){
                $scope.first = []
                $scope.second = []
                $scope.third = []

                $scope.myMessages = $filter('filter')($scope.myMessages, function(item){ 
                    return !$scope.archive_messages.includes(item.id);
                });

                angular.forEach($scope.myMessages, function(value, key) {
                    // value.assigned_game_message.game_message.type == 'Role Description'
                  if(value.game_message.type == 'Background' || value.game_message.type == 'Role Description'){
                    $scope.first.push(value);
                  }else if (value.game_message.type == 'Task'){
                    $scope.second.push(value);
                  }else if (value.game_message.type == 'Message'){
                    $scope.third.push(value);
                  }
                });
            }

            var setSocketForGameMessages = function () {
                $timeout(function () {
                    console.log('Listening ----> game_plan_template_messages:'+ localStorage["loginSimulationGameId"] + '/' + $scope.user.id);
                    SOCKET.on('game_plan_template_messages:'+ localStorage["loginSimulationGameId"] + '/' + $scope.user.id, function (response) {
                        console.log('Game Recieved ----> game_plan_template_messages:'+ localStorage["loginSimulationGameId"] + '/' + $scope.user.id,response.data);
                        var message = response.data;
                        if(message){
                            switch (response.action) {
                                case 'sent':
                                    $scope.myMessages.push(message);
                                    $scope.myMessages = Query.sort($scope.myMessages,'activatedAt',true,true);
                                    make_arrays();
                                    break;
                                
                                // case 1:
                                //     day = "Monday";
                                //     break;
                                
                            }
                        }else{
                            console.log('Recieved Nothing on ---> game_plan_template_messages:'+ $routeParams.templateGameId + '/' + $routeParams.userId);
                        }
                        $scope.$apply();
                    }); 
                });
            }

            var setSocketForForms = function () {
                $scope.forms = [];
                console.log($scope.game.id);
                DynamicFormService.getFormForPlayer($scope.game.id,$scope.user.id).then(function(response){
                    $scope.forms = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                $timeout(function () {
                    console.log('Listening ----> simulation_player_form:' + $scope.game.id+'/'+$scope.user.id);
                    SOCKET.on('simulation_player_form:' + $scope.game.id+'/'+$scope.user.id, function (response) {
                        console.log('Game Recieved ----> Listening ----> simulation_player_form:' + $scope.game.id+'/'+$scope.user.id,response.data);
                        var form = response.data;
                        if(form){
                            switch (response.action) {
                                case 'new':
                                    $scope.forms.push(form);
                                    break;
                                case 'update':
                                    angular.forEach($scope.forms, function(frm,ind){
                                        if(frm.id == form.id){
                                            $scope.forms[ind] = angular.copy(form);
                                        }
                                    });
                                    break;
                            }
                        }else{
                            console.log('Recieved Nothing on ---> simulation_player_form:' + $scope.game.id+'/'+$scope.user.id);
                        }
                        $scope.$apply();
                    });
                });
            }
            $scope.show_incoming_messages = function(gameId,userId){
                $scope.state = 'second';
                localStorage["loginSimulationState"] = $scope.state;
                localStorage["loginSimulationGameId"] = gameId;
                $scope.first = [];
                $scope.second = [];
                $scope.third = [];
                $http.get('/simulation/read-messages/all/' + gameId+'/'+userId).then(function (res) {
                    $scope.readMessages = res.data;
                    $scope.read_messages = $scope.readMessages.map(function(x) { return x.templatePlanMessageId;})
                    $http.get('/simulation/archive-messages/all/' + gameId+'/'+userId).then(function (res) {
                        $scope.archiveMessage = res.data;
                        $scope.archive_messages = $scope.archiveMessage.map(function(x) { return x.templatePlanMessageId;})
                        $http.get('/simulation/schedule-game-messages/my-messages/' + gameId + '/' + userId)
                        .then(function (response) {
                            if(response.status == 380){
                                    toastr.warning('Game not Found');
                            }else{
                                $scope.game = response.data.gamePlanTemplate;
                                $scope.rolesToShow = angular.copy($scope.game.roles);
                                
                                $scope.myMessages = response.data.myMessages;
                                $scope.myMessages = Query.sort($scope.myMessages,'activatedAt',true,true);
                                make_arrays();
                                setSocketForGameMessages();
                                setSocketForForms();
                                $scope.outgoing();
                            }
                        });
                    });
                });

             }
            $scope.verify = function(){
                $http.post('users/verifyEmail',{data:$scope.data}).then(function(res) {
                    $scope.user = res.data;
                    var user = res.data.token;
                    var exp = new Date(new Date().getTime() + 1000*60*60).toUTCString();
                    Query.setCookie('Auth_token',user,{expires: exp});
                    if($scope.user.id){
                        $scope.state = 'first';
                        localStorage["loginSimulationUser"] = JSON.stringify($scope.user);
                        localStorage["loginSimulationState"] = $scope.state;
                        $scope.activeGamesTable($scope.tableState);
                        toastr.success('Here is your active game');

                    }else{
                        toastr.error('Record Not found! Please provide correct information');
                    }
               });
            }
            $scope.logout = function(){
                $scope.state = 'login';
                delete localStorage["loginSimulationUser"];
                delete localStorage["loginSimulationState"];
                delete localStorage["loginSimulationGameId"]
                Query.delCookie('Auth_tk.sig');
                Query.delCookie('incidentSelected');
                Query.delCookie('user');
                Query.delCookie('Auth_token');
                delete localStorage['role'];
            }
            function init() {
                $scope.data = {};
                $scope.state = 'login';

                if(localStorage["loginSimulationUser"]){
                    $scope.user = JSON.parse(localStorage["loginSimulationUser"]);
                    $scope.data.email = $scope.user.email;
                    if(localStorage["loginSimulationState"]){
                        $scope.state = localStorage["loginSimulationState"];
                        if($scope.state == 'first'){
                            $scope.verify();
                        }else if ($scope.state == 'second'){
                            $scope.show_incoming_messages(localStorage["loginSimulationGameId"],$scope.user.id);
                        }
                    }
                }    
            }

            init();
            $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
            $scope.pageItems = 10;

             $scope.roleInfo = function (activity) { // tick
                ModalService.showModal({
                    templateUrl: "views/actionPlanDashboard/task-info-modal.html",
                    controller: "taskInfoModalCtrl",
                    inputs: {
                        activity: activity,
                        showEditButton: false
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };
            $scope.readMessage = function (message) {
                var data = {
                    templatePlanMessageId : message.id,
                    gamePlanTemplateId : $scope.game.id,
                    gamePlayerId : $scope.user.id
                }
                $http.post("/simulation/read-messages/save", { data: data }).then(function (res) {
                    $scope.readMessages.push(res.data);
                    $scope.read_messages = $scope.readMessages.map(function(x) { return x.templatePlanMessageId;})
                });

            };

            $scope.archiveMessages = function (message,event) {
                event.stopPropagation();
                event.preventDefault();
                var data = {
                    templatePlanMessageId : message.id,
                    gamePlanTemplateId : $scope.game.id,
                    gamePlayerId : $scope.user.id
                }
                $http.post("/simulation/archive-messages/save", { data: data }).then(function (res) {
                    $scope.archiveMessage.push(res.data);
                    $scope.archive_messages = $scope.archiveMessage.map(function(x) { return x.templatePlanMessageId;})
                    make_arrays();
                });
            };

            $scope.fillUpForm = function(dynamic_form) {
                console.log(dynamic_form);
                $scope.click = !$scope.click;
                ModalService.showModal({
                    templateUrl: "views/dynamic-form/view.html",
                    controller: "dynamicFormViewCtrl",
                    inputs : {
                        sender: $scope.user,
                        record: 'player',
                        dynamicForm: dynamic_form,
                        detailed : false,
                        tableInfo: {
                            tableId: $scope.game.id,
                            tableName: AppConstant.SIMULATION_TABLE_NAME,
                            dynamicFormId: dynamic_form.id
                        }
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        if(result){
                            var data = {
                                dynamicFormId: dynamic_form.id,
                                submissionId: result.data.id,
                                gamePlanTemplateId: $scope.game.id,
                                gamePlayerId: $scope.user.id,
                                submitted: true
                            }
                            DynamicFormService.UpdateFormDetail(data).then(function(res){
                                toastr.success('Form Submitted.','Success')

                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                        }
                    });
                });
            };
            var imageModal = function (record) {
                $uibModal.open({
                    templateUrl: 'views/settings/libraries/lib-image.html',
                    size: 'lg',
                    windowClass: 'image-modal' + record.id,
                    controller: function ($scope, $uibModalInstance) {
                        var self = this;
                        $scope.record = record;
                        $scope.size = 100;
                        $scope.maximized = false;
                        var getWindow = function () {
                            if (!self.window) {
                                self.parent = angular.element('.image-modal' + record.id);
                                self.window = self.parent.find('.modal-dialog');
                            }
                            return self.window;
                        };
                        $scope.maximize = function () {
                            var win = getWindow();
                            self.parent.addClass('max');
                            $scope.maximized = true;
                        };
                        $scope.restore = function () {
                            myMessagesCtrl
                            var win = getWindow();
                            self.parent.removeClass('max');
                            $scope.maximized = false;
                        };
                        $scope.close = function () {
                            $uibModalInstance.close();
                        }
                        $scope.zoom = function (dir) {
                            switch (dir) {
                                case 'in':
                                    $scope.size += 5;
                                    break;
                                case 'out':
                                    $scope.size -= 5;
                                    break;
                            }
                        }
                    }
                });
            };

            var pdfModal = function (record) {
                $uibModal.open({
                    templateUrl: 'views/settings/libraries/lib-pdf.html',
                    size: 'lg',
                    windowClass: 'pdf-modal pdf-modal' + record.id,
                    controller: function ($scope, $uibModalInstance, $sce) {
                        var self = this;
                        $scope.record = record;
                        $scope.size = 100;
                        $scope.url = $sce.trustAsResourceUrl(record.url);
                        $scope.maximized = false;
                        var getWindow = function () {
                            if (!self.window) {
                                self.parent = angular.element('.pdf-modal' + record.id);
                                self.window = self.parent.find('.modal-dialog');
                            }
                            return self.window;
                        };
                        $scope.maximize = function () {
                            var win = getWindow();
                            self.parent.addClass('max');
                            $scope.maximized = true;
                        };
                        $scope.restore = function () {
                            var win = getWindow();
                            self.parent.removeClass('max');
                            $scope.maximized = false;
                        };
                        $scope.close = function () {
                            $uibModalInstance.close();
                        }

                    }
                });
            };
             var videoModal = function (record, size) {
                $uibModal.open({
                    templateUrl: 'views/settings/libraries/lib-video.html',
                    size: size,
                    windowClass: 'video-modal' + record.id,
                    controller: function ($scope, $uibModalInstance, $sce, $window) {
                        var self = this;
                        $scope.record = record;
                        $scope.maximize = function () {
                            $scope.API.toggleFullScreen();
                        };
                        $scope.restore = function () {
                            $scope.API.toggleFullScreen();
                        };
                        $scope.close = function () {
                            $uibModalInstance.close();
                        }
                        $scope.API = null;
                        $scope.onPlayerReady = function (API) {
                            $scope.API = API;
                        };
                        $scope.config = {
                            sources: [
                                { src: $sce.trustAsResourceUrl(record.url), type: record.mimetype },
                            ],
                            theme: "bower_components/videogular-themes-default/videogular.css"
                        };
                    }
                });
            };

            $scope.previewAttachment = function (record) {
                switch (record.type) {
                    case "image":
                        imageModal(record);
                        break;
                    case "video":
                        videoModal(record, 'lg');
                        break;
                    case "pdf":
                        pdfModal(record);
                        break;
                    case "audio":
                        videoModal(record, 'md');
                        break;
                }
            };

            $scope.showLink = function (link) {
                ModalService.showModal({
                    templateUrl: "views/simulation/my-messages/media-link-modal.html",
                    inputs: { link: link },
                    controller: function ($scope, $http, $sce, $location, AuthService, ModalService, close, link) {
                        $scope.liblink = $sce.trustAsResourceUrl(link);
                        $scope.link = $sce.trustAsResourceUrl(link);

                        $scope.clearBrowser = function () {
                            $scope.liblink = '';
                            $scope.link = ' ';
                        }

                        $scope.RefreshPage = function () {
                            $scope.link = 'abcd';
                            $scope.link = $scope.liblink;
                        };

                        $scope.refreshframe = function () {
                            $scope.link = $sce.trustAsResourceUrl($scope.liblink);
                        };

                        $scope.close = function () {
                            close();
                        };
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };

            $scope.checkLink = function (link) {
                if (!link || link === '') {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.dateTimeFormat = function (dat) {
                return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
            };

            $scope.setOffTimeFormat = function (dat) {
                return moment(dat).utc().local().format('mm:ss');
            };
            $scope.sendMessage = function(msg){
                var data = {
                    status: 'Incoming',
                    incidentId: $scope.game.incident.id,
                    message: msg,
                    gamePlayerId: $scope.user.id,
                    type: 'player'
                };
                MessageService.save(data).then(function(res){
                    $scope.message = '';
                    $scope.outgoing();
                    toastr.success("Message Sent..");
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/messages/save", { data: data }).then(function (res) {

                // });
            }
            $scope.outgoing = function () {
                MessageService.all($scope.user.id,$scope.game.incident.id,'player').then(function(response){
                    $scope.outgoing_messages = response.data;
                    $scope.outgoing_messages = Query.filter($scope.outgoing_messages,{type: 'player'},false);
                    $scope.outgoing_messages = Query.sort($scope.outgoing_messages,'createdAt',false,true);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/messages/all/' + $scope.user.id + '/' + $scope.game.incident.id)
                // .then(function (response) {

                // });
            };
            $scope.activeGamesTable = function (tableState) {
                $scope.tableState = tableState;
                if($scope.state != 'login'){
                    $scope.isLoading = true;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;
                    var number = pagination.number || 10;
                    $http.get('/simulation/schedule-games/player-details/' + $scope.user.id)
                    .then(function (response) {
                        $scope.a = [];
                        angular.forEach(response.data, function(msg, key) {
                            if(msg.plan_activated == true && msg.status != 'stop'){
                                $scope.a.push(msg);
                            }
                        });
                        $scope.total = response.data.length;
                        var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                        if (tableState.sort.predicate) {
                            filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                        }
                        var result = filtered.slice(start, start + number);
                        $scope.activeGames = result;

                        tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                        $scope.isLoading = false;
                    });
                }
            };

            $scope.playGame = function (gameId) {
                ModalService.showModal({
                    templateUrl: "views/simulation/scheduled-games/play-scheduled-game-modal.html",
                    controller: "playScheduledGameModalCtrl",
                    inputs: { gameId: gameId }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };

            $scope.trustedHtml = function (value) {
                return $sce.trustAsHtml(value);
            };
            $scope.dateTimeFormat = function(dat){
                return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
            };

            $scope.setOffTimeFormat = function (dat) {
                return moment(dat).utc().local().format('mm:ss');
            };

            $scope.close = function() {
 	            close();
            };
        }
}());
