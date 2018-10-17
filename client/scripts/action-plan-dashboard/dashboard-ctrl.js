(function () {
    'use strict';

    angular.module('app')
    .controller('actionPlanDashboardCtrl', ['$scope',
    '$rootScope',
    '$routeParams',
    '$http',
    'AuthService',
    'ModalService',
    'filterFilter',
    '$timeout',
    '$filter',
    'Query',
    'IncidentTypeService',
    'ActionPlanService',
    'IncidentPlanService',
    'IncidentActivityService',
    'IncidentService',
    ctrlFunction]);

    function ctrlFunction($scope, $rootScope, $routeParams, $http, AuthService, ModalService, filterFilter, $timeout, $filter, Query, IncidentTypeService, ActionPlanService, IncidentPlanService, IncidentActivityService, IncidentService) {
        $scope.setDateFormat =function(planDate) {
            return planDate ? moment.utc(planDate).format('DD-MM-YYYY') : 'N/A';
        }

        var checkSelectedOutcomes = function () {
            IncidentPlanService.getSelectedOutcomes($scope.selectedAction.id,$scope.incident.id).then(function(response){
                $scope.selectedOutcomes = response.data.activities;
                $scope.selectedOutcomes = $filter('orderBy')($scope.selectedOutcomes, 'id');

                if ($scope.selectedOutcomes.length > 0) {
                    angular.forEach($scope.selectedOutcomes, function (selectedOutcome, key) {
                        var decision = filterFilter($scope.incident_plan.activity_status, { 'selected_outcome': selectedOutcome.id, 'type': 'decision' })[0];
                        angular.forEach(decision.outcomes, function (outcome) {
                            if (outcome.activityId === selectedOutcome.id) {
                                selectedOutcome.status = outcome.task_status;
                            }
                        });
                    });
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/incident-plan/get-selected-outcomes?actionPlanId=" + $scope.selectedAction.id + "&incidentId=" + $scope.incident.id)
            // .then(function (response) {

            // });
        };

        var setSocketForActivity = function () {
            $timeout(function () {
                // socket.subscribe($scope, 'incident_activity_update:' + $scope.selectedIncidentPlan.id, function (evt, reply) {
                //     var activity = reply.activity;
				//
                //     if (activity && $scope.incident && $scope.selectedAction && $scope.selectedIncidentPlan && $scope.activities && $scope.activities.length > 0 && activity.incident_id === $scope.incident.id) {
                //         for (var i = 0; i < $scope.activities.length; i++) {
                //             if ($scope.activities[i].id === activity.id) {
                //                 console.log("Socket Activity Update: ", reply);
                //                 $scope.activities[i] = activity;
                //             }
                //         }
                //         $scope.$apply();
                //     }
                // });
            })
        }

        var setSocketForActor = function () {
            $timeout(function () {
                // socket.subscribe($scope, 'user_update', function (evt, reply) {
                //     if ($scope.incident && $scope.selectedAction && $scope.selectedIncidentPlan && $scope.activities && $scope.activities.length > 0) {
                //         for (var i = 0; i < $scope.activities.length; i++) {
                //             if ($scope.activities[i] && $scope.activities[i].response_actor && reply.user && $scope.activities[i].response_actor.id === reply.user.id) {
                //                 console.log("Socket Actor Update", reply);
                //                 $scope.activities[i].response_actor.available = reply.user.available;
                //             }
                //         }
                //         $scope.$apply();
                //     }
                // });
            })
        }

        function init() {
            ActionPlanService.all().then(function(response){
                $scope.actions = filterFilter(response.data, { 'active': true });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/action-plans/all').then(function (response) {

            // });

            $scope.selected = [];
            $scope.showPlanDetails = false;
            $scope.showSelectedOutcomes = false;
            $scope.statusOptions = [{ value: 'na', name: 'N/A' },
            { value: 'incomplete', name: 'NO INFORMATION' },
            { value: 'in progress', name: 'IN PROGRESS' },
            { value: 'completed', name: 'COMPLETED' },
            { value: 'overdue', name: 'Overdue' }];

            $scope.filterAvailability = [{ value: 'all', name: 'All' },
            { value: true, name: 'Initiated' },
            { value: false, name: 'Pending' }];

            $scope.filterGroups = [{ value: 'all', name: 'All' },
            { value: true, name: 'Default' },
            { value: false, name: 'Other' }];

            $scope.user = Query.getCookie('user');
            IncidentTypeService.list().then(function(res){
                $scope.categories = res.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/incident-types/list").then(function (res) {

            // });

            IncidentService.all($scope.user.userAccountId).then(function(response){
                setSocketForActor();
                $scope.incidents = response.data;
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
                        $scope.selectedIncidentPlan = filterFilter($scope.incident.incident_plans, { 'selected': true })[0];
                        $scope.selectedAction = $scope.selectedIncidentPlan ? $scope.selectedIncidentPlan.action_plan : null;
                        if ($scope.selectedAction) {
                            $scope.selectedAction.plandate = $scope.selectedAction.plandate ? $scope.setDateFormat($scope.selectedAction.plandate) : false;
                        }

                        if ($scope.selectedIncidentPlan) {
                            setSocketForActivity();
                            IncidentPlanService.getActivities($scope.selectedIncidentPlan.id).then(function(response){
                                $scope.activities = response.data.incident_activities;
                                $scope.activities = $filter('orderBy')($scope.activities, 'id');
                                $scope.safeActivities = $scope.activities;
                                $scope.pluckLevels();
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
        };

        init();

        $scope.checkLinkedPlan = function () {
            if ($scope.selectedAction && $scope.selectedIncidentPlan && $scope.incident) {
                return true;
            } else {
                return false;
            }
        };

        $scope.checkActivities = function () {
            if ($scope.activities && $scope.activities.length > 0) {
                return true;
            } else {
                return false;
            }
        };

        $scope.changeIncident = function (incident) {
            $scope.activities = $scope.selectedAction = $scope.selectedIncidentPlan = null;
            $scope.incident = incident;
            if ($scope.incident && $scope.incident.id !== undefined) {
                $scope.selectedIncidentPlan = filterFilter($scope.incident.incident_plans, { 'selected': true })[0];
                $scope.selectedAction = $scope.selectedIncidentPlan ? $scope.selectedIncidentPlan.action_plan : null;
                if ($scope.selectedAction) {
                    $scope.selectedAction.plandate = $scope.selectedAction.plandate ? $scope.setDateFormat($scope.selectedAction.plandate) : false;
                }

                if ($scope.selectedIncidentPlan) {
                    setSocketForActivity();
                    IncidentPlanService.getActivities($scope.selectedIncidentPlan.id).then(function(response){
                        $scope.activities = response.data.incident_activities;
                        $scope.activities = $filter('orderBy')($scope.activities, 'id');

                        $scope.safeActivities = $scope.activities;
                        $scope.pluckLevels();
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
        };

        var promptWarning = function () {
            if (confirm("Warning! Chaning Action Plan will result in loosing the current progress of Action Plan with the incident.")) {
                return true;
            } else {
                return false;
            }
        }

        $scope.changePlan = function (action) {

            if (action && $scope.incident) {
                var planData = {
                    actionPlanId: action.id,
                    incidentId: $scope.incident.id
                }

                if ($scope.selectedAction && $scope.selectedAction.id !== action.id) {
                    if (promptWarning()) {
                        IncidentPlanService.checkCombinationPresence(planData).then(function(response){
                            if (response.data) {
                                IncidentPlanService.update(planData).then(function(response){
                                    $scope.selectedAction = action;
                                    $scope.selectedIncidentPlan = response.data;
                                    IncidentPlanService.getActivities($scope.selectedIncidentPlan.id).then(function(response){
                                        $scope.activities = response.data.incident_activities;
                                        $scope.activities = $filter('orderBy')($scope.activities, 'id');
                                        $scope.safeActivities = $scope.activities;
                                        $scope.pluckLevels();
                                        toastr.success('Plan changed for selected incident.', 'Success!');
                                    },function(err){
                                        if(err)
                                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                        else
                                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                    });
                                    // $http.get("/incident-plan/get-activities?id=" + $scope.selectedIncidentPlan.id)
                                    // .then(function (response) {

                                    // });
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                // $http.post("/incident-plan/update", planData)
                                // .then(function (response) {

                                // });
                            } else {
                                IncidentPlanService.save(planData).then(function(res){
                                    $scope.selectedIncidentPlan = res.data.incidentPlan;
                                    if (res.data.outcomes.length > 0) {
                                        IncidentPlanService.addOutcomes(res.data.outcomes).then(function(response){
                                            $scope.selectedAction = action;
                                            IncidentPlanService.getActivities($scope.selectedIncidentPlan.id).then(function(response){
                                                $scope.activities = response.data.incident_activities;
                                                $scope.activities = $filter('orderBy')($scope.activities, 'id');
                                                $scope.safeActivities = $scope.activities;
                                                $scope.pluckLevels();
                                                toastr.success('Plan changed for selected incident.', 'Success!');
                                            },function(err){
                                                if(err)
                                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                                else
                                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                            });
                                            // $http.get("/incident-plan/get-activities?id=" + $scope.selectedIncidentPlan.id)
                                            // .then(function (response) {

                                            // });
                                        },function(err){
                                            if(err)
                                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                            else
                                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                        });
                                        // $http.post("/incident-plan/add-outcomes", res.data.outcomes)
                                        // .then(function (response) {

                                        // })
                                    } else {
                                        $scope.selectedAction = action;
                                        IncidentPlanService.getActivities($scope.selectedIncidentPlan.id).then(function(response){
                                            $scope.activities = response.data.incident_activities;
                                            $scope.activities = $filter('orderBy')($scope.activities, 'id');
                                            $scope.safeActivities = $scope.activities;
                                            $scope.pluckLevels();
                                            toastr.success('Plan changed for selected incident.', 'Success!');
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
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                // $http.post("/incident-plan/save", planData)
                                // .then(function (res) {

                                // });
                            }
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post("/incident-plan/check-combination-presence", planData)
                        // .then(function (response) {

                        // });
                    }
                } else {
                    IncidentPlanService.save(planData).then(function(res){
                        $scope.selectedIncidentPlan = res.data.incidentPlan;
                        if (res.data.outcomes.length > 0) {
                            IncidentPlanService.addOutcomes(res.data.outcomes).then(function(response){
                                $scope.selectedAction = action;
                                IncidentPlanService.getActivities($scope.selectedIncidentPlan.id).then(function(response){
                                    $scope.activities = response.data.incident_activities;
                                    $scope.activities = $filter('orderBy')($scope.activities, 'id');
                                    $scope.safeActivities = $scope.activities;
                                    $scope.pluckLevels();
                                    toastr.success('Plan assigned to selected incident.', 'Success!');
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                // $http.get("/incident-plan/get-activities?id=" + $scope.selectedIncidentPlan.id)
                                // .then(function (response) {

                                // });
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post("/incident-plan/add-outcomes", res.data.outcomes)
                            // .then(function (response) {

                            // })
                        } else {
                            $scope.selectedAction = action;
                            IncidentPlanService.getActivities($scope.selectedIncidentPlan.id).then(function(response){
                                $scope.activities = response.data.incident_activities;
                                $scope.activities = $filter('orderBy')($scope.activities, 'id');
                                $scope.safeActivities = $scope.activities;
                                $scope.pluckLevels();
                                toastr.success('Plan assigned to selected incident.', 'Success!');
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
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post("/incident-plan/save", planData)
                    // .then(function (res) {

                    // });
                }
            }
        };

        $scope.selectAll = function (collection) {
            if ($scope.selected.length === 0) {
                angular.forEach(collection, function (val) {
                    $scope.selected.push(val.id);
                });
            } else if ($scope.selected.length > 0 && $scope.selected.length != $scope.activities.length) {
                angular.forEach(collection, function (val) {
                    var found = $scope.selected.indexOf(val.id);

                    if (found == -1) {
                        $scope.selected.push(val.id);
                    }
                });
            } else {
                $scope.selected = [];
            }
        };

        $scope.select = function (id) {
            var found = $scope.selected.indexOf(id);
            if (found == -1) {
                $scope.selected.push(id);
            }
            else {
                $scope.selected.splice(found, 1);
            }
        };

        $scope.userStatusClass = function (actor) {
            return (actor && actor.available) ? 'user-available' : 'user-unavailable'
        };

        $scope.userStatusImg = function (actor) {
            return (actor && actor.available) ? '../images/user-available.png' : '../images/user-unavailable.png';
        }

        $scope.displayActorName = function (actor) {
            return actor ? (actor.firstName + ' ' + actor.lastName) : 'N/A';
        };

        $scope.checkDecision = function (activity) {
            if (activity && activity.type === 'decision' && activity.outcomes.length > 0) {
                return true;
            } else {
                return false;
            }
        };

        $scope.viewOutcomes = function (activity, index) {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/action-plan-dashboard/outcomes.html",
                controller: "viewOutcomesCtrl",
                inputs: {
                    activity: activity,
                    incidentPlan: $scope.incident_plan,
                    index: index
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.incident_plan = result;
                        checkSelectedOutcomes();
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
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
                        // $http.post("/incident-activities/update", data)
                        // .then(function (response) {

                        // });
                    }
                });
            });
        };

        $scope.getDefaultClass = function (defaultActivity) {
            return defaultActivity ? 'default-activity' : 'non-default-activity'
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

        $scope.applyStatusFilter = function () {
            if ($scope.statusFilter.length === 0) {
                angular.forEach($scope.activities, function (activity) {
                    activity.status_filter = false;
                });
            } else {
                angular.forEach($scope.activities, function (activity) {
                    var matched = true;
                    angular.forEach($scope.statusFilter, function (status) {
                        if (status === activity.status) {
                            matched = false;
                        }
                        activity.status_filter = matched;
                    });
                });
            }
        };

        $scope.applyAvailabilityFilter = function () {
            if ($scope.availabilityFilter !== 'all') {
                angular.forEach($scope.activities, function (activity) {
                    activity.availability_filter = activity.activated === $scope.availabilityFilter ? false : true;
                });
            } else {
                angular.forEach($scope.activities, function (activity) {
                    activity.availability_filter = false;
                });
            }
        };

        $scope.applyGroupingFilter = function () {
            if ($scope.groupingFilter !== 'all') {
                angular.forEach($scope.activities, function (activity) {
                    activity.group_filter = activity.default === $scope.groupingFilter ? false : true;
                });
            } else {
                angular.forEach($scope.activities, function (activity) {
                    activity.group_filter = false;
                });
            }
        };

        $scope.applyLevelFilter = function () {
            if ($scope.levelFilter !== 'all') {
                angular.forEach($scope.activities, function (activity) {
                    activity.level_filter = activity.responsibility_level === $scope.levelFilter ? false : true;
                });
            } else {
                angular.forEach($scope.activities, function (activity) {
                    activity.level_filter = false;
                });
            }
        };

        $scope.statusReport = function () {
            if ($scope.incident && $scope.activities && $scope.activities.length > 0) {
                ModalService.showModal({
                    templateUrl: "views/actionPlanDashboard/status-report.html",
                    controller: "actionPlanStatusReportCtrl",
                    inputs: {
                        activities: $scope.activities,
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

        $scope.addActivity = function () {
            ModalService.showModal({
                templateUrl: "views/actionPlanDashboard/add-incident-activity-modal.html",
                controller: "addIncidentActivityModalCtrl",
                inputs: {
                    incident_id: $scope.incident.id,
                    incident_plan_id: $scope.selectedIncidentPlan.id,
                    action_plan_id: $scope.selectedAction.id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (response) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (response && response !== '') {
                        angular.forEach($scope.activities, function (activity) {
                            activity.index = activity.index + 1;
                        });
                        $scope.activities.unshift(response);
                    }
                });
            });
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
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (response && response !== '') {
                        $scope.activities[index] = response;
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

        $scope.deleteActivity = function (id) {
            IncidentActivityService.delete(id).then(function(result){
                if (result.data) {
                    toastr.success('Task removed', 'Success!');
                    angular.forEach($scope.activities, function (activity, index) {
                        if (activity.id === id) {
                            $scope.activities.splice(index, 1);
                        }
                    })
                } else {
                    toastr.error('Error removing task', 'Error!');
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.delete("/incident-activities/delete/" + id)
            // .then(function (result) {

            // })
        };

        $scope.unlinkPlan = function () {
            IncidentPlanService.delete($scope.selectedIncidentPlan.id).then(function(result){
                $scope.activities = $scope.selectedAction = $scope.selectedIncidentPlan = null;
                toastr.success('Action Plan unlinked', 'Success!');
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.delete("/incident-plan/delete/" + $scope.selectedIncidentPlan.id)
            // .then(function (result) {

            // }, function (error) {
            //     toastr.error(error, 'Error!');
            // })
        };

        $scope.resetProgress = function () {
            var ids = $scope.activities.map(function (activity) { return activity.id });
            IncidentActivityService.setInactive(ids).then(function(response){
                angular.forEach($scope.activities, function (activity) {
                    activity.activated = false;
                    var time = new Date();
                    activity.activatedAt = time;
                });
                toastr.success('Progress Resetted.', 'Success!');
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/incident-activities/set-inactive", { ids: ids }).then(function (response) {

            // });
        };

        $scope.pluckLevels = function () {
            $scope.responsibilityLevels = [];
            $scope.responsibilityLevels = $scope.activities.map(function (a) {
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
        };
    }

}());
