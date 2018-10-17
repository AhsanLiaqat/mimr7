(function () {
    'use strict';

    angular.module('app')
    .controller('dashboardCtrl', ['$scope', '$http', '$rootScope', '$route', 'AuthService', '$routeParams', 'ModalService', '$location', '$timeout', 'filterFilter', '$filter', '$window','Query','AccountService','CheckListService','ColorPaletteService','IncidentTeamService','LibraryService','IncidentPlanService','IncidentCheckListService','ActionService','ClassService','MessageHistoryService','MessageService','ReportService','IncidentService','CustomMessageService','$sce', dashCtrl]);
    function dashCtrl($scope ,$http ,$rootScope ,$route,AuthService ,$routeParams,ModalService ,$location ,$timeout,filterFilter ,$filter ,$window,Query, AccountService, CheckListService, ColorPaletteService, IncidentTeamService, LibraryService, IncidentPlanService, IncidentCheckListService, ActionService, ClassService, MessageHistoryService, MessageService, ReportService, IncidentService,CustomMessageService,$sce) {
            //////////////// Sockets Work ////////////////////////

            $scope.user = Query.getCookie('user');
            $scope.froalaOptionsForMessage = {
            	key: 'NikyA4H1qaA-21fE-13dplxI2C-21r==',
				toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"]
			}
			$scope.froalaOptions = {
            	key: 'NikyA4H1qaA-21fE-13dplxI2C-21r=='
			}
            var setSocketForIncidentProperties = function(){
                $timeout(function () {
					SOCKET.on('incoming_message:'+$scope.incident.id, function (response) {
						var data = response.data;
						if(response.action == "new"){
							console.log("incoming_message new",data);
							$scope.messages.push(data);
							if($scope.layout.notification == true){
								toastr.success("New message arrived in incomming messages.");
							}
						}else if(response.action == "delete"){
							console.log("incoming_message delete",data);
							for(var i = 0; i < $scope.messages.length; i++){
								if($scope.messages[i].id == data.id){
									$scope.messages.splice(i,1);
									break;
									if($scope.layout.notification == true){
										toastr.success("Incoming message moved to class.");
									}
								}
							}
						}
						else {
							toastr.error("Something went wrong!");
							console.log("incoming_message --> does not match any action incident_class socket.",response);
						}
						$scope.messages = Query.sort($scope.messages,'createdAt',true);
                        $scope.$apply();
                    });
					SOCKET.on('incident_class:'+$scope.incident.id, function (response) {
						// console.log("listen incident_class,response,$scope.data.classes)
						var data = response.data
						if(response.action == "new"){
							console.log("incident_class new",data);
							data.show = true;
							data.messages = []
							if($scope.data.classes && $scope.data.classes.length > -1){
								$scope.data.classes.push(data)
							}else {
								$scope.data.classes = [];
								$scope.data.classes.push(data)
							}
							if($scope.layout.notification == true){
								toastr.success("New class added: " + data.title)
							}
						}else if(response.action == "delete"){
							console.log("incident_class delete",data);
							for(var i = 0; i < $scope.data.classes.length; i++){
								if($scope.data.classes[i].id == data.classId){
									$scope.data.classes.splice(i,1);
									if($scope.layout.notification == true){
										toastr.success("Class deleted successfully.")
									}
									break;
								}
							}
						}else if(response.action == "update"){
							console.log("incident_class update",data);
							for(var i = 0; i < $scope.data.classes.length; i++){
								if($scope.data.classes[i].id == data.id){
									$scope.data.classes[i].index = data.index;
									$scope.data.classes[i].title = data.title;
									$scope.data.classes[i].summary = data.summary;
									$scope.data.classes[i].updatedAt = data.updatedAt;
									if($scope.layout.notification == true){
										toastr.success("Class updated.")
									}
									break;
								}
							}
							$scope.data.classes = Query.sort($scope.data.classes,'index',false);
						}else {
							toastr.error("Something went wrong!");
							console.log("incident_class --> does not match any action incident_class socket.",response);
						}
						$scope.$apply();
					});
					SOCKET.on('incident_class_messages:'+$scope.incident.id, function (response) {
						console.log($scope.data.classes);
						var data = response.data;
						if(response.action == "delete"){
							console.log("incident_class_messages delete",data);
							for(var j = 0; j < $scope.data.classes.length; j++){
								if($scope.data.classes[j].id ==  data.classId){
									for(var i = 0; i < $scope.data.classes[j].messages.length; i++){
										if($scope.data.classes[j].messages[i].id == data.messageId){
											$scope.data.classes[j].messages.splice(i,1);
											// toastr.success("Success!");
											break;
										}
									}
									break;
								}
							}
						} else if(response.action == "new"){
							console.log("incident_class_messages new",data);
							console.log(response.data);
							for(var j = 0; j < $scope.data.classes.length; j++){
								if($scope.data.classes[j].id ==  data.classId){
									data.showFilter = true;
									if($scope.data.classes[j].messages && $scope.data.classes[j].messages.length > -1){
										$scope.data.classes[j].messages.push(data);
									}else {
										$scope.data.classes[j].messages = [];
										$scope.data.classes[j].messages.push(data);
									}
									if($scope.layout.notification == true){
										toastr.success("Message added in class!");
									}
									$scope.data.classes[j].messages = $filter('orderBy')($scope.data.classes[j].messages, [ 'createdAt'],true);
									$scope.data.classes[j].messages = $filter('orderBy')($scope.data.classes[j].messages, ['index'],false);

									// $scope.data.classes[j].messages = Query.sort($scope.data.classes[j].messages,'index',false);
									console.log('sorted Array',$scope.data.classes[j].messages);
									
									break;
								}
							}
						}else if(response.action == "update-index"){
							console.log("incident_class_messages update-index",data);
							for(var j = 0; j < $scope.data.classes.length; j++){
								if($scope.data.classes[j].id ==  data.classId){
									for(var i = 0; i < $scope.data.classes[j].messages.length; i++){
										for(var k = 0; k < data.array.length; k++){
											if(data.array[k].id == $scope.data.classes[j].messages[i].id){
												$scope.data.classes[j].messages[i].index = data.array[k].index;
												break;
											}
										}
									}
									$scope.data.classes[j].messages = $filter('orderBy')($scope.data.classes[j].messages, [ 'createdAt'],true);
									$scope.data.classes[j].messages = $filter('orderBy')($scope.data.classes[j].messages, ['index'],false);
									console.log('sorted Array',$scope.data.classes[j].messages);
									// toastr.success("Messages positions updated");
									break;
								}
							}
						} else if(response.action == "update"){
							console.log("incident_class_messages update",data.index,data.content);
							console.log(response.data);
							for(var j = 0; j < $scope.data.classes.length; j++){
								if($scope.data.classes[j].id ==  data.classId){
									for(var i = 0; i < $scope.data.classes[j].messages.length; i++){
										if($scope.data.classes[j].messages[i].id == data.id){
											data.showFilter = true;
											$scope.data.classes[j].messages[i] = data;
											// toastr.success("Message updated");
											break;
										}
									}
									$scope.data.classes[j].messages = $filter('orderBy')($scope.data.classes[j].messages, [ 'createdAt'],true);
									$scope.data.classes[j].messages = $filter('orderBy')($scope.data.classes[j].messages, ['index'],false);
									break;
								}
							}
						} else {
							toastr.error("Something went wrong!");
							console.log("incident_class_messages --> does not match any action incident_class_messages socket.",response);
						}
						$scope.$apply();
					});
					SOCKET.on('incident_check_list:'+$scope.incident.id, function (response) {
						// console.log("listen incident_class,response,$scope.data.classes)
						console.log('check list',$scope.checkedList);
						var data = response.data
						if(response.action == "new"){
							console.log("incident_check_list new",data);
							var finalData = angular.copy(data.checkList);
	                        finalData.createdAt = setDateFormat(finalData.createdAt);
	                        finalData.tasks = [];
	                        angular.forEach(data.incident_checkList_copies, function(t, key2) {
	                            if (t.task_list){
	                                var task = t.task_list;
	                                task.status = t.status;
	                                finalData.tasks.push(task);
	                            }
	                        });
							if($scope.checkedList && $scope.checkedList.length > -1){
								$scope.checkedList.push(finalData)
							}else {
								$scope.checkedList = [];
								$scope.checkedList.push(finalData)
							}
							toastr.success("New checklist added.");
						}else if(response.action == "delete"){
							console.log("incident_check_list delete",data);
							for(var i = 0; i < $scope.checkedList.length; i++){
								if($scope.checkedList[i].id == data.id){
									$scope.checkedList.splice(i,1);
									if($scope.layout.notification == true){
										toastr.success("checklist deleted.");
									}
									break;
								}
							}
						}else if(response.action == "update"){
							console.log("incident_check_list update",data);
							for(var i = 0; i < $scope.checkedList.length; i++){
								if($scope.checkedList[i].id == data.checkListId){
									for(var j = 0; j < $scope.checkedList[i].tasks.length; j++){
										if($scope.checkedList[i].tasks[j].id == data.taskId){
											$scope.checkedList[i].tasks[j].status = data.taskStatus;
											if($scope.layout.notification == true){
												toastr.success("Task status updated.");
											}
											break;
										}
									}
									break;
								}
							}
						}else {
							toastr.error("Something went wrong!");
							console.log("incident_check_list --> does not match any action incident_check_list socket.",response);
						}
						$scope.checkedList = Query.sort($scope.checkedList,'name',false);
						$scope.$apply();
					});
					SOCKET.on('incident_action_list:'+$scope.incident.id, function (response) {
						// console.log("listen incident_class,response,$scope.data.classes)
						console.log('action list',$scope.checkedList);
						var data = response.data
						if(response.action == "new"){
							console.log("incident_action_list new",data);
							var finalData = angular.copy(data.checkList);
	                        finalData.createdAt = setDateFormat(finalData.createdAt);
	                        finalData.tasks = [];
	                        angular.forEach(data.incident_checkList_copies, function(t, key2) {
	                            if (t.task_list){
	                                var task = t.task_list;
	                                task.status = t.status;
	                                finalData.tasks.push(task);
	                            }
	                        });
							$scope.checkedList.push(finalData)
						}else if(response.action == "delete"){
							console.log("incident_action_list delete",data);
							for(var i = 0; i < $scope.checkedList.length; i++){
								if($scope.checkedList[i].id == data.id){
									$scope.checkedList.splice(i,1);
									break;
								}
							}
						}else if(response.action == "update"){
							console.log("incident_action_list update",data);
							for(var i = 0; i < $scope.checkedList.length; i++){
								if($scope.checkedList[i].id == data.checkListId){
									for(var j = 0; j < $scope.checkedList[i].tasks.length; j++){
										if($scope.checkedList[i].tasks[j].id == data.taskId){
											$scope.checkedList[i].tasks[j].status = data.taskStatus;
											break;
										}
									}
									break;
								}
							}
						}else {
							console.log("incident_action_list --> does not match any action incident_check_list socket.",response);
						}
						$scope.checkedList = Query.sort($scope.checkedList,'name',false);
						$scope.$apply();
					});
                })
            }

            /////////////// End /////////////

            ////////////// Init Fucntion //////////
            var vm = this;

            vm.filterMessages = function(){
                angular.forEach($scope.classes, function(c, index){
                    if(c.messages.length > 0){
                        angular.forEach(c.messages, function(m, index1){
                            console.log(new Date(m.createdAt));
                            if(new Date(m.createdAt) < new Date($scope.slider.value) ){
                                console.log("if");
                                $scope.classes[index].messages[index1].showFilter = true;
                            }else{
                                console.log("else");
                                $scope.classes[index].messages[index1].showFilter = false;
                            }
                        });
                    }
                });
                console.log($scope.slider.value);
            };

            function init() {
                $scope.myHtml = "<h1>Hello World</h1>";
                $scope.classes = {};
                $scope.check = {};
                $scope.summaryPage = true;
                $scope.classes = [];
                $scope.msg = '';
                $scope.posArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                $scope.messagesStyle = {};
                $scope.priceSlider = 150;
                $scope.showTimeline = false;
                $scope.taOptions={
                    toolbar: [
                      ['h1', 'h2', 'quote'],
                      ['bold', 'italics', 'clear'],
                      ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                      ['html']
                    ]
                };
                // $scope.taOptions.toolbar = [
                //   ['h1', 'h2', 'quote'],
                //   ['bold', 'italics', 'clear'],
                //   ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                //   ['html']
                // ];

                IncidentTeamService.all().then(function(response){
                    $scope.teams = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/settings/incident-teams/all').then(function (response) {

                // });
                ColorPaletteService.list().then(function(res){
                    $scope.colorPalettes = res.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/settings/color-palettes/list").then(function(res){

                // });
                CheckListService.list($scope.user.userAccountId).then(function(response){
                    $scope.check_lists = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = "/settings/check-lists/list?accountId=" + $scope.user.userAccountId ;
                // $http.get(path).then(function(response) {

                // });
                AccountService.get($scope.user.userAccountId).then(function(response){
                    $scope.accountSettings = response.data;
                    $scope.messagesStyle = {
                        'font-size': $scope.accountSettings.messages_font_size + 'px',
                        'font-family': $scope.accountSettings.messages_font_family
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = "/settings/accounts/get?id=" + $scope.user.userAccountId ;
                // $http.get(path).then(function(response) {

                // });

                IncidentService.all($scope.user.userAccountId).then(function(response){
                    $scope.incidents = response.data;
                    $scope.sortByCreated = _.sortBy($scope.incidents, function (o) { return new Date(o.updatedAt); });
                    $scope.incidents = $scope.sortByCreated.reverse();
                    
                    if ($scope.incidents.length > 0) {
                        if ($routeParams.id) {
                            $scope.incident = filterFilter($scope.incidents, { 'id': $routeParams.id })[0];
                        } else if (Query.getCookie('incidentSelected') === undefined) {
                            $scope.incident = $scope.incidents[0];
                            $scope.selectIncident = false;
                            Query.setCookie('incidentSelected', JSON.stringify($scope.incident));
                        } else if (Query.getCookie('incidentSelected') !== undefined) {
                            var incident = Query.getCookie('incidentSelected');
                            var selectedIncident = filterFilter($scope.incidents, { 'id': incident.id });
                            $scope.incident = selectedIncident[0];
                            Query.setCookie('incidentSelected', JSON.stringify($scope.incident));
                        }

                        if ($scope.incident) {
                        	if($scope.incident.incident_plans.length > 0){
		                        angular.forEach($scope.incident.incident_plans, function(plan, index){
		                            if (plan.selected == true){
		                                $scope.selectedPlan = plan;
		                            }
		                            angular.forEach(plan.incident_agenda_points, function(point, indx){
		                            	point.incident_agenda_activities = [];
			                           	angular.forEach(plan.incident_agenda_activities, function(act, indx){
				                            if(point.id == act.incidentAgendaPointId){
				                            	point.incident_agenda_activities.push(angular.copy(act));
				                            }
				                        }); 
			                        });
		                        });
		                    }
                            $scope.loadCheckLists();
                            loadClasses();
                            loadActionlist();
                            // loadMessageHistory();
                            loadIncomingMessages();
                            setSocketForIncidentProperties();
                            loadSliderTimeline();


                            $scope.sortByCreate = _.sortBy($scope.messages, function (o) { return new Date(o.createdAt); });
                            $scope.messages = $scope.sortByCreate.reverse();

                            $scope.selectedIncidentPlan = filterFilter($scope.incident.incident_plans, { 'selected': true })[0];

                            if ($scope.selectedIncidentPlan) {
                                IncidentPlanService.getActivities($scope.selectedIncidentPlan.id).then(function(response){
                                    $scope.activities = response.data.incident_activities;
                                    $scope.safeActivities = $scope.activities;
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                // $http.get("/incident-plan/get-activities?id=" + $scope.selectedIncidentPlan.id)
                                // .then(function (response) {

                                // });
                            }
                        }
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/api/incidents/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {

                // });
            }
            ///////////// End /////////////////////////////////////////////


            /////////// All Modal Fucntions /////////////////////////////////////

            $scope.openChecklistMenu = function(){ // tick
                ModalService.showModal({
                    templateUrl: "views/settings/check-lists/attach.html",
                    controller: "checkListCreateAttachCtrl",
                    inputs : {
                        checklist: $scope.checkedList,
                        incident: $scope.incident
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        console.log(result);
                        // $scope.checkedList.push(result);
                        console.log($scope.checkedList);
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    }.bind($scope));
                }.bind($scope));
            }

            $scope.checklistDelete = function(list, event){ // tick
                var data = {};
                data.checkListId = list.id;
                data.incidentId = $scope.incident.id;
                if (confirm("Checklist will be removed, please confirm?")) {
                    IncidentCheckListService.delete(data.checkListId,data.incidentId).then(function(response){
                        // $scope.loadCheckLists();
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/incident-check-list/remove', { data: data }).then(function (response) {

                    // });
                }else{
                    event.stopPropagation();
                    event.preventDefault();
                }
            }

            $scope.taskInfo = function (activity) { // tick
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

            $scope.loadMap = function () { // tick
                if ($scope.incident && typeof $scope.incident.locations !== 'undefined') {
                    ModalService.showModal({
                        templateUrl: "views/crisis-manager/general/location-map.html",
                        controller: "locationMapCtrl",
                        inputs: {
                            incident: $scope.incident
                        }
                    }).then(function (modal) {
                        modal.element.modal({ backdrop: 'static', keyboard: false });
                        modal.close.then(function (result) {
                            $('.modal-backdrop').remove();
                            $('body').removeClass('modal-open');
                        });
                    });
                } else {
                    toastr.error('Please select an incident with location defined');
                }
            }

            $scope.resetDashboard = function () { // tick
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/information-dashboard/reset-answer-popup.html",
                    controller: "resetCtrl"
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        console.log(result);
                        if(result != undefined && result.answer === 'CONFIRM'){
                            $scope.ids = [];
                            _.each($scope.data.classes, function (cls) {
                                var data = cls.messages.filter(function(msg){
                                    console.log(msg.selectedColor);
                                    console.log(result.notSelected.indexOf(msg.selectedColor));
                                    if(msg.selectedColor === null){
                                        return msg;
                                    }else if(result.notSelected.indexOf(msg.selectedColor) > -1){
                                        return msg;
                                    }
                                }).map(function(s){
                                    return s.id;
                                });
                                $scope.ids = $scope.ids.concat(data);
                            });
                            console.log($scope.ids);
                            MessageHistoryService.bulkRemove($scope.ids).then(function(res){
                                loadClasses();
								if($scope.layout.notification == true){
                                	toastr.success("Dashboard Reset");
								}
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/message-history/bulk-remove', { data: $scope.ids }).then(function (res) {

                            // });
                        }else{
                            toastr.error('Dashboard Not reset. Try again');
                        }
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });

            }

            $scope.zoomCategory = function (category, index) { // tick
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/information-dashboard/category.edit.html",
                    controller: "editCategoryCtrl",
                    inputs: {
                        data: category,
                        incident_id: $scope.incident.id
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        if (result === 'deleted') {
                            $scope.data.classes.splice(index, 1);
                        }
                    });
                });
            };

            $scope.showTeams = function () { // tick
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/general/teams-template.html",
                    controller: "showTeamsCtrl"
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };

            $scope.summaryReport = function () { // tick
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/information-dashboard/summary-report-template.html",
                    controller: "dashboardCtrl"
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function () {
                        setTimeout(function(){
                            $('.modal-backdrop').remove();
                            $('.modal-backdrop.in').remove();

                        }, 2000);
                        $('.modal-backdrop').remove();
                        $('.modal-backdrop.in').remove();
                        $('body').removeClass('modal-open');
                    });

                });
            };

            $scope.TimeLine = function () { // tick
                if ($scope.incident != null) {
                    ModalService.showModal({
                        templateUrl: "views/crisis-manager/information-dashboard/timeline-template.html",
                        controller: "timeLineCtrl",
                        inputs: {
                            incident: $scope.incident
                        }
                    }).then(function (modal) {
                        modal.element.modal({ backdrop: 'static', keyboard: false });
                        modal.close.then(function () {
                            $('.modal-backdrop').remove();
                            $('body').removeClass('modal-open');
                        });
                    });
                }
                else {
                    toastr.error("Please select any incident to view Timeline");
                }
            };
            $scope.addActionList = function(){
                var data ={
                    name: 'Action List',
                    index: 0,
                    userAccountId: $scope.user.userAccountId,
                    incidentId: $scope.incident.id
                }
                $http.post('/settings/action-lists/save', { data: data }).then(function (res) {
					if($scope.layout.notification == true){
                    	toastr.success("Default Action List added");
					}
                    loadActionlist();
                });
            }
            $scope.enableEdit = function(item){
                item.edit = true;
                item._name = item.name;
            }
            $scope.disableEdit = function(item){
                item.edit = false;
                item.name = item._name;
            }

            $scope.AddAction =function(action){
                var data ={
                    name: action,
                    index: $scope.action_list.actions.length ,
                    actionListId: $scope.action_list.id,
                    userAccountId: $scope.user.userAccountId,
                }
                if(action == ""){
                    toastr.warning("please fill this field");
                }else{
                    ActionService.save(data).then(function(res){
						if($scope.layout.notification == true){
                        	toastr.success("Action added in Acion List");
						}
                        $scope.taskAction = '';
                        loadActionlist();
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/actions/save', { data: data }).then(function (res) {

                    // });
                }
            };
            $scope.ChangeUserForActionModal = function (item) {
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/information-dashboard/user-assign-to-action.html",
                    controller: "userAssignToActionModalCtrl",
                    inputs: {
                        item: item
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        if (result) {
                            // $scope.incident_plan = result;
                        }
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };
            $scope.changeColorForAction = function (item, list, color) { // tick
                var id = item.id;
                console.log(color);
                document.getElementById(id).style.backgroundColor = color;
                item.selectedColor = color;
                ActionService.update(item).then(function(res){
					if($scope.layout.notification == true){
                    	toastr.success("Color added in Acion");
					}
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/actions/update', { data: item }).then(function (res) {

                // });
            };
            $scope.updateAction =function(item,list){
                if(item.user)
                    item.userId = item.user.id;
                ActionService.update(item).then(function(res){
                    item.edit = false;
					if($scope.layout.notification == true){
                    	toastr.success("Action Updated.");
					}
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/actions/update', { data: item }).then(function (res) {

                // });
            };
            $scope.deleteAction = function (item, list,index) { // tick
                ActionService.delete(item.id).then(function(res){
                    list.actions.splice(index,1);
					if($scope.layout.notification == true){
                    	toastr.success("Action deleted successfully");
					}
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/actions/delete', { id: item.id }).then(function (res) {

                // });
            };
            $scope.resetActionList = function (actionListId) { // tick
                if($scope.action_list.actions.length == 0){
                    toastr.warning("You don't have any actions");
                }else{
                    ActionService.resetActionList(actionListId).then(function(res){
                        $scope.action_list.actions = [];
						if($scope.layout.notification == true){
                        	toastr.success("Action list reset");
						}
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.delete('/actions/reset-action-list/' + actionListId).then(function (res) {

                    // });
                }

            };


            $scope.openChecklistModal = function () { // tick
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/general/incidentCheckList.html",
                    controller: "incidentCheckListCtrl",
                    inputs: {
                        incident: $scope.incident,
                        checkList: $scope.checkedList
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        // $scope.loadCheckLists();
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };
            $scope.editClassSummary = function (clas) { // tick
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/information-dashboard/edit-summary.html",
                    controller: "editClassSummaryCtrl",
                    inputs: {
                        class: clas,
                        accountSettings: $scope.accountSettings
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                    	if(result && result.data){
                    		clas = result.data;
                    	}
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };

            $scope.openActionListModal = function () { // tick
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/information-dashboard/action-list-summary-report-modal.html",
                    controller: "summarReportActionListCtrl",
                    inputs: {
                        action_list: $scope.action_list,
                        incident: $scope.incident
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };

            $scope.designDashboard = function () { // tick
                console.log($scope.checkedList);
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/information-dashboard/design-dashboard.html",
                    controller: "designDashboardCtrl",
                    inputs: {
                        accountSettings: $scope.accountSettings
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        $scope.accountSettings = result;
                        if(Query.getCookie('notification_toggle') != undefined){
			                $scope.layout.notification = Query.getCookie('notification_toggle')
			            }else{
			                $scope.layout.notification = false;
			            }
                        if(result){
                            $scope.messagesStyle = {
                                'font-size': result.messages_font_size + 'px',
                                'font-family': result.messages_font_family
                            }
                        }
                    });
                });
            };

            /////////// End Modal Functions /////////////////////////////////////

            //////////// Drag Functionality ///////////////

            $scope.DragOptionsIncome = {
                accept: function (sourceItemHandleScope, destSortableScope) {

                    if(sourceItemHandleScope.itemScope.item['actionListId']){
                            return false;
                        }else{
                            return sourceItemHandleScope.$parent.sortableScope != destSortableScope;
                        }
                    },
                orderChanged: function (event) {
					//no re-ordering in incoming messges
                },
                itemMoved: function (event) {
					// event.dest.sortableScope.removeItem(event.dest.index);
					// event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
                    var message = event.source.itemScope.item;
                    message.index = event.dest.index;
                    var catID = event.dest.sortableScope.element[0].id;
					console.log('incom move',event.dest.sortableScope.element);
                    if (catID) {
						//income to cat
                        var category = filterFilter($scope.data.classes, {'id': catID})[0];
                        message.status = 'Copied';
                        MessageService.update(message).then(function(res){
                            var data = {
                                content: message.message,
                                status: true,
                                editorId: message.userId,
								classId: category.id,
                                index: message.index,
                                messageId: message.id,
                                incidentId: message.incidentId,
                                userId: message.userId
                            };
                            MessageHistoryService.incomeToHistory(data).then(function(res){
                                // loadIncomingMessages();
								console.log('-------',category.messages);
								var messagesArray = [];
								for(var i = 0;i < category.messages.length; i++){
									var obj = {
										id: category.messages[i].id,
										content: category.messages[i].message || category.messages[i].content,
										index: event.dest.index <= i?i+1:i
									}
									messagesArray.push(obj)
								}
								var finalMessagesArray = {
									classId : category.id,
									incidentId : $scope.incident.id,
									array: messagesArray
								}
								$scope.updateMessageIndex(finalMessagesArray);
								console.log("Income to history");
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/message-history/income-to-history', { data: data }).then(function (res) {

                            // });
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post("/messages/update", { data: message }).then(function (res) {

                        // });

                    } else {
                        event.source.itemScope.item.message = event.source.itemScope.item.content;
                        event.dest.sortableScope.insertItem(event.source.itemScope.item);
                    }
                },
                dragStart: function (event) { console.log('drag started')},
                dragEnd: function (event) { console.log('drag ended');}
            };
            $scope.DragOptionsClass = {
                accept: function (sourceItemHandleScope, destSortableScope) {
                        if(sourceItemHandleScope.itemScope.item['actionListId']){
                            return false;
                        }else{
                            return true;
                        }
                    },
                orderChanged: function (event) {
                    console.log('here');
					// event.dest.sortableScope.removeItem(event.dest.index);
					// event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
                    var message = event.source.itemScope.item;
                    message.index = event.dest.index;
                    var catID = event.dest.sortableScope.element[0].id
                    if (catID) {
                        var category = $scope.data.classes.find(function (cl) {
                            return cl.id == catID;
                        });
						var messagesArray = [];
						for(var i = 0;i < category.messages.length; i++){
							var obj = {
								id: category.messages[i].id,
								content: category.messages[i].message || category.messages[i].content,
								index: event.dest.index <= i?i+1:i
							}
							messagesArray.push(obj)
						}
						$scope.updateMessageIndex({array:messagesArray,incidentId : $scope.incident.id,classId:category.id});
                    }
                },
                itemMoved: function (event) {
					event.dest.sortableScope.removeItem(event.dest.index);
					// event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
                    var message = event.source.itemScope.item;
                    message.index = event.dest.index;
                    var catID = event.dest.sortableScope.element[0].id
					console.log("Dest",event.dest.sortableScope.element[0].id);
					console.log("Source",event.source.sortableScope.element[0].id);
					if (catID) {
						//from cat to cat
						var category = $scope.data.classes.find(function (cl) {
							return cl.id == catID;
						});
						message.classId = category.id;
						$scope.updateMessage(message, category);
						var messagesArray = [];
						for(var i = 0;i < category.messages.length; i++){
							var obj = {
								id: category.messages[i].id,
								content: category.messages[i].message || category.messages[i].content,
								index: event.dest.index <= i?i+1:i
							}
							messagesArray.push(obj)
						}
						$scope.updateMessageIndex({array:messagesArray,incidentId : $scope.incident.id,classId:catID});
					}else{
						//from cat to incom
						// event.dest.sortableScope.removeItem(event.dest.index);
						// event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
						event.source.itemScope.item.message = event.source.itemScope.item.content;
                        MessageHistoryService.delete(message.id,event.source.itemScope.item.classId).then(function(res){
                            var data ={
                                id: event.source.itemScope.item.messageId,
                                status: 'Incoming',
                                incidentId: event.source.itemScope.item.incidentId,
                                message: event.source.itemScope.item.message,
                                userId: event.source.itemScope.item.userId

                            }
                            if(data.id){
                                MessageService.update(data).then(function(res){
                                    // loadIncomingMessages();
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                // $http.post("/messages/update", { data: data }).then(function (res) {

                                // });
                            }else{
                                delete data.id;
                                MessageService.save(data).then(function(res){
                                    // loadIncomingMessages();
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                // $http.post("/messages/save", { data: data }).then(function (res) {

                                // });
                            }
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post('/message-history/remove', { id: message.id,clsId: event.source.itemScope.item.classId }).then(function (res) {
						//
                        // });
                    }
                },
                dragStart: function (event) { console.log('drag started') },
                dragEnd: function (event) { console.log('drag ended') }
            };

            $scope.DragOptionsCheckList = {
                accept: function (sourceItemHandleScope, destSortableScope) { return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id; },
                orderChanged: function (event) {
                },
                itemMoved: function (event) {
                    console.log('item moved');
                },
                dragStart: function (event) { console.log('drag started') },
                dragEnd: function (event) { console.log('drag ended') }
            };

            $scope.DragOptionsActionList = {
                accept: function (sourceItemHandleScope, destSortableScope) { return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id; },
                orderChanged: function (event) {
                    angular.forEach($scope.action_list.actions, function(obj, ind) {
                        obj.index = ind;
                        var data = { id: obj.id, index: ind };
                        ActionService.update(data).then(function(res){
                            if(ind == $scope.action_list.actions.length -1)
                            $scope.action_list.actions = Query.sort($scope.action_list.actions, 'index', false , false);
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post('/actions/update', { data: data }).then(function (res) {

                        // });
                    });
                },
                itemMoved: function (event) {
                },
                dragStart: function (event) { console.log('drag started')},
                dragEnd: function (event) { console.log('drag ended');}
            };
            //////////// End /////////////

            /////////// Main Functionality //////////////////////

            $scope.changeIncident = function (incident) {
                $scope.incident = incident;
                if ($scope.incident.id !== undefined) {
                    $scope.selectIncident = false;
                    delete incident.incident_plans;
                    Query.setCookie('incidentSelected', JSON.stringify($scope.incident));
                    if($routeParams.id){
                        $location.path('/dashboard');
                    }
                    $scope.loadCheckLists();
                    loadClasses();
                    loadActionlist();
                    loadIncomingMessages();
                    setSocketForIncidentProperties();
                    loadSliderTimeline();
                }
            };

            $scope.loadCheckLists = function(){
                IncidentCheckListService.allCopies($scope.incident.id).then(function(response){
                    $scope.clist = response.data;
                    var checkedList = []
                    angular.forEach($scope.clist, function(obj, key1) {
                        checkedList[key1] = angular.copy(obj.checkList);
                        checkedList[key1].createdAt = setDateFormat(checkedList[key1].createdAt);
                        checkedList[key1].tasks = [];
                        angular.forEach(obj.incident_checkList_copies, function(t, key2) {
                            if (t.task_list){
                                var task = t.task_list;
                                task.status = t.status;
                                checkedList[key1].tasks.push(task);
                            }
                        });
                        checkedList[key1].tasks = $filter('orderBy')(checkedList[key1].tasks, 'title');
                    });
                    checkedList = $filter('orderBy')(checkedList, 'name');
                    $scope.checkedList = checkedList;
                    $timeout(function() {
                        $scope.$apply();
                    });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = '/incident-check-list/all-copies?id=' + $scope.incident.id;
                // $http.get(path).then(function(response) {

                // });
            };
            function loadActionlist(){
                if($scope.incident){
                    var query = '/settings/action-lists/all/' + $scope.incident.id;
                    $http.get(query).then(function (response) {
                        $scope.action_lists = response.data;
                        if($scope.action_lists.length > 0){
                            $scope.action_list = $scope.action_lists[0];
                            $scope.action_list.actions = Query.sort($scope.action_list.actions, 'index', false , false);
                            angular.forEach($scope.action_list.actions, function(obj, key1) {
                                obj.edit = false;
                                if(obj.dueDate)
                                    obj.dueDate = new Date(obj.dueDate);
                            });
                        }
                    });
                }else{
                    toastr.warning("No Incident Selected");
                }
            }


            function loadClasses() {
                if($scope.incident){
                    ClassService.all($scope.incident.id).then(function(response){
                        $scope.data = response.data;
                        $scope.Class = response.data;
                        $scope.classes = _.object(_.map($scope.data.classes, function (item) {
                            item.show = true;
                            return [item.id, item]
                        }));
                        angular.forEach($scope.classes, function(c, index){
                            if(c.messages.length > 0){
                                c.messages = _.sortBy(c.messages, function (o) { return o.index });
                                angular.forEach(c.messages, function(m, index1){
                                    $scope.classes[index].messages[index1].showFilter = true;
                                });
                            }
                        });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // var path = '/class/all?incidentId=' + $scope.incident.id;
                    // $http.get(path).then(function (response) {

                    //     // $scope.backupClasses = angular.copy($scope.classes);
                    // });
                }else{
                    toastr.warning("No Incident Selected");
                }
            }

            function loadIncomingMessages() {
                if ($scope.incident !== undefined) {
                    MessageService.incoming($scope.incident.id).then(function(response){
                        $scope.messages = response.data;
                        $scope.sortByCreate = _.sortBy($scope.messages, function (o) { return new Date(o.createdAt); });
                        $scope.messages = $scope.sortByCreate.reverse();
                        console.log("Incoming messages =====>", $scope.messages);
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // var query = '/messages/incoming/' + $scope.incident.id;
                    // $http.get(query).then(function (response) {


                    // });
                }
            }

            function isDateInArray(needle, haystack) {
              for (var i = 0; i < haystack.length; i++) {
                console.log(needle.toDateString())
                if (needle.toDateString() === haystack[i].toDateString()) {
                  return true;
                }
              }
              return false;
            }
            function loadSliderTimeline(){
                MessageHistoryService.all($scope.incident.id).then(function(response){
                    $scope.msgHistory = response.data;

                    var dates = $scope.msgHistory.map(function(x) { return new Date(x.createdAt); })
                    dates = _.sortBy(dates, function (o) { return new Date(o); });

                    var uniqueDates = [];
                    for (var i = 0; i < dates.length; i++) {
                      if (!isDateInArray(dates[i], uniqueDates)) {
                        uniqueDates.push(dates[i]);
                      }
                    }
                    dates = uniqueDates;

                    var formatDates = [];
                    angular.forEach(dates, function(d){
                        formatDates = formatDates.concat($scope.convertDateIntoHours(d));
                    });

                    formatDates.unshift(new Date($scope.incident.createdAt));

                    $scope.slider = {
                        value: new Date($scope.incident.createdAt),
                        options: {
                            stepsArray: formatDates,
                            onChange: vm.filterMessages,
                            translate: function(date) {
                                if (date != null)
                                return new Date(date).format('')
                                return '';
                            }
                        }
                    };
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var query2 = '/message-history/all/' + $scope.incident.id;
                // $http.get(query2).then(function (response) {

                // });
            }

            function loadMessageHistory() {
                if ($scope.incident !== undefined) {
                    // var query2 = '/message-history/all/' + $scope.incident.id;
                    // $http.get(query2).then(function (response) {
                    //     $scope.msgHistory = response.data;
                    //     var dates = $scope.msgHistory.map(function(x) { return new Date(x.createdAt); })
                    //     var maxDate = Math.max.apply(null, dates);
                    //     var minDate = Math.min.apply(null, dates);
                    //     console.log( new Date(maxDate));
                    //     console.log(new Date(minDate));
                    //     console.log(dates);
                    //     $scope.slider = {
                    //         options: {
                    //             stepsArray: dates,
                    //              translate: function(date) {
                    //               if (date != null)
                    //                 return date.toDateString();
                    //               return '';
                    //             }
                    //         }
                    //     };
                    //     console.log("messages =====>", $scope.msgHistory);
                    // });
                }

            }

            //move from incoming to a Category
            function messageHistory(item, classId, subClassId) {
                var data = {};
                data.classId = classId;
                if (subClassId !== undefined) {
                    data.subClassId = subClassId;
                }
                data.userId = item.userId;
                data.owner = item.userId;
                data.incidentId = item.incidentId;
                data.messageId = item.id;
                data.status = true;
                data.content = item.message;
                data.modifiedAt = moment().utc().format();
                data.createdAt = item.createdAt;
                moveToMessageHistory(data);
            }

            function moveToMessageHistory(message) {
                MessageHistoryService.save(message).then(function(response){

                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/message-history/save', { data: message }).then(function (response) {
                // })
            }

            /////////// Static Functions //////////////////////////////////////

            $scope.convertDateIntoHours = function(date){
                date = date || new Date();
                var arr = [];
                date.setHours(0,0,0,0);
                for(var i=0;i<24;i++){
                    arr.push(angular.copy(date).toString());
                    date.setHours(date.getHours()+1)
                }
                return arr;
            }

            $scope.getClass = function(status){
                if(status == 'na'){
                    return "black_class";
                }else if(status == 'incomplete'){
                    return "red_class";
                }
                else if(status == 'in progress'){
                    return "yellow_class";
                }
                else if(status == 'completed'){
                    return "green_class";
                }
                else if(status == 'overdue'){
                    return "orange_class";
                }
            }

            $scope.statusOptions = [{ value: 'na', name: 'N/A' },
            { value: 'incomplete', name: 'No Information' },
            { value: 'in progress', name: 'In Progress' },
            { value: 'completed', name: 'Completed' },
            { value: 'overdue', name: 'Overdue' }];

            $scope.makeIncommingPayload =function(msg){ // tick
                var obj = {};
                obj.message = msg.content;
                obj.userId = msg.userId;
                obj.status = "Incoming";
                return obj;
            };

            // $rootScope.$on("updateClassData", function (event, data) { // tick
            //     // $scope.data.classes[data.index] = angular.copy(data)
            // });

            $scope.closeCategoryForm = function () { // tick
                $scope.layout.category = "";
                $('[data-toggle="dropdown"]').parent().removeClass('open');
            };

            LibraryService.userLib($scope.user.userAccountId).then(function(res){
                $scope.libReferences = res.data;
                $scope.lcms = filterFilter($scope.libReferences, {'title': 'LCMS'})[0];
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/libraries/user-lib?userAccountId=" + $scope.user.userAccountId).then(function (res) {

            // });

            $scope.getLcmsUrl = function(){
                if($scope.lcms){
                    return $location.protocol() + "://" + location.host + "/#/browser/"+$scope.lcms.id;
                }else{
                    return $location.protocol() + "://" + location.host + "/#/browser/d7f01451-45ed-4ed4-8372-77cc1d28b1c4";
                }
            }

            $scope.toggleMessage = function () { // tick
                $scope.layout.inbox = $scope.layout.inbox ? false : true;
                Query.setCookie('message_toggle', $scope.layout.inbox);
            };


            $scope.toggleTimeline = function () { // tick
                if($scope.incident){
                    $scope.showTimeline = $scope.showTimeline ? false : true;
                    loadClasses();
                }else{
                    toastr.warning("No Incident Selected");
                }
            };

            

            $scope.toggleMessageClass = function () {
                return $scope.layout.inbox ? 'col-lg-9' : 'col-lg-12 toggle-padding-information';
            };

            function setDateFormat(planDate) {
                return moment.utc(planDate).format('DD-MM-YYYY');
            }

            $scope.sendMessage = function (msg) { // tick
                var data = {};
                data.message = msg;
                data.incidentId = $scope.incident.id;
                postMessage(data);
            };

            $scope.ToIncommingMessage = function (msg) { // tick
                var data = {};
                data.message = msg;
                data.incidentId = $scope.incident.id;
                postMessage(data);
            };

            $scope.toggleCheckList = function () { // tick
                $scope.layout.list = ($scope.layout.list == 'Action') ? 'Nothing' : ($scope.layout.list == 'Check') ? 'Action' : 'Check';
                Query.setCookie('checklist_toggle', $scope.layout.list);

            };

            function AbindMessages() { // tick

                $scope.report = '<h3>Action Plan Report: ' + $filter('date')(new Date(), "HH:mm dd-MM-yyyy") + '</h3><br>';
                var initiatedActivities = filterFilter($scope.activities, {'activated': true});
                var pendingActivities = filterFilter($scope.activities, {'activated': false});
                initiatedActivities = $filter('orderBy')(initiatedActivities, 'index');

                pendingActivities = $filter('orderBy')(pendingActivities, 'index');

                if(initiatedActivities.length == 0 ){
                    // $scope.report += '<h3>No Initiated Activities</h3><br>';
                }else{
                    // $scope.report += '<h3>Initiated Activities</h3><br>';
                    angular.forEach(initiatedActivities, function(activity, index){
                        if (!activity.status_filter && !activity.availability_filter && !activity.group_filter){
                            var ind = index+1;
                            $scope.report = $scope.report +'<p>' +ind + ' - ' + activity.name+' '+activity.description+' '+$filter('date')(activity.createdAt, "HH:mm dd-MM-yyyy")+' '+$filter('date')(activity.activatedAt, "HH:mm dd-MM-yyyy")+'</p><p>Status :'+ activity.status +'</p><br>';
                        }
                    });
                }
                if(pendingActivities.length == 0 ){
                    // $scope.report += '<h3>No Pending Activities</h3><br>';
                }else{
                    // $scope.report += '<h3>Pending Activities</h3><br>';
                    angular.forEach(pendingActivities, function(activity, index){
                        if (!activity.status_filter && !activity.availability_filter && !activity.group_filter){
                            var ind = index+1;
                            $scope.report = $scope.report + '<p>' +ind + ' - ' + activity.name+' '+activity.description+'</p><p>Status :'+ activity.status +'</p><br>';
                        }
                    });
                }

                return $scope.report;
            };

            $scope.Printsummary = function (){ // tick
                var printContents = $scope.status_report;
                var popupWin = window.open('', '_blank', 'width=1000,height=800');
                popupWin.document.open();
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body style="font-family: Roboto, Helvetica, Arial, sans-serif;" onload="window.print()">' + printContents + '</body></html>');
                popupWin.document.close();
            }

            $scope.close = function () {
                loadClasses();
            };

            $scope.changeColor = function (item, c, color) { // tick
                var id = item.id;
                document.getElementById(id).style.backgroundColor = color;
                c.messages.map(function (msg) {
                    if (msg && msg.id == item.id) {
                        msg.selectedColor = color;
                        $scope.updateMessage(msg, c);
                    }
                });
            };

            $scope.hasIncidentCategory = function() { // tick
                if ($scope.incident && $scope.data && $scope.data.classes && $scope.data.classes.length === 0){
                    return false;
                }else{
                    return true;
                }
            };

            $scope.dateFormat = function (dat) {
                return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
            };

            $scope.timeFormat = function (dat) {
                return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
            };
            $scope.actionDueDateFormat = function (dat) {
                return moment(dat).utc().local().format('DD-MM-YYYY');
            };

            $scope.toggleInformationSize = function () {
                $scope.layout.zoomout = $scope.layout.zoomout ? false : true;
            };

            $scope.toggleZoomClass = function () {
                return $scope.layout.zoomout ? 'fa-search-plus' : 'fa-search-minus';
            };

            $scope.toggleInformationZoom = function () {
                return $scope.layout.zoomout ? 'col-zoom-out' : '';
            }
            if(Query.getCookie('message_toggle') != undefined){
                var mess_toggle = Query.getCookie('message_toggle')
            }else{
                var mess_toggle = true;
            }
            if(Query.getCookie('notification_toggle') != undefined){
                var notification_toggle = Query.getCookie('notification_toggle')
            }else{
                var notification_toggle = false;
            }
            if(Query.getCookie('checklist_toggle',false) != undefined){
                var chk_toggle = Query.getCookie('checklist_toggle',false)
            }else{
                var chk_toggle = 'Nothing';
            }
            $scope.layout = { // tick
                page: "flat",
                inbox: mess_toggle,
                zoomout: false,
                list: chk_toggle,
                notification : notification_toggle
            };

            /////////// End Static Functions //////////////////////////////////////


            /////////// Api Functions and Custom functions /////////////////////

            $scope.updateStatus =  function(list_id, task){ // tick
                var data = {};
                data.checkListId = list_id;
                data.taskId = task.id;
                data.taskStatus = task.status;
                data.incidentId = $scope.incident.id;
                IncidentCheckListService.updateTask(data).then(function(response){
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/incident-check-list/update-task', { data: data }).then(function (response) {

                // });
            };

            $scope.copyToSummary = function(cls, msg){ // tick
                cls.summary = cls.summary + " <br> " + msg.content;
                ClassService.update(cls).then(function(res){
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/class/update', { data: cls }).then(function (res) {

                // });
            }

            $scope.addCategory = function () { // tick
                var data = {
                    incidentId: $scope.incident.id,
                    title: $scope.layout.category,
                    summary: "Summary"
                };

                ClassService.save(data).then(function(res){
                    res.data.show = true;
                    $scope.closeCategoryForm();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/class/save', { data: data }).then(function (res) {

                // });
            };

            var postMessage = function (data) { // tick
                if (data.message != ''){
                    data.userId = $scope.user.id
                    MessageService.save(data).then(function(res){
                        $scope.msg = '';
                        // loadIncomingMessages();
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post("/messages/save", { data: data }).then(function (res) {

                    // });
                }
            };

            $scope.htmlToPlaintext = function(text) {
			  return text ? String(text).replace(/<[^>]+>/gm, '') : '';
			}
            $scope.toTrustedHTML = function( html ){
                return $sce.trustAsHtml( html );
            }
            $scope.summaryEditor = function(){ // tick
            	$scope.status_report = '';
                $scope.summaryEditorPage = true;
                $scope.summaryPage = false;
                ClassService.all($scope.incident.id).then(function(response){
                    $scope.classes = response.data;
                    CustomMessageService.getactivationMessage('Summary Report','Header').then(function(response){
                        $scope.report_header = response.data || {};
                        CustomMessageService.getactivationMessage('Summary Report','Footer').then(function(response){
                            $scope.report_footer = response.data || {};

                            if($scope.report_header.content && $scope.report_header.content !== 'undefined' && $scope.report_header.content !== null){
	                            $scope.status_report += $scope.report_header.content || '' + '<br>';
                            }
	                        $scope.status_report += '<h4>Incident: '  + $scope.incident.name + '</h4><h4>Report: ' + $filter('date')(new Date(), "HH:mm dd-MM-yyyy") + '</h4>';
	                        $scope.status_report += '<h4>From: '  + $scope.user.firstName + ' ' + $scope.user.lastName + '</h4><br>';

                            for (var i = 0; i < $scope.classes.classes.length; i++) {
                                $scope.status_report += '<h4>' + $scope.classes.classes[i].title + '</h4>' + $scope.classes.classes[i].summary + '';
                                if($scope.check.detail){
                                    if($scope.classes.classes[i].messages.length == 0 ){
                                        // $scope.status_report += '<h3>No Messages.</h3><br>';
                                    }else{
                                        $scope.status_report += '<h5>Messages:</h5>';
                                        angular.forEach($scope.classes.classes[i].messages, function(msg, index){
                                            $scope.status_report += '<p>'+$sce.trustAsHtml(msg.content)+'</p>';
                                        });
                                    }
                                    $scope.status_report += '<br>';
                                }
                                $scope.status_report += '<br>';
                            }
                            console.log($scope.status_report);
                            if($scope.check.actionPlan){
                                            // $scope.selectedPlan = plan;
                                if($scope.selectedPlan){
                                	if($scope.selectedPlan.action_plan && $scope.selectedPlan.action_plan.kind && $scope.selectedPlan.action_plan.kind == "agendaPoints"){
                                	console.log('------------------------',$scope.selectedPlan);
                                		$scope.status_report += agendaPointsHtml();
                                	}else{
                                    	$scope.status_report += AbindMessages();
                                	}
                                    // angular.forEach($scope.incident.incident_plans, function(plan, index){
                                    //     if (plan.selected == true){
                                    //     }
                                    // });
                                }else{
                                    $scope.status_report += '<br><br><h5>Action Plan Report</h5>';
                                    $scope.status_report += '<br>No Plan is Linked with this incident';
                                }
                            }
                            if($scope.report_footer.content && $scope.report_footer.content !== 'undefined' && $scope.report_footer.content !== null){
                            	$scope.status_report += '<br>' + $scope.report_footer.content || '';
                            }
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                });
                // var path = '/class/all?incidentId=' + $scope.incident.id;
                // //idhr iff lgana hay
                // $http.get(path).then(function (response) {

                // });


            };
            var agendaPointsHtml = function(){
            	var report = '<h3>Action Plan Report: ' + $filter('date')(new Date(), "HH:mm dd-MM-yyyy") + '</h3>';
                
                if($scope.check.agenda_detail){
            		report += '<h3> Agenda points: </h3>';
                	
                	angular.forEach($scope.selectedPlan.incident_agenda_points, function(point, index){
                		var aIndex = index+1;
            			report += '<h4>'+ aIndex +'-' + point.name + '</h4>';
                       	
                       	angular.forEach(point.incident_agenda_activities, function(activity, indx){
                            var ind = indx+1;
                            report += '<p>' +ind + ' - ' + activity.name+' '+((activity.description)?activity.description: '')+' '+$filter('date')(activity.createdAt, "HH:mm dd-MM-yyyy")+' '+ ((activity.activatedAt)?$filter('date')(activity.activatedAt, "HH:mm dd-MM-yyyy"): '')+'</p><p>Status :'+ ((activity.status)?activity.status: '') +'</p>';
                        }); 
                        report += '<br>'
                    });
                }else{
                	$scope.selectedPlan.incident_agenda_activities = $filter('orderBy')($scope.selectedPlan.incident_agenda_activities, 'index');
	                if($scope.selectedPlan.incident_agenda_activities.length == 0 ){
	                    // report += '<h3>No Initiated Activities</h3><br>';
	                }else{
	                    angular.forEach($scope.selectedPlan.incident_agenda_activities, function(activity, index){
                            var ind = index+1;
                            report += '<p>' +ind + ' - ' + activity.name+' '+((activity.description)?activity.description: '')+' '+$filter('date')(activity.createdAt, "HH:mm dd-MM-yyyy")+' '+ ((activity.activatedAt)?$filter('date')(activity.activatedAt, "HH:mm dd-MM-yyyy"): '')+'</p><p>Status :'+ ((activity.status)?activity.status: '') +'</p><br>';
	                    });
	                }
                }
                console.log(report);
                return report;
            }
            $scope.saveReport = function() { // tick
                var data = {};
                data.content = $scope.status_report;
                data.date = moment().utc().format();
                data.incidentName =  $scope.incident.name;
                data.incidentId =  $scope.incident.id;
                ReportService.save(data).then(function(response){
                    toastr.success("Report saved successfully.");
                    ModalService.showModal({
                        templateUrl: "views/crisis-manager/status-report/reports.email.html",
                        controller: "summaryReportsMailCtrl",
                        inputs: {
                            incident: $scope.incident,
                            report: $scope.status_report,
                            report_id: response.data.id
                        }
                    }).then(function (modal) {
                        modal.element.modal({ backdrop: 'static', keyboard: false });
                        modal.close.then(function (result) {
                        	if(result && result.data){
                        		$('#summary_report_modal_closing').fadeOut();
                        	}
                            $('.modal-backdrop').remove();
                            $('body').removeClass('modal-open');
                        });
                    });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/reports/save', {data: data}).then(function(response) {

                // });
            }

            /////////// End /////////////////////

            /////////// Category Box Functionality //////////

            $scope.editItem = function (item, evt) { // tick
                item.edit = true;
                item._content = item.content;
            };

            $scope.hasIncidentCategory = function() {
                if ($scope.incident && $scope.data && $scope.data.classes && $scope.data.classes.length === 0){
                    return false;
                }else{
                    return true;
                }
            };

            $scope.cancelEditItem = function (item, evt) { // tick
                item.content = item._content;
                item.edit = false;
            };

            $scope.editClass = function (item, evt) { // tick
                item._title = item.title;
                item.edit = true;
            };

            $scope.cancelEditClass = function (item, evt) { // tick
                item.title = item._title;
                item.edit = false;
            };

            $scope.updateClass = function (cls) { // tick
                ClassService.update(cls).then(function(res){
                    cls.edit = false;
                    cls.ex = false;
                    // var updatedClass = res.config.data.data
                    // $scope.$emit('updateClassData', updatedClass);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/class/update', { data: cls }).then(function (res) {


                // });
            };

            $scope.setClassPosition = function (cls) { // tick
                ClassService.update(cls).then(function(res){
                    cls.edit = false;
                    cls.ex = false;
                    var updatedClass = res.config.data.data;
                    // loadClasses();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/class/update', { data: cls }).then(function (res) {


                // });
            };

            $scope.deleteMessage = function (item, cls) { // tick
                MessageHistoryService.delete(item.id,cls.id).then(function(res){
                    // var idx = cls.messages.indexOf(item);
                    // cls.messages.splice(idx, 1);
                    // cls.messages.find(function (msg) {
                    //     if (msg && msg.index >= item.index) {
                    //         msg.index = msg.index - 1;
                    //         $scope.updateMessage(msg, cls);
                    //     }
                    // });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/message-history/remove', { id: item.id, clsId: cls.id }).then(function (res) {

                // });
            };

            $scope.deleteCategory = function (cls, index) { // tick
                ClassService.delete(cls).then(function(res){
                    // $scope.data.classes.splice(index, 1);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/class/remove', { data: cls }).then(function (res) {

                // });
            };

            $scope.updateMessage = function (item, cls) { // tick
				item.classId = cls.id;
				// item.content = item._content;
                MessageHistoryService.update(item).then(function(res){
                    item.edit = false;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/message-history/update', { data: item }).then(function (res) {

                // });
            };
			$scope.updateMessageIndex = function (item) { // tick
				if(item.array.length > 0)
                MessageHistoryService.updateIndex(item).then(function(res){
					console.log(res);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/message-history/update', { data: item }).then(function (res) {

                // });
            };

            $scope.newMessage = function (cls) { // tick
                if (cls.input) {
                    var data = {
                        content: cls.input,
                        incidentId: cls.incidentId,
                        classId: cls.id,
                        index: 0,
                        // index: (cls.messages)?  cls.messages.length : 0,
                        createAt: moment().utc().format(),
                        status: true
                    };
                    MessageHistoryService.save(data).then(function(res){
                        cls.input = '';
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/message-history/save', { data: data }).then(function (res) {

                    // });
                }
            };
            /////////// End  //////////
            init();
        }
    }());
