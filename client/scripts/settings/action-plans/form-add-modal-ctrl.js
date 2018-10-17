(function () {
    'use strict';

    angular.module('app')
        .controller('newActionPlanModalCtrl', ['$scope', 'close', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'planId', 'filterFilter','Query','ActivityService','IncidentTypeService','ScenarioService','RoleService','TagService','TaskService','ActionPlanService','PlanActivityService','SectionService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, $filter, AuthService, $location, ModalService, planId, filterFilter, Query, ActivityService, IncidentTypeService, ScenarioService, RoleService, TagService, TaskService, ActionPlanService, PlanActivityService,SectionService) {
        $scope.loadScenario = function(id){
            $scope.scenarioOptions = []
            angular.forEach($scope.scenarioOptionsAll, function (elem) {
                if(elem.category == null || elem.category.id == id){
                    $scope.scenarioOptions.push(elem);
                }
            });
        }
        var sortList = function () {
            $scope.activities = _.sortBy($scope.activities, function (activity) { return activity.index; });
        };

        function init() {
            $scope.user = Query.getCookie('user');
            $scope.scenarioOptions = [];
            ScenarioService.list($scope.user.userAccountId).then(function(response){
                $scope.scenarioOptions = response.data;
                $scope.scenarioOptionsAll = angular.copy($scope.scenarioOptions)
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/scenarios/list?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                
            // });
            $scope.searchKeywords = ''
            $scope.currentPage = 1;
            $scope.numPerPageOpt = [3, 5, 10, 20];
            $scope.filteredActivities = [];
            $scope.row = '';
            $scope.numPerPage = $scope.numPerPageOpt[1];
            $scope.page1 = true;
            $scope.action = [];
            $scope.typeOptions = [];
            $scope.expand = false;
            $scope.activityExpand = false;
            $scope.activities = [];
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
            $scope.data = {};
            var date = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.data.plandate = date;
            RoleService.all().then(function(response){
                $scope.roles = response.data;
                $scope.sortByCreate = _.sortBy($scope.roles, function (o) { return new Date(o.createdAt); });
                $scope.roles = $scope.sortByCreate.reverse();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/roles/all").then(function (response) {
                
            // });

            TaskService.all($scope.user.userAccountId).then(function(response){
                $scope.tasks = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/tasks/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            // });
            $http.get("/users/list").then(function (res) {
                $scope.users = res.data;
            });

            TagService.getAccountTags($scope.user.userAccountId).then(function(response){
                $scope.tags = response.data;
                $scope.tags.unshift({id: 0, text: 'All Categories'});
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/tags/get-account-tags?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            // });

            if (planId != null) {
                $scope.planId = planId;
                ActionPlanService.get($scope.planId).then(function(response){
                    $scope.data = response.data;
                    $scope.data.plandate = $filter('date')($scope.data.plandate ,"dd/mm/yyyy");
                    ActionPlanService.activities($scope.data.id).then(function(response){
                        $scope.activities = response.data.activities;
                        sortList();
                        ActivityService.notDecisions($scope.user.userAccountId).then(function(response){
                            $scope.outcomes = response.data;                            
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.get("/settings/activities/not-decisions?userAccountId=" + $scope.user.userAccountId).then(function (response) {
                        
                        // });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get("/settings/action-plans/activities?actionPlanId=" + $scope.data.id).then(function (response) {
                        
                    // });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = '/settings/action-plans/get?id=' + $scope.planId;
                // $http.get(path).then(function (response) {
                    
                // });
            }
            ActivityService.all($scope.user.userAccountId).then(function(response){
                $scope.allActivities = response.data;
                $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');

                $scope.search();
                $scope.select($scope.currentPage);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/activities/all?userAccountId=" + $scope.user.userAccountId)
            // .then(function (response) {
                
            // });
        };
        init();

        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            $scope.currentPageActivities = $scope.filteredActivities.slice(start, end);
        };

        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        $scope.onOrderChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.search = function() {
            $scope.filteredActivities = $filter('filter')($scope.allActivities, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredActivities = $filter('orderBy')($scope.allActivities, rowName);
            return $scope.onOrderChange();
        };

        $scope.addIncidentType = function () {
            ModalService.showModal({
                templateUrl: "views/wizard/incident-type-template.html",
                controller: "incidentTypeAddCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.categories.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.save = function (data, exit) {
            $scope.data.type = ($scope.data.categoryId)? Query.filter($scope.categories,{'id': $scope.data.categoryId},true).name : '';
            if ($scope.data.name != null && data.plandate != null) {
                if (data.id === undefined) {
                    data.plandate = moment.utc(data.plandate, 'DD/MM/YYYY', true).format();
                    ActionPlanService.save(data).then(function(response){
                        $scope.data = response.data;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/save', { data: data }).then(function (response) {
                        
                    // });
                }
                else {
                    ActionPlanService.update(data).then(function(response){

                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/update', { data: data }).then(function (response) {
                    // });
                }
                $scope.page1 = false;
                $scope.page3 = true;
            } else {
                toastr.error("Please Fill Required Fields");
            }
        };

        $scope.closePicker = function () {
            $('.datepicker').hide();
        };

        $scope.updateActivity = function (activity) {
            var data = { activityId: activity.id, planId: $scope.data.id, defaultActivity: activity.default };
            PlanActivityService.updateDefault(data).then(function(response){
                toastr.success("Activity updated successfully.");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/plan-activities/update-default', data).then(function (response) {
                
            // });
        };

        var updateActivityIndex = function () {
            angular.forEach($scope.activities, function (activity, index) {
                activity.index = index;
                var data = { activityId: activity.id, planId: $scope.data.id, index: activity.index };
                PlanActivityService.updateIndex(data).then(function(response){
                    var data = { activities: $scope.activities, planId: $scope.data.id };
                    $http.post("/incidentPlan/updateIndex", data).then(function (response) {
                    });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/plan-activities/update-index", data).then(function (response) {
                    
                // });
            });
        }

        $scope.deleteActivity = function (activity, index) {
            var data = { activityId: activity.id, planId: $scope.data.id };
            PlanActivityService.removeActivity(data).then(function(response){
                    $scope.activities.splice(1, index);
                    toastr.success('activity deleted', 'Success');
                    updateActivityIndex();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/plan-activities/remove-activity", data)
            //     .then(function (response) {

            //     });
        };

        $scope.saveExit = function () {
            close($scope.data);
        };

        $scope.DragOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) { return true; },
            orderChanged: function (event) {
                updateActivityIndex();
                sortList();
            },
            itemMoved: function (event) {
                console.log('item moved');
            },
            dragStart: function (event) { console.log('drag started') },
            dragEnd: function (event) { console.log('drag ended') }
        };

        $scope.showActivities = function () {
            $scope.page3 = true;
            $scope.page2 = false;
        };

        $scope.backToActivities = function () {
            $scope.page2 = true;
            $scope.page3 = false;
        };

        $scope.backToAllActivities = function () {
            $scope.page3 = true;
            $scope.page4 = false;
        };

        $scope.newAssignTask = function () {
            $scope.page3 = false;
            $scope.page4 = true;
        };

        $scope.addActivities = function () {
            var selectedActivities = filterFilter($scope.allActivities, { 'selected': true });
            if (selectedActivities.length > 0) {
                var nextIndex = 0;
                SectionService.createDefault({actionPlanId: $scope.data.id}).then(function(respp){
                    angular.forEach(selectedActivities, function (activitySelected, index) {
                        var data = { activitySelected: activitySelected.id, actionPlanId: $scope.data.id, nextIndex: nextIndex ,sectionId: respp.data.id};
                        ActionPlanService.assignActivity(data).then(function(response){
                            response.data = response.data.activity;
                            if (selectedActivities.length - index === 1) {
                                    toastr.success('Tasks have been assigned', 'Success');
                                    close($scope.data);
                            }
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post('/settings/action-plans/assign-activity', { data: data })
                        //     .then(function (response) {
                                
                        // });
                        nextIndex = nextIndex + 1;
                    });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/sections/create-default', {actionPlanId: $scope.data.id}).then(function (respp) {
                    
                // });
            } else {
                toastr.error('Please select at least one assigned task', 'Error');
            }
        };

        $scope.addTaskItem = function () {
            ModalService.showModal({
                templateUrl: "views/action.item.create.html",
                controller: "AddActionItemCtrl",
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    TaskService.all($scope.user.userAccountId).then(function(response){
                        $scope.tasks = response.data;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get('/settings/tasks/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                        
                    // });
                });
            });
        };

        $scope.displayActivityActor = function (activity) {
            return (activity.response_actor === null ? 'N/A' : activity.response_actor.firstName + " " + activity.response_actor.lastName);
        };

        function activityObj(reslevel, possible_outcomes, description, type) {
            this.responsibility_level = reslevel,
                this.possible_outcomes = possible_outcomes,
                this.description = description;
            this.type = type;
            this.userAccountId = $scope.user.userAccountId
        }

        $scope.activity = new activityObj('', 0, '', "action");

        var validateActivity = function () {
            if (!$scope.activity.taskListId) {
                toastr.error('Activity Task is not selected.', 'Error!');
                return false;
            }
            return true;
        };

        $scope.createAssignTask = function () {
            if (validateActivity()) {
                $scope.activity.outcomes = [];
                var data = { activity: $scope.activity };
                ActivityService.create(data).then(function(response){
                    toastr.success("Assign Task created", 'Success!');
                    $scope.allActivities.push(response.data);
                    $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
                    $scope.search();
                    $scope.select($scope.currentPage);

                    $scope.page3 = true;
                    $scope.page4 = false;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/activities/create', { data: data }).then(function (response) {
                    
                // });
            };
        };

        $scope.displayActorName = function(actor){
            var displayString = actor.firstName + ' ' + actor.lastName;
            if (actor.title){
                displayString = displayString + ', ' + actor.title;
            }
            if (actor.departmentId){
                displayString = displayString + ', ' + actor.department.name;
            }
            return displayString;
        };

        $scope.CategoryFilter = function () {
            if ($scope.categoriesFilter && $scope.categoriesFilter === 'All Categories') {
                $scope.categoriesFilter = null;
            }
            $scope.filteredActivities = $filter('filter')($scope.allActivities, $scope.categoriesFilter);
            return $scope.onFilterChange();
        };

    }
}());
