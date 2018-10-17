(function () {
	'use strict';

	angular.module('app')
		.controller('myMessagesCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$uibModal', '$location','filterFilter','$sce','$timeout','Query','MessageService','DynamicFormService', myMessagesFunction]);

	function myMessagesFunction($scope, $filter, $routeParams, $http, AuthService, ModalService, $uibModal, $location,filterFilter,$sce,$timeout,Query, MessageService,DynamicFormService) {


		
		$scope.show = false;
		$scope.another = false;
        $scope.user = Query.getCookie('user');

        if($routeParams.multiple == 'true'){
        	$scope.path = 'simulation/player-page';
        }else if ($routeParams.multiple == 'false'){
        	$scope.path = 'simulation/scheduled-games';
        }else{
        	$scope.path = 'simulation/active-games/'+$routeParams.templateGameId;
        }
        var make_arrays = function(){
        	$scope.first = []
			$scope.second = []
			$scope.third = []

			$scope.myMessages = $filter('filter')($scope.myMessages, function(item){ 
             	return !$scope.archive_messages.includes(item.id);
           	});

			angular.forEach($scope.myMessages, function(value, key) {
				// value.assigned_game_message.game_message.type == 'Role Description'
			  if(value.game_message.type == 'Background'){
			  	$scope.first.push(value);
			  }else if (value.game_message.type == 'Task'){
			  	$scope.second.push(value);
			  }else if (value.game_message.type == 'Message'){
			  	$scope.third.push(value);
			  }
			});
        }

        //sockets for messages
		var setSocketForGameMessages = function () {
            $timeout(function () {
            	console.log('Listening ----> game_plan_template_messages:'+ $routeParams.templateGameId + '/' + $routeParams.userId);
                SOCKET.on('game_plan_template_messages:'+ $routeParams.templateGameId + '/' + $routeParams.userId, function (response) {
                    console.log('Game Recieved ----> game_plan_template_messages:'+ $routeParams.templateGameId + '/' + $routeParams.userId,response.data);
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
        //sockets for messages
		
        var setSocketForIncomingMessages = function () {
            $timeout(function () {
            	if($scope.game.incident){
	            	console.log('Listening ----> incoming_message:' + $scope.game.incident.id);
	                SOCKET.on('incoming_message:' + $scope.game.incident.id, function (response) {
	                    console.log('Game Recieved ----> Listening ----> incoming_message:' + $scope.game.incident.id,response.data);
	                    var message = response.data;
	                    if(message){
	                        switch (response.action) {
	                            case 'new':
	                                $scope.outgoing_messages.push(message);
									// $scope.outgoing_messages = Query.filter($scope.outgoing_messages,{type: 'player'},false);
									$scope.outgoing_messages = Query.sort($scope.outgoing_messages,'createdAt',true,true);
	                                break;
	                        }
	                    }else{
	                        console.log('Recieved Nothing on ---> game_plan_template_messages:'+ $routeParams.templateGameId + '/' + $routeParams.userId);
	                    }
	                    $scope.$apply();
	                });
            	}
            });
        }

		var setSocketForForms = function () {
			$scope.forms = [];
			DynamicFormService.getFormForPlayer($scope.game.id,$routeParams.userId).then(function(response){
				$scope.forms = response.data;
				console.log($scope.forms);
				// $scope.outgoing_messages = Query.sort($scope.outgoing_messages,'createdAt',false,true);
			
			},function(err){
				if(err)
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
            $timeout(function () {
            	console.log('Listening ----> simulation_player_form:' + $scope.game.id+'/'+$routeParams.userId);
                SOCKET.on('simulation_player_form:' + $scope.game.id+'/'+$routeParams.userId, function (response) {
                    console.log('Game Recieved ----> Listening ----> simulation_player_form:' + $scope.game.id+'/'+$routeParams.userId,response.data);
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
                        console.log('Recieved Nothing on ---> simulation_player_form:' + $scope.game.id+'/'+$routeParams.userId);
                    }
                    $scope.$apply();
                });
            });
        }

        //fetch and set some initial data
		var init = function () {
			$http.get('/simulation/read-messages/all/' + $routeParams.templateGameId+'/'+$routeParams.userId).then(function (res) {
 				$scope.readMessages = res.data;
                $scope.read_messages = $scope.readMessages.map(function(x) { return x.templatePlanMessageId;})
				$http.get('/simulation/archive-messages/all/' + $routeParams.templateGameId+'/'+$routeParams.userId).then(function (res) {
	 				$scope.archiveMessage = res.data;
	               	$scope.archive_messages = $scope.archiveMessage.map(function(x) { return x.templatePlanMessageId;})
					$http.get('/simulation/schedule-game-messages/my-messages/' + $routeParams.templateGameId + '/' + $routeParams.userId)
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
							setSocketForIncomingMessages();
							setSocketForForms();
							$scope.outgoing();
		                }
					});
	            });
            });

		}
		init();
		
		$scope.outgoing = function () {
			MessageService.all($routeParams.userId,$scope.game.incident.id,'player').then(function(response){
				$scope.outgoing_messages = response.data;
				$scope.outgoing_messages = Query.filter($scope.outgoing_messages,{type: 'player'},false);
				$scope.outgoing_messages = Query.sort($scope.outgoing_messages,'createdAt',true,true);
			},function(err){
				if(err)
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
 		};

		$scope.trustedHtml = function (value) {
	  		return $sce.trustAsHtml(value);
 		};

 		$scope.readMessage = function (message) {
	  		console.log('()()()()()()()()()()',message)
	  		var data = {
	  			templatePlanMessageId : message.id,
	  			gamePlanTemplateId : $routeParams.templateGameId,
	  			gamePlayerId : $routeParams.userId
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
	  			gamePlanTemplateId : $routeParams.templateGameId,
	  			gamePlayerId : $routeParams.userId
	  		}
	  		$http.post("/simulation/archive-messages/save", { data: data }).then(function (res) {
            	$scope.archiveMessage.push(res.data);
               	$scope.archive_messages = $scope.archiveMessage.map(function(x) { return x.templatePlanMessageId;})
            	make_arrays();
            });
 		};

 		$scope.save = function (message,message_response) {
	  		var data = {
                content : message_response,
	  			templatePlanMessageId : message.id,
	  			gamePlanTemplateId : $routeParams.templateGameId,
	  			gamePlayerId : $routeParams.userId
	  		}
	  		console.log('^^^^^^^^^^^^^^^^******************',data)
	  		$http.post("/simulation/message-responses/save", { data: data }).then(function (res) {
            	$scope.message_response = '';
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
                    record: 'user',
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
                    		gamePlayerId: $routeParams.userId,
                    		submitted: true
                    	}
                    	DynamicFormService.UpdateFormDetail(data).then(function(res){
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

 		$scope.sendMessage = function(msg){
 			var data = {
                status: 'Incoming',
                incidentId: $scope.game.incident.id,
                gamePlayerId: $routeParams.userId,
                type: 'player',
                message: msg
            };
            MessageService.save(data).then(function(res){
            	$scope.message = '';
            	$('#player-page-type').val('');
 				// $scope.outgoing();
 				console.log('asdadasd')
 				toastr.success("Message Sent..");
            },function(err){
            	if(err)
            		toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            	else
            		toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
 			// $http.post("/messages/save", { data: data }).then(function (res) {
 				
    //         });
 		}
 		//show role info
		$scope.roleInfo = function (activity) { // tick
			console.log(activity);
			$http.get('/simulation/game-roles/get/' + activity.id)
			.then(function (response) {
	            ModalService.showModal({
	                templateUrl: "views/actionPlanDashboard/task-info-modal.html",
	                controller: "taskInfoModalCtrl",
	                inputs: {
	                    activity: response.data,
	                    showEditButton: false
	                }
	            }).then(function (modal) {
	                modal.element.modal({ backdrop: 'static', keyboard: false });
	                modal.close.then(function (result) {
	                    $('.modal-backdrop').remove();
	                    $('body').removeClass('modal-open');
	                });
	            });
			});
        };

     	//show image data
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

     	//show pdf data
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

		//show video data
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

		//previous attachment
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

		//show link in modal
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

		//check link if present
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
	}
}());
