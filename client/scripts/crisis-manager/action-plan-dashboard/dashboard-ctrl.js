(function () {
	'use strict';

	angular.module('app')
	.controller('apdV2Ctrl', ['$scope', '$routeParams', '$http', 'ModalService', 'filterFilter', '$timeout', '$filter','Query','IncidentTypeService','ActionPlanService','IncidentPlanService','IncidentActivityService','IncidentCheckListService','SectionService','IncidentService', 'ActionService', 'ColorPaletteService', '$q', 'TaskService', 'ActivityService', ctrlFunction]);
	function ctrlFunction($scope, $routeParams, $http, ModalService, filterFilter, $timeout, $filter,Query, IncidentTypeService, ActionPlanService, IncidentPlanService, IncidentActivityService, IncidentCheckListService, SectionService, IncidentService, ActionService, ColorPaletteService, $q, TaskService, ActivityService) {

		////// SOcket Work ///////
		var setSocketForActivity = function (id) {
			if(id){
				var planId = id
			}else {
				var planId = $scope.selectedIncidentPlan.id
			}
			$timeout(function () {
				console.log("Socket set for incident_plan_activity:",planId);
				SOCKET.on('incident_plan_activity:'+planId, function (response) {
					console.log("listening sockets....");
					var data = response.data;
					if(response.action == "new"){
						console.log("incident_plan_activity new",data);
					}else if(response.action == "delete"){
						console.log("incident_plan_activity delete",data);
						if (data && $scope.incident && data.incidentId === $scope.incident.id) {
							for (var i = 0; i < $scope.planActivities.incident_activities.length; i++) {
								if ($scope.planActivities.incident_activities[i].id === data.id) {
									console.log("matched ");
									$scope.planActivities.incident_activities.splice(i,1);
									break;
								}
							}
							for (var i = 0; i < $scope.planActivities.sections.length; i++) {
								if($scope.planActivities.sections.id === data.sectionId){
									for(var j = 0; j< $scope.planActivities.sections[i].incident_activities.length; j++){
										if ($scope.planActivities.sections[i].incident_activities[j].id === data.id) {
											console.log("matched ");
											$scope.planActivities.sections[i].incident_activities.splice(j,1);
											break;
										}
									}
									break;
								}
							}
						}
					}else if(response.action == "update"){
						console.log("incident_plan_activity update",data);
						if (data && $scope.incident && data.incident_id === $scope.incident.id) {
							for (var i = 0; i < $scope.planActivities.incident_activities.length; i++) {
								if ($scope.planActivities.incident_activities[i].id === data.id) {
									console.log("matched ");
									$scope.planActivities.incident_activities[i] = data;
								}
							}
							for (var i = 0; i < $scope.planActivities.sections.length; i++) {
								for(var j = 0; j< $scope.planActivities.sections[i].incident_activities.length; j++){
									if ($scope.planActivities.sections[i].incident_activities[j].id === data.id) {
										console.log("matched ");
										$scope.planActivities.sections[i].incident_activities[j] = data;
									}
								}
							}
						}
					}
					else {
						toastr.error("Something went wrong!");
						console.log("incoming_message --> does not match any action incident_plan_activity socket.",response);
					}
					sortList();
					sortTList();
					var index = $scope.incident.incident_plans.map(function(el) {
						return el.id;
					}).indexOf(planId);
					$scope.incident.incident_plans[index].incident_activities = $scope.planActivities.incident_activities;
					$scope.incident.incident_plans[index] = $scope.calculateStates($scope.incident.incident_plans[index]);
					$scope.$apply();
				});
			})
		}

		var setSocketIncidentPlan = function(){
			$timeout(function(){
				SOCKET.on('incident_check_list:'+$scope.incident.id, function (response) {
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
								toastr.success("checklist deleted.");
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
										toastr.success("Task status updated.");
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



				SOCKET.on('incident_plan:' + $scope.incident.id, function (response) {
					var data = response.data;
					if(response.action == "new"){
						IncidentPlanService.get(data.actionPlanId,$scope.incident.id).then(function(incidentPlanData){
							$scope.incident.incident_plans.push($scope.calculateStates(incidentPlanData.data));
							// $scope.selectedIncidentPlan = filterFilter($scope.incident.incident_plans, { 'selected': true })[0];
							if(incidentPlanData.data){
					        	$scope.checkActionType(incidentPlanData.data);
					        	// $scope.changePlan($scope.selectedIncidentPlan);
							}
					    },function(err){
					        if(err)
					            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
					        else
					            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
					    });

					}else if(response.action == "changePlan"){
						console.log("incident_plan changePlan",data);
					}else if(response.action == "update"){
						console.log("incident_plan update",data);
					    IncidentPlanService.get(data.actionPlanId,$scope.incident.id).then(function(incidentPlanData){
							$scope.incident.incident_plans.push($scope.calculateStates(incidentPlanData.data));
							$scope.selectedIncidentPlan = filterFilter($scope.incident.incident_plans, { 'selected': true })[0];
					       	$scope.getActivites(incidentPlanData.data);
					    },function(err){
					        if(err)
					            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
					        else
					            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
					    });
					}
					else {
						toastr.error("Something went wrong!");
						console.log("incident_plan --> does not match any action incident_plan socket.",response);
					}
					$scope.$apply();
				});
			});
		}

		var setSocketForUnlinkPlan = function(){
			$timeout(function(){
				console.log("listening sockets....incident_plan_unlink:"+$scope.incident.id);
				SOCKET.on('incident_plan_unlink:'+$scope.incident.id, function (response) {
					var data = response.data;
					if(response.action == "delete"){
					    angular.forEach($scope.incident.incident_plans, function(plan,index) {
							if (plan.id == response.data.planId){
								$scope.incident.incident_plans.splice(index,1);
								toastr.success("Action Plan Unlinked Successfully!");
								if($scope.incident.incident_plans.length > 0){
									$scope.checkActionType($scope.incident.incident_plans[0]);
								}else{
									delete $scope.selectedIncidentPlan;
								}
							}
						});
					}
					else {
						toastr.error("Something went wrong!");
						console.log("incident_plan --> does not match any action incident_plan socket.",response);
					}
					$scope.$apply();
				});
			});
		}

		// var setSocketForAgendaPoint = function(){
		// 	$timeout(function(){
		// 		console.log("listening sockets....incident_plan_unlink:"+$scope.incident.id);
		// 		SOCKET.on('agenda_point:'+$scope.incident.id, function (response) {
		// 			var data = response.data;
		// 			if(response.action == "new"){
					    
		// 			}
		// 			else {
		// 				toastr.error("Something went wrong!");
		// 				console.log("incident_plan --> does not match any action incident_plan socket.",response);
		// 			}
		// 			$scope.$apply();
		// 		});
		// 	});
		// }

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
					$scope.loadCheckLists();
					$('.modal-backdrop').remove();
					$('body').removeClass('modal-open');
				});
			});
		};
		$scope.addIncidentAgendaPoint = function(category,ind){
            ModalService.showModal({
                templateUrl: "views/settings/incident-agenda-points/modal-form.html",
                controller: "incidentAgendaPointCreateCtrl",
                inputs : {
                	categoryId : category.id,
                    incident_plan_id: $scope.selectedIncidentPlan.id,
                    agenda_point: null,
                    activityType : 'incident-agenda',
                    action_plan_id: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                      	$scope.planWithAgendaPoint.categories[ind].data.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
		$scope.checklistDelete = function(list, event){ // tick
			var data = {};
			data.checkListId = list.id;
			data.incidentId = $scope.incident.id;
			if (confirm("Checklist will be removed, please confirm?")) {
				IncidentCheckListService.delete(data.checkListId,data.incidentId).then(function(response){
					toastr.success("checkList Deleted successfully");
					$scope.loadCheckLists();
				},function(err){
					if(err)
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
					else
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
				});

			}else{
				event.stopPropagation();
				event.preventDefault();
			}
		}

		///////////// Start Init ////////////////////////////

		function init() {

			ActionPlanService.all().then(function(response){
				$scope.actions = filterFilter(response.data, { 'active': true });
				$scope.actions = _.sortBy($scope.actions, function (o) { return o.name.toLowerCase(); });
			},function(err){
				if(err)
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
			$scope.list = Query.getCookie('checklist_toggle',false)
			$scope.viewType = 'Section1';
			$scope.viewTypeName = 'Task View';
			$scope.statusOptions = [
				{ value: 'na', name: 'N/A' },
				{ value: 'incomplete', name: 'NO INFORMATION' },
				{ value: 'in progress', name: 'IN PROGRESS' },
				{ value: 'completed', name: 'COMPLETED' },
				{ value: 'overdue', name: 'OVERDUE' }
			];
			$scope.user = Query.getCookie('user');
			IncidentTypeService.list().then(function(res){
				$scope.categories = res.data;
			},function(err){
				if(err)
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
			
			$scope.selected = [];
			$scope.showPlanDetails = false;
			$scope.levelFilter = '';

			$scope.filterAvailability = [
				{ value: 'all', name: 'All' },
				{ value: true, name: 'Initiated' },
				{ value: false, name: 'Pending' }
			];

			$scope.filterGroups = [
				{ value: 'all', name: 'All' },
				{ value: true, name: 'Default' },
				{ value: false, name: 'Other' }
			];

			IncidentService.all($scope.user.userAccountId).then(function(response){
				$scope.incidents = response.data;
				if ($scope.incidents.length > 0) {

					angular.forEach($scope.incidents, function(incident){
						angular.forEach(incident.incident_plans, function(incidentPlan){
							incidentPlan = $scope.calculateStates(incidentPlan);
						});
					});

					if ($routeParams.id) {
						$scope.incident = Query.filter($scope.incidents, { 'id': $routeParams.id },true);
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
						$scope.loadIncidentSetup();
					}
				}
			},function(err){
				if(err)
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
		};
		$scope.loadIncidentSetup = function(){
			loadActionlist();
			$scope.loadCheckLists();

			setSocketIncidentPlan();
			setSocketForUnlinkPlan();

			$scope.selectedIncidentPlan = filterFilter($scope.incident.incident_plans, { 'selected': true })[0];
			$scope.selectedAction = $scope.selectedIncidentPlan ? $scope.selectedIncidentPlan.action_plan : null;
			//we should save incident plan in cookie too
			if ($scope.selectedIncidentPlan) {
				$scope.checkActionType($scope.selectedIncidentPlan)
			}
		}
		init();
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
            }
        }
        $scope.loadCheckLists = function(){
        	if($scope.incident){
				IncidentCheckListService.allCopies($scope.incident.id).then(function(response){
					$scope.clist = response.data;
					$scope.checkedList = [];
					angular.forEach($scope.clist, function(obj, key1) {
						$scope.checkedList[key1] = angular.copy(obj.checkList);
						$scope.checkedList[key1].createdAt = setDateFormat($scope.checkedList[key1].createdAt);
						$scope.checkedList[key1].tasks = [];
						angular.forEach(obj.incident_checkList_copies, function(t, key2) {
							var task = t.task_list;
							task.status = t.status;
							$scope.checkedList[key1].tasks.push(task);
						});
						$scope.checkedList[key1].tasks = $filter('orderBy')($scope.checkedList[key1].tasks, 'title');
					});
					$scope.checkedList = $filter('orderBy')($scope.checkedList, 'name');
				},function(err){
					if(err)
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
					else
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
				});
			}
		};
		$scope.calculateStates = function(incidentPlan){
			incidentPlan.naCount = 0;
			incidentPlan.niCount = 0;
			incidentPlan.ipCount = 0;
			incidentPlan.cpCount = 0;
			incidentPlan.odCount = 0;
			if(incidentPlan.action_plan.kind == 'agendaPoints'){
				incidentPlan.records = incidentPlan.incident_agenda_activities;
			}else{
				incidentPlan.records = incidentPlan.incident_activities;
			}
			angular.forEach(incidentPlan.records, function(incidentActivity){
				switch(incidentActivity.status) {
					case 'incomplete':
					incidentPlan.niCount = incidentPlan.niCount + 1;
					break;
					case 'in progress':
					incidentPlan.ipCount = incidentPlan.ipCount + 1;
					break;
					case 'completed':
					incidentPlan.cpCount = incidentPlan.cpCount + 1;
					break;
					case 'na':
					incidentPlan.naCount = incidentPlan.naCount + 1;
					break;
					case 'overdue':
					incidentPlan.odCount = incidentPlan.odCount + 1;
					break;
				}
			})
			return incidentPlan;
		}

		$scope.checkActionType= function(selectedIncidentPlan){
			$scope.selectedIncidentPlan = selectedIncidentPlan;
			$scope.selectedAction = $scope.selectedIncidentPlan.action_plan;
			if($scope.selectedIncidentPlan && $scope.selectedIncidentPlan.action_plan && $scope.selectedIncidentPlan.action_plan.kind == 'activities'){
				$scope.getActivites($scope.selectedIncidentPlan);
			}else{
				$scope.getAgendaActivites($scope.selectedIncidentPlan);
			}
		}
		$scope.getActivites = function (planChecklist) {
			angular.forEach($scope.incident.incident_plans, function(incidentPlan){
				incidentPlan.selectedCard = false;
			});

			angular.forEach($scope.incident.checkLists, function(checkList){
				checkList.selectedCard = false;
			});
			planChecklist.selectedCard = true;

			$scope.currentType = type;
			var data = {};
			data.actionPlanId = planChecklist.actionPlanId;
			data.incidentId = $scope.incident.id;
			$scope.setTrueCard(data);
			setSocketForActivity(planChecklist.id)

			ActionPlanService.dashBoardSections(data).then(function(response){
				$scope.planActivities = response.data;
				if($scope.planActivities.sections){
					$scope.planActivities.sections = _.sortBy(response.data.sections, function (msg) { return msg.index });
				}
				if($scope.planActivities.incident_activities){
					$scope.planActivities.incident_activities = _.sortBy($scope.planActivities.incident_activities, function (act) { return act.index });
				}
				sortTList();
				sortList();
				$scope.pluckLevels();
				$("html, body").animate({ scrollTop: $('#planActivitiesPanel').offset().top }, 1000);
			},function(err){
				if(err)
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
		};

		$scope.addIncidentAgendaActivities = function(agendaPoint,catIndex,agendaPointIndex,event) {
			event.stopPropagation();
            event.preventDefault();
            ModalService.showModal({
                templateUrl: "views/settings/agenda-points/task-link-modal.html",
                controller: "taskListModalCtrl",
                inputs : {
                    agendapoint : agendaPoint,
                    actionPlanId : $scope.selectedAction.id,
                    selectedIncidentPlanId : $scope.selectedIncidentPlan.id,
                    incidentId : $scope.incident.id
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if (result){
	                    $scope.planWithAgendaPoint.categories[catIndex].data[agendaPointIndex].incident_agenda_activities = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.removeIncidentAgendaActivities = function(agendaPoint,catIndex,agendaPointIndex,event){
        	event.stopPropagation();
            event.preventDefault();
            if(confirm('Are you sure?')){
	         	angular.forEach(agendaPoint.incident_agenda_activities, function(activity){
		         	$http.delete("/incident-agenda-activities/delete/" + activity.id)
					.then(function (result) {});
				});
	            IncidentPlanService.deleteIncidentAgendaPoint(agendaPoint.id).then(function(response){
	            	$scope.planWithAgendaPoint.categories[catIndex].data.splice(agendaPointIndex,1);
	            	if($scope.planWithAgendaPoint.categories[catIndex].data.length == 0){
	            		$scope.planWithAgendaPoint.categories(catIndex,1)
	            	}
	        	},function(err){
	        		if(err)
	        			toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
	        		else
	        			toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
	        	});
            }
        }
      
		$scope.changeIncident = function (incident) {

			$scope.activities = $scope.selectedIncidentPlan = $scope.planActivities = null;
			$scope.incident = incident;
			Query.setCookie('incidentSelected', JSON.stringify($scope.incident));
			if ($scope.incident && $scope.incident.id !== undefined) {
				setSocketIncidentPlan();
				$scope.selectedIncidentPlan = filterFilter($scope.incident.incident_plans, { 'selected': true })[0];
				$scope.selectedAction = $scope.selectedIncidentPlan ? $scope.selectedIncidentPlan.action_plan : null;
				$scope.showPlanDetails = true;
				$scope.pluckLevels();

				if ($scope.selectedIncidentPlan) {
					IncidentPlanService.getActivities($scope.selectedIncidentPlan.id).then(function(response){
						$scope.planActivities = response.data.incident_activities;
						$scope.pluckLevels();
						$scope.loadCheckLists();
					},function(err){
						if(err)
						toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
						else
						toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
					});
				}
			}
		};

		$scope.updateStatus =  function(list_id, task){
			var data = {};
			data.checkListId = list_id;
			data.taskId = task.id;
			data.taskStatus = task.status;
			data.incidentId = $scope.incident.id;
			$http.post('/incident-check-list/update-task', { data: data }).then(function (response) {
				toastr.success("checkList Task Updated");
			});
		};

		$scope.getAgendaActivites = function (incidentPlan) {
			angular.forEach($scope.incident.incident_plans, function(incidentPlan){
				incidentPlan.selectedCard = false;
			});
			incidentPlan.selectedCard = true;
			var data = {};
			data.actionPlanId = incidentPlan.actionPlanId;
			data.incidentId = $scope.incident.id;
			$scope.setTrueCard(data);
			// setSocketForActivity(incidentPlan.id)
			var promises = [];
			ActionPlanService.planWithAgendaPoint(incidentPlan.id).then(function(response){
				$scope.planWithAgendaPoint = response.data;
				angular.forEach($scope.planWithAgendaPoint.incident_agenda_points , function(incidentAgendaPoint){
					promises.push(ActionPlanService.planWithAgendaActivities(incidentAgendaPoint.id));
				});
				$q.all(promises).then(function(response){
					var points = [];
					angular.forEach($scope.planWithAgendaPoint.incident_agenda_points , function(agendaPoint, index){
						if(response[index] && response[index].data){
							if(response[index].data.incident_agenda_activities){
								response[index].data.incident_agenda_activities = Query.filter(response[index].data.incident_agenda_activities,{'incident_plan_id': incidentPlan.id},false)
								response[index].data.incident_agenda_activities = _.sortBy(response[index].data.incident_agenda_activities, function (act) { return act.index });
								console.log()
							}
							points.push(response[index].data);
						}
					});
					var catgry = [];
					angular.forEach(points, function (fromAgenda,ind){
		                if (fromAgenda.all_category){
		                    putData(fromAgenda.all_category.name,catgry,fromAgenda,fromAgenda.all_category.id);
		                }else{
		                    putData('N/A',catgry,null,null);
		                }
	            	});
	            	$scope.planWithAgendaPoint.categories = catgry;
					$scope.selectedIncidentPlan = angular.copy($scope.planWithAgendaPoint);
					$scope.selectedAction = $scope.selectedIncidentPlan.action_plan;
				});
			},function(err){
				if(err)
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
		};
		var putData =  function(search,graph,inc,categoryId){
            var type = Query.filter(graph,{'name': search},true);
            if(type){
                type.data.push(inc);
            }else{
                graph.push({id:categoryId,name: search,data: []});
                var type = Query.filter(graph,{'name': search},true);
                type.data.push(inc);
            }
        }

		$scope.changePlan = function (action) {
			var planData = {
				actionPlanId: action.id,
				incidentId: $scope.incident.id,
				selected: true
			}
			if(action.kind == 'agendaPoints'){
				IncidentPlanService.saveAgendaActivities(planData).then(function(res){
					$scope.selectedIncidentPlan = res.data.incidentPlan;
					$scope.selectedAction = action;
				},function(err){
					if(err)
						toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
					else
						toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
				});
			}else{
				if (action && $scope.incident) {
					// if ($scope.selectedAction && $scope.selectedAction.id !== action.id) {
					// 	IncidentPlanService.checkCombinationPresence(planData).then(function(response){
					// 		if (response.data) {
					// 			IncidentPlanService.update(planData).then(function(response){
					// 				$scope.selectedAction = action;
					// 				$scope.selectedIncidentPlan = response.data;
					// 			},function(err){
					// 				if(err)
					// 				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
					// 				else
					// 				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
					// 			});
					// 			// $http.post("/incident-plan/update", planData)
					// 			// .then(function (response) {

					// 			// });
					// 		} else {
					// 			IncidentPlanService.save(planData).then(function(res){
					// 				$scope.selectedIncidentPlan = res.data.incidentPlan;
					// 				$scope.selectedAction = action;
					// 			},function(err){
					// 				if(err)
					// 				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
					// 				else
					// 				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
					// 			});
					// 			// $http.post("/incident-plan/save", planData)
					// 			// .then(function (res) {

					// 			// });
					// 		}
					// 	},function(err){
					// 		if(err)
					// 		toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
					// 		else
					// 		toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
					// 	});
					// 	// $http.post("/incident-plan/check-combination-presence", planData)
					// 	// .then(function (response) {

					// 	// });
					// } else {
						IncidentPlanService.save(planData).then(function(res){
							$scope.selectedIncidentPlan = res.data.incidentPlan;
							$scope.selectedAction = action;
							
						},function(err){
							if(err)
							toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
							else
							toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
						});
						// $http.post("/incident-plan/save", planData)
						// .then(function (res) {


						// });
					// }
				}
			}
		};

		/////////////////////// Initial functions /////////////////////////////

		

		var sortList = function () {
			angular.forEach($scope.planActivities.sections, function(section, index){
				$scope.planActivities.sections[index].incident_activities = _.sortBy($scope.planActivities.sections[index].incident_activities, function (activity) { return activity.tindex; });
			});
		};

		var sortTList = function () {
			$scope.planActivities.incident_activities = _.sortBy($scope.planActivities.incident_activities, function (activity) { return activity.index; });
		};


		//not use anywhere that's why we comment it
		// $scope.DragOptions = {
		//     accept: function (sourceItemHandleScope, destSortableScope) { return true; },
		//     orderChanged: function (event) {
		//         $scope.updateSectionIndex();
		//         // sortList();
		//     },
		//     itemMoved: function (event) {
		//         console.log('item moved');
		//     },
		//     dragStart: function (event) { console.log('drag started') },
		//     dragEnd: function (event) { console.log('drag ended') }
		// };

		// $scope.DragOptions1 = {
		// 	accept: function (sourceItemHandleScope, destSortableScope) { return true; },
		// 	orderChanged: function (event) {
		// 		console.log($scope.planActivities.incident_activities)
		// 		updateActivityIndex();
		// 		// sortTList();
		// 	},
		// 	itemMoved: function (event) {
		// 		console.log('item moved');
		// 	},
		// 	dragStart: function (event) { console.log('drag started') },
		// 	dragEnd: function (event) { console.log('drag ended') }
		// };

		//not use anywhere that's we comment it
		// $scope.updateSectionIndex = function(){
		//     angular.forEach($scope.planActivities.sections, function (section, index) {
		//         var data = {};
		//         data.index = index;
		//         data.id = section.id;
		//         // SectionService.createIndex(data).then(function(response){

		//         // },function(err){
		//         //     if(err)
		//         //         toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
		//         //     else
		//         //         toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
		//         // });
		//         $http.post("/sections/create-index", data).then(function (response) {
		//         });
		//     });

		// }

		// var updateActivityIndex = function () {
		// 	angular.forEach($scope.planActivities.incident_activities, function (activity, index) {
		// 		activity.index = index;
		// 		var data = { id: activity.id, index: activity.index };
		// 		IncidentPlanService.updateTIndex(data).then(function(response){

		// 		},function(err){
		// 			if(err)
		// 			toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
		// 			else
		// 			toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
		// 		});
		// 		// $http.post("/incident-plan/update-t-index", data).then(function (response) {
		// 		// });
		// 	});
		// }

		// $scope.checkLinkedPlan = function () {
		// 	if ($scope.selectedAction && $scope.selectedIncidentPlan && $scope.incident) {
		// 		return true;
		// 	} else {
		// 		return false;
		// 	}
		// };

		$scope.openActionPlanModal = function(){
			$scope.left = [];
			for(var i=0;i<$scope.actions.length;i++){
				var found = false;
				for(var j=0;j<$scope.incident.incident_plans.length;j++){
					if($scope.actions[i].id == $scope.incident.incident_plans[j].action_plan.id){
						found = true
					}
				}
				if(!found){
					$scope.left.push($scope.actions[i]);
				}
			}

			ModalService.showModal({
				templateUrl: "views/crisis-manager/action-plan-dashboard/assign-action-plan-modal.html",
				controller: "assignActionPlanModalCtrl",
				inputs: {
					actionPlans: $scope.left
				}
			}).then(function (modal) {
				modal.element.modal({ backdrop: 'static', keyboard: false });
				modal.close.then(function (result) {
					if(result !== undefined){
						$scope.changePlan(result);
					}
					$('.modal-backdrop').remove();
					$('body').removeClass('modal-open');
				});
			});
		}

		$scope.changeView = function(){
			if($scope.viewType == 'Section'){
				$scope.viewType = "Section1";
				$scope.viewTypeName = "Task View";
			}else{
				$scope.viewType = "Section";
				$scope.viewTypeName = "Section View";
			}
		}

		

		

		$scope.toggleCheckList = function () {
			$scope.list = ($scope.list == 'Check') ? 'Nothing' : 'Check';
			Query.setCookie('checklist_toggle', $scope.list);
		};
		$scope.enableEdit = function(item){
            item.edit = true;
            item._name = item.name;
        }

        $scope.disableEdit = function(item){
            item.edit = false;
            item.name = item._name;
        }

		$scope.updateAction =function(item,list){
            if(item.user)
                item.userId = item.user.id;
            ActionService.update(item).then(function(res){
                item.edit = false;
                toastr.success("Action Updated.");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            
        };

        $scope.addActionList = function(){
            var data ={
                name: 'Action List',
                index: 0,
                userAccountId: $scope.user.userAccountId,
                incidentId: $scope.incident.id
            }
            $http.post('/settings/action-lists/save', { data: data }).then(function (res) {
                toastr.success("Default Action List added");
                loadActionlist();
            });
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
                    toastr.success("Action added in Acion List");
                    $scope.taskAction = '';
                    loadActionlist();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            }
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

		$scope.resetActionList = function (actionListId) { // tick
            if($scope.action_list.actions.length == 0){
                toastr.warning("You don't have any actions");
            }else{
                ActionService.resetActionList(actionListId).then(function(res){
                    $scope.action_list.actions = [];
                    toastr.success("Action list reset");
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            }

        };

        $scope.deleteAction = function (item, list,index) { // tick
            ActionService.delete(item.id).then(function(res){
                list.actions.splice(index,1);
                toastr.success("Action deleted successfully");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
        };

        ColorPaletteService.list().then(function(res){
            $scope.colorPalettes = res.data;
        },function(err){
            if(err)
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            else
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
        });

        $scope.changeColorForAction = function (item, list, color) { // tick
            var id = item.id;
            document.getElementById(id).style.backgroundColor = color;
            item.selectedColor = color;
            ActionService.update(item).then(function(res){
                toastr.success("Color added in Acion");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
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
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
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
		$scope.toggleCheckList = function () { // tick
            $scope.list = ($scope.list == 'Action') ? 'Nothing' : ($scope.list == 'Check') ? 'Action' : 'Check';
            Query.setCookie('checklist_toggle', $scope.list);

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

		$scope.userStatusImg = function (actor) {
			return (actor && actor.available) ? '../images/user-available.png' : '../images/user-unavailable.png';
		}

		$scope.displayActorName = function (actor) {
			return actor ? (actor.firstName + ' ' + actor.lastName) : 'N/A';
		};

		$scope.selectedActivity = function () {
			var notSelected = true;
			angular.forEach($scope.activities, function (activity) {
				if (activity.isSelected && activity.isSelected === true) {
					notSelected = false;
				}
			});
			return notSelected;
		};

		$scope.markActive = function () {
			var body = { ids: $scope.selected };
			IncidentActivityService.setActive(body).then(function(response){
				angular.forEach($scope.selected, function (activityId) {
					var filteredActivity = filterFilter($scope.activities, { 'id': activityId })[0];
					filteredActivity.activated = true;
					var time = new Date();
					filteredActivity.activatedAt = time;
				});
				toastr.success('Grouping Updated.', 'Success!');
			},function(err){
				if(err)
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
			// $http.post("/incident-activities/set-active", body).then(function (response) {

			// });
		};

		$scope.updateAgendaActivityActivation = function (activity) {
			var time = new Date();
			activity.activatedAt = time;
			activity.activated = !activity.activation;
			setTimeout(function () {
				var data = { activity: activity };
				$http.post("/incident-agenda-activities/update", data)
				.then(function (response) {
					toastr.success('Activation status updated.', 'Success!');
				});
			}, 500);
		};

		$scope.updateActivityActivation = function (activity) {
			var time = new Date();
			activity.activatedAt = time;
			activity.activated = !activity.activation;
			setTimeout(function () {
				var data = { activity: activity };
				IncidentActivityService.update(data).then(function(response){
					toastr.success('Activation status updated.', 'Success!');
				},function(err){
					if(err)
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
					else
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
				});
				// $http.post("/incident-activities/update", data)
				// .then(function (response) {

				// });
			}, 500);
		};

		$scope.showUserModal = function (activity) {
			ModalService.showModal({
				templateUrl: "views/actionPlanDashboard/user-info-modal.html",
				controller: "userInfoModalCtrl",
				inputs: {
					activity: activity
				}
			}).then(function (modal) {
				modal.element.modal({ backdrop: 'static', keyboard: false });
				modal.close.then(function (result) {
					if (result) {
						$scope.incident_plan = result;
					}
					$('.modal-backdrop').remove();
					$('body').removeClass('modal-open');
				});
			});
		};

		$scope.showAgendaUserModal = function (activity) {
			ModalService.showModal({
				templateUrl: "views/actionPlanDashboard/user-agenda-info-modal.html",
				controller: "userAgendaInfoModalCtrl",
				inputs: {
					activity: activity,
					activityType : 'incident-agenda'
				}
			}).then(function (modal) {
				modal.element.modal({ backdrop: 'static', keyboard: false });
				modal.close.then(function (result) {
					if (result) {
						$scope.incident_plan = result;
					}
					$('.modal-backdrop').remove();
					$('body').removeClass('modal-open');
				});
			});
		};

		$scope.taskInfo = function (activity) {
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

		$scope.satusClass = function (status) {
			switch (status) {
				case 'incomplete':
				return 'red-text';
				case 'in progress':
				return 'yellow-text';
				case 'completed':
				return 'green-text';
				case 'na':
				return 'black-text';
				case 'overdue':
				return 'orange-text'
				default:
			}
		};

		$scope.getStatusName = function (status) {
			return filterFilter($scope.statusOptions, { 'value': status })[0].name;
		}

		$scope.updateActivityStatus = function (activity) {

			ModalService.showModal({
				templateUrl: "views/actionPlanDashboard/select-activity-status.html",
				controller: "selectActivityStatusCtrl",
				inputs: {
					initialStatus: activity.status
				}
			}).then(function (modal) {
				modal.element.modal({ backdrop: 'static', keyboard: false });
				modal.close.then(function (result) {

					$('.modal-backdrop').remove();
					$('body').removeClass('modal-open');

					if (result) {
						activity.status = result;
						var time = new Date();
						activity.statusAt = time;
						var data = { activity: activity };

						IncidentActivityService.update(data).then(function(response){
							toastr.success('Status updated.', 'Success!');
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

		$scope.updateAgendaActivityStatus = function (activity) {

			ModalService.showModal({
				templateUrl: "views/actionPlanDashboard/select-activity-status.html",
				controller: "selectActivityStatusCtrl",
				inputs: {
					initialStatus: activity.status
				}
			}).then(function (modal) {
				modal.element.modal({ backdrop: 'static', keyboard: false });
				modal.close.then(function (result) {

					$('.modal-backdrop').remove();
					$('body').removeClass('modal-open');

					if (result) {
						activity.status = result;
						var time = new Date();
						activity.statusAt = time;
						var data = { activity: activity };

						$http.post("/incident-agenda-activities/update", data)
						.then(function (response) {
							toastr.success('Status updated.', 'Success!');
						});
					}
				});
			});
		};
		$scope.actionDueDateFormat = function (dat) {
            return moment(dat).utc().local().format('DD-MM-YYYY');
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
            	var act_list = event.source.itemScope.item;
                var index = event.dest.index;
                var sectionId = event.dest.sortableScope.element[0].id;
                var found = false;
                //copy tasks
                event.dest.sortableScope.removeItem(event.dest.index);
                event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
                angular.forEach(event.dest.sortableScope.modelValue, function(obj, ind) {
                    if(obj.name == act_list.name){
                        found = true; 
                    }
                });
                if(!found){
                	var taskToGo = {name: act_list.name};
                	taskToGo.userAccountId =  $scope.user.userAccountId;
                	TaskService.save(taskToGo).then(function(response){
                		var activityToGo = {type : 'action',responseActorId: act_list.userId};
                        activityToGo.userAccountId =  $scope.user.userAccountId;
                        activityToGo.response_time = 0;
                        activityToGo.completion_time = 0;
                        activityToGo.taskListId = response.data.id;
                        ActivityService.create({activity: activityToGo,outcomes: []}).then(function(resp){
			                var data = {
			                	type: 'action',
			                    actionPlanId : $scope.selectedAction.id,
			                    incident_plan_id : $scope.selectedIncidentPlan.id,
			                    incidentId : $scope.incident.id,
			                    incidentAgendaPointId : sectionId,
			                    name : act_list.name,
			                    taskListId: response.data.id,
			                    responseActorId: act_list.userId,
			                    activityId: resp.data.id
		                	}
			                $http.post('/incident-agenda-activities/save', { data: data }).then(function (res) {
			                	toastr.success('Action assigned.');
			                	event.dest.sortableScope.modelValue.splice( event.dest.index, 0, res.data );
			                });
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
                }
            },
            dragStart: function (event) { console.log('drag started')},
            dragEnd: function (event) { console.log('drag ended');}
        };

		$scope.displayActivity = function (activity) {
			if (!activity.status_filter && !activity.availability_filter && !activity.group_filter && !activity.level_filter) {
				return true;
			} else {
				return false;
			}
		};

		$scope.displayActivityProperty = function (property) {
			return property ? property.name : 'N/A'
		};

		$scope.applyStatusFilter = function (status) {
			if (status.length === 0) {
				angular.forEach($scope.planActivities.incident_activities, function (activity) {
					activity.status_filter = false;
				});
			} else {
				angular.forEach($scope.planActivities.incident_activities, function (activity) {
					var matched = true;
					angular.forEach(status, function (status) {
						if (status === activity.status) {
							matched = false;
						}
						activity.status_filter = matched;
					});
				});
			}
		};

		$scope.applyAvailabilityFilter = function (filter) {
			if (filter !== 'all') {
				angular.forEach($scope.planActivities.incident_activities, function (activity) {
					activity.availability_filter = activity.activated === filter ? false : true;
				});
			} else {
				angular.forEach($scope.planActivities.incident_activities, function (activity) {
					activity.availability_filter = false;
				});
			}
		};

		$scope.applyLevelFilter = function (level) {
			if (level !== 'all') {
				angular.forEach($scope.planActivities.incident_activities, function (activity) {
					activity.level_filter = activity.responsibility_level === level ? false : true;
				});
			} else {
				angular.forEach($scope.planActivities.incident_activities, function (activity) {
					activity.level_filter = false;
				});
			}
		};

		$scope.statusReport = function () {
			if ($scope.incident) {
				ModalService.showModal({
					templateUrl: "views/actionPlanDashboard/status-report.html",
					controller: "actionPlanStatusReportCtrl",
					inputs: {
						activities: $scope.planActivities.incident_activities,
						incident: $scope.incident
					}
				}).then(function (modal) {
					modal.element.modal({ backdrop: 'static', keyboard: false });
					modal.close.then(function () {
						$('.modal-backdrop').remove();
						$('body').removeClass('modal-open');
					});
				});
			} else {
				toastr.error('An incident with action plan must be selected.', 'Error');
			}
		};

		$scope.editActivity = function (activity, index) {
			ModalService.showModal({
				templateUrl: "views/actionPlanDashboard/edit-incident-activity-modal.html",
				controller: "editIncidentActivityModalCtrl",
				inputs: {
					activityId: activity.id
				}
			}).then(function (modal) {
				modal.element.modal({ backdrop: 'static', keyboard: false });
				modal.close.then(function (response) {
					console.log('response is', response)
					$('.modal-backdrop').remove();
					$('body').removeClass('modal-open');
					if (response && response !== '') {
						angular.forEach($scope.planActivities.incident_activities, function (activity){
							if (activity.id == response.id){
								$scope.planActivities.incident_activities[index] = response
							}
						});
						angular.forEach($scope.planActivities.sections, function (section){
							angular.forEach(section.incident_activities, function (activity){

								if (activity.id == response.id){
									section.incident_activities[index] = response
								}
							});
						});
					}
				});
			});
		};

		$scope.editAgendaActivity = function (activity, cat_index,agenda_index,act_index) {
			ModalService.showModal({
				templateUrl: "views/actionPlanDashboard/edit-incident-agenda-activity-modal.html",
				controller: "editIncidentAgendaActivityModalCtrl",
				inputs: {
					activityId: activity.id,
					activityType : 'incident-agenda'
				}
			}).then(function (modal) {
				modal.element.modal({ backdrop: 'static', keyboard: false });
				modal.close.then(function (response) {
					$('.modal-backdrop').remove();
					$('body').removeClass('modal-open');
					if (response && response !== '') {
						$scope.planWithAgendaPoint.categories[cat_index].data[agenda_index].incident_agenda_activities[act_index] = response;
					}
				});
			});
		};

		$scope.avilableActionPlans = function () {
			ModalService.showModal({
				templateUrl: "views/settings/action-plans/view.html",
				controller: "viewActionPlanModalCtrl",
				inputs: {
					planId: null
				}
			}).then(function (modal) {
				modal.element.modal({ backdrop: 'static', keyboard: false });
				modal.close.then(function (response) {
					$('.modal-backdrop').remove();
					$('body').removeClass('modal-open');
				});
			});
		};

		$scope.deleteActivity = function (select,index) {
			IncidentActivityService.delete(select.id).then(function(result){
				if (result.data) {
					toastr.success('Task removed', 'Success!');
					angular.forEach($scope.planActivities.incident_activities, function (activity,ind){
						if (activity.id == select.id){
							$scope.planActivities.incident_activities.splice(ind,1);
						}
					});
					angular.forEach($scope.planActivities.sections, function (section){
						angular.forEach(section.incident_activities, function (activity,indx){
							if (activity.id == select.id){
								section.incident_activities.splice(indx,1);
							}
						});
					});
				} else {
					toastr.error('Error removing task', 'Error!');
				}
			},function(err){
				if(err)
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
			// $http.delete("/incident-activities/delete/" + select.id)
			// .then(function (result) {

			// })
		};

		$scope.deleteAgendaActivity = function (select,cat_index,agenda_index,act_index) {
			$http.delete("/incident-agenda-activities/delete/" + select.id)
			.then(function (result) {
				if (result.data) {
					toastr.success('Task removed', 'Success!');
					$scope.planWithAgendaPoint.categories[cat_index].data[agenda_index].incident_agenda_activities.splice(act_index,1);
				} else {
					toastr.error('Error removing task', 'Error!');
				}
			});
		};

		$scope.unlinkPlan = function (plan,index) {
			IncidentPlanService.delete(plan.id).then(function(result){
				// toastr.success('Action Plan unlinked', 'Success!');
			},function(err){
				if(err)
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
			// $http.delete("/incident-plan/delete/" + plan.id)
			// .then(function (result) {

			// }, function (error) {
			//     toastr.error(error, 'Error!');
			// })
		};
		$scope.togglePlanList = function(){
			$scope.showPlanDetails = !$scope.showPlanDetails;
		};
		$scope.pluckLevels = function () {
			$scope.responsibilityLevels = [];
			if($scope.planActivities && $scope.planActivities.incident_activities){
				$scope.responsibilityLevels = $scope.planActivities.incident_activities.map(function (a) {
					if (a && a.responsibility_level && a.responsibility_level !== '') {
						return a.responsibility_level;
					}
				});
				$scope.responsibilityLevels = $scope.responsibilityLevels.filter(function (v, i) {
					if (v) {
						return $scope.responsibilityLevels.indexOf(v) == i;
					}
				});
				angular.forEach($scope.responsibilityLevels, function (level, index) {
					$scope.responsibilityLevels[index] = { name: level, value: level }
				});
				$scope.responsibilityLevels.unshift({ name: 'All', value: 'all' })
			}
		};

		

		$scope.setTrueCard = function(data){
			IncidentPlanService.update(data).then(function(response){
			},function(err){
				if(err)
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
				toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
		}

		$scope.activitiesSectionClass = function(){
			return $scope.list == 'Check' || $scope.list == 'Action' ? 'col-md-9' : 'col-md-12';
		};
		$scope.setDateFormat =function(planDate) {
			return planDate ? moment.utc(planDate).format('DD-MM-YYYY') : 'N/A';
		}
		function setDateFormat(planDate) {
			return moment.utc(planDate).format('DD-MM-YYYY');
		}
	}
}());
