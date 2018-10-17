(function() {
    'use strict';

    angular.module('app')
    .controller('newActionPlanWizardController', ['$scope', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'filterFilter', '$timeout','Query','AllCategoryService','ActivityService','IncidentTypeService','ScenarioService','RoleService','TagService','TaskService','ActionPlanService','DecisionService','PlanActivityService','SectionService', ctrlFunction]);

    function ctrlFunction($scope, $routeParams, $http, $filter, AuthService, $location, ModalService, filterFilter, $timeout,Query, AllCategoryService,ActivityService, IncidentTypeService, ScenarioService, RoleService, TagService, TaskService, ActionPlanService, DecisionService, PlanActivityService, SectionService) {
        $scope.loadScenario = function(id){
            $scope.scenarioOptions = []
            console.log($scope.scenarioOptionsAll);
            angular.forEach($scope.scenarioOptionsAll, function (elem) {
                if(elem.category == null || elem.category.id == id){
                    $scope.scenarioOptions.push(elem);
                }
            });
        }
        var sortList = function() {
            $scope.activities = _.sortBy($scope.activities, function(activity) { return activity.index; });
        };

        function init() {
            $scope.scenarioOptions = [];
            $scope.user = Query.getCookie('user');
            ScenarioService.list($scope.user.userAccountId).then(function(response){
                $scope.scenarioOptions = response.data;
                $scope.scenarioOptionsAll = angular.copy($scope.scenarioOptions);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/scenarios/list?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                
            // });
            $scope.saveActionPlan1="Save Action Plan & Exit";
            $scope.first = true;
            $scope.ActivityName = "Activities";
            $scope.ActivityPosition = 100;
            $scope.activityExpand = false;
            $scope.currentCategory = 0;
            $scope.finalsave = false;
            $scope.selActivities = [];
            $scope.categorydone = false;
            var activityIndex = 0;
            $scope.next = function() {
                if ($scope.first == true) {
                    if ($scope.data.name != null && $scope.data.name != '' && $scope.data.plandate != null) {
                        $scope.data.type = ($scope.data.categoryId)? Query.filter($scope.categories,{'id': $scope.data.categoryId},true).name : '';
                        if ($scope.data.id === undefined) {
                            $scope.data.plandate = moment.utc($scope.data.plandate, 'DD/MM/YYYY', true).format();
                            ActionPlanService.save($scope.data).then(function(response){
                                $scope.data = response.data;
                                $scope.addSec();
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/settings/action-plans/save', { data: $scope.data }).then(function(response) {
                                
                            // });
                        } else {
                            ActionPlanService.update($scope.data).then(function(response){

                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/settings/action-plans/update', { data: $scope.data }).then(function(response) {});
                        }
                        $scope.first = false;

                        if ($scope.allCategories.length == 1) {
                            $scope.finalsave = true;   //this is for the particular user
                        }

                        $scope.changeView();
                    } else {
                        toastr.error("Please Fill Required Fields");
                    }
                } else {
                    if ($scope.currentCategory < $scope.allCategories.length) {
                        $scope.currentCategory = $scope.currentCategory + 1;
                        $scope.changeView();
                        if ($scope.currentCategory == $scope.allCategories.length - 1) {
                            $scope.finalsave = true;
                        }

                    }
                }
            }
            $scope.gotoFirst = function(){
                $scope.first = true;
                $scope.finalsave =  false;
            };
            $scope.DragOptions = {
                accept: function(sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                },
                orderChanged: function (event) {
                    var sectionId = event.source.itemScope.activity.plan_activities.sectionId;
                    updateActivityIndex(sectionId);
                    // sortList(sectionId);
                },
                itemMoved: function(event) {
                },
                dragStart: function(event) { console.log('drag started') },
                dragEnd: function(event) { console.log('drag ended') }
            };

            $scope.DragOptions1 = {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                },
                orderChanged: function (event) {
                    // console.log(event.source.itemScope.activity.plan_activities.sectionId);
                    // var sectionId = event.source.itemScope.activity.plan_activities.sectionId;
                    // updateActivityIndex(sectionId);
                    // sortList(sectionId);
                },
                itemMoved: function(event) {
                    console.log('item moved');
                },
                dragStart: function(event) { console.log('drag started') },
                dragEnd: function(event) { console.log('drag ended') }
            };
            $scope.previous = function() {
                $scope.finalsave = false;
                if ($scope.currentCategory >= 0) {
                    $scope.currentCategory = $scope.currentCategory - 1;
                    $scope.changeView();
                    if ($scope.currentCategory == 0) {
                        // $scope.finalsave = true;
                    }

                }
            }
            $scope.selectActivity = function(select, activity) {
                console.log(select,activity);
                if (select == true) {
                    $scope.selActivities.push(activity);
                    var selectedActivities = angular.copy($scope.selActivities);
                    $scope.planTasks = [];
                    var data = { activitySelected: activity.id, actionPlanId: $scope.data.id, nextIndex: activityIndex, sectionId: $scope.defaultSectionID };
                    ActionPlanService.assignActivity(data).then(function(response){
                        response.data = response.data.activity;
                        response.data.title = response.data.task_list.title;
                        response.data.response_actor_email = response.data.response_actor ? response.data.response_actor.email : null;
                        response.data.backup_actor_email = response.data.backup_actor ? response.data.backup_actor.email : null;
                        response.data.accountable_actor_email = response.data.accountable_actor ? response.data.accountable_actor.email : null;
                        response.data.index = angular.copy(activityIndex);
                        response.data.tindex = angular.copy(activityIndex);
                        $scope.planTasks.push(response.data);
                        // if (($scope.selActivities.length - activityIndex) === 1) {
                            // toastr.success('Task(s) have been assigned', 'Success');
                            // $scope.selActivities = angular.copy($scope.planTasks);
                            // if (id == 1) {
                            //     $location.path('/actionPlanPage');
                            // }
                        // }
                        activityIndex += 1;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/assign-activity', { data: data })
                    // .then(function (response) {
                        
                    // });
                } else if (select == false) {
                    var data = { activityId: activity.id, actionPlanId: $scope.data.id, sectionId: $scope.defaultSectionID };
                    ActionPlanService.deleteAssignedActivity(data).then(function(response){
                        angular.forEach($scope.selActivities, function(activityCopy, ind) {
                            if (activityCopy.id == activity.id) {
                                $scope.selActivities.splice(ind, 1);
                            }
                        });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/delete-assigned-activity', { data: data })
                    // .then(function (response) {
                        
                    // });

                }
            }
            $scope.changeView = function() {
                $("html, body").animate({ scrollTop: 0 }, 1000);
                $scope.allActivities = [];
                angular.forEach($scope.allCategories, function(selectedCategory, ind) {
                    if (ind == $scope.currentCategory) {
                        angular.forEach($scope.allActivitiesCopy, function(activityCopy) {
                            if (activityCopy && activityCopy.task_list && activityCopy.task_list.all_category && activityCopy.task_list.all_category.id === selectedCategory.id && activityCopy.task_list.for_template == true) {
                                $scope.allActivities.push(activityCopy);
                            }
                        });
                        $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
                        $scope.search();
                        $scope.select($scope.currentPage);
                    }
                });
            };
            $scope.newAssignTask = function() {
                $scope.act = {};
                $scope.page5 = false;
                $scope.page10 = true;
            };

            $scope.updateTaskActivity = function (activity) {
                var data = { activity: activity, outcomes: [] };
                ActivityService.update(data).then(function(response){
                    toastr.success("Activity updated successfully");
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/activities/update', { data: data })
                // .then(function (response) {
                    
                // });
            };
            $scope.deleteSection = function(secId, ind) {
                // var section = filterFilter($scope.allCategories, { 'selected': true });
                angular.forEach($scope.sections, function(section, index) {
                    if (section.id == secId) {
                        SectionService.delete(secId).then(function(result){
                            if (section.activities.length != 0) {
                                angular.forEach(section.activities, function(task, index) {
                                    $scope.selActivities.push(task);
                                });
                            }
                            $scope.sections.splice(ind, 1);
                            toastr.success('Section Deleted', 'Success!');
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.delete("/sections/delete/" + secId)
                        // .then(function(result) {
                            
                        // }, function(error) {
                        //     toastr.error(error, 'Error!');
                        // })
                    }
                });
            }

            $scope.EditFromWizard = function(task, index) {
                ModalService.showModal({
                    templateUrl: "views/settings/activities/add.html",
                    controller: "addActivityModalCtrl",
                    inputs: {
                        incident: $scope.incident,
                        task: task
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        if(result !== '' && typeof result !== 'undefined'){
                            $scope.allActivities[index] = result;
                        }
                    });
                });

            };
            $scope.addSec = function() {
                SectionService.createDefault({actionPlanId: $scope.data.id}).then(function(response){
                    $scope.defaultSectionID = response.data.id;
                    $scope.defaultSection = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/sections/create-default', {actionPlanId: $scope.data.id}).then(function(response){
                    
                // })
            };
            $scope.page5CatDone = function(){
                if ($scope.selActivities.length > 0) {
                    $scope.page5 = true;
                    $scope.categorydone = true;
                } else {
                    toastr.error('Please select at least one assigned task', 'Error');
                }
            }
            $scope.sections = [];
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
            $scope.user = Query.getCookie('user');
            $scope.activities = [];

            IncidentTypeService.list().then(function(res){
                $scope.categories = res.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/incident-types/list").then(function(res) {
                
            // });
            AllCategoryService.list().then(function(res){
                $scope.allCategories = res.data;
                $scope.allCategories = _.sortBy($scope.allCategories, function(o) { return new Date(o.position); });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            }); 
            // $http.get("/settings/all-categories/list").then(function(res) {
               
            // });

            $scope.data = {};
            var date = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.data.plandate = date;

            RoleService.all().then(function(response){
                $scope.roles = response.data;
                $scope.sortByCreate = _.sortBy($scope.roles, function(o) { return new Date(o.createdAt); });
                $scope.roles = $scope.sortByCreate.reverse();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/roles/all").then(function(response) {
                
            // });

            TaskService.all($scope.user.userAccountId).then(function(response){
                $scope.tasks = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/tasks/all?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                
            // });

            $http.get("/users/list").then(function(res) {
                $scope.users = res.data;
            });

            TagService.getAccountTags($scope.user.userAccountId).then(function(response){
                $scope.tags = response.data;
                $scope.tags.unshift({ id: 0, text: 'All Categories' });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/tags/get-account-tags?userAccountId=' + $scope.user.userAccountId).then(function(response) {
               
            // });
            ActivityService.all($scope.user.userAccountId).then(function(response){
                $scope.allActivities = response.data;
                $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
                $scope.allActivitiesCopy = angular.copy($scope.allActivities);
                $scope.search();
                $scope.select($scope.currentPage);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/activities/all?userAccountId=" + $scope.user.userAccountId)
            // .then(function(response) {
                
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

        $scope.orderp = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.allActivities = $filter('orderBy')($scope.allActivities, rowName);
            // return $scope.onOrderChange();
        };

        $scope.addActivity = function() {
            ModalService.showModal({
                templateUrl: "views/incidents/link-activity-modal.html",
                controller: "linkActivityModalCtrl",
                inputs: {
                    userAccountId: $scope.user.userAccountId,
                    actionPlanId: $scope.data.id,
                    defaultSectionID: null

                }
            }).then(function(modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result !== '' && typeof result !== 'undefined') {
                        $scope.activities.push(result);
                        sortList();
                    }
                });
            });
        };

        $scope.addIncidentType = function() {
            ModalService.showModal({
                templateUrl: "views/wizard/incident-type-template.html",
                controller: "incidentTypeAddCtrl"
            }).then(function(modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function(result) {
                    if (result) {
                        $scope.categories.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.save = function(data, exit) {
            if ($scope.data.name != null && data.plandate != null) {
                $scope.data.type = ($scope.data.categoryId)? Query.filter($scope.categories,{'id': $scope.data.categoryId},true).name : '';
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
                    // $http.post('/settings/action-plans/save', { data: data }).then(function(response) {
                        
                    // });
                } else {
                    ActionPlanService.update(data).then(function(response){

                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/update', { data: data }).then(function(response) {});
                }
                $scope.page1 = false;
                $scope.page2 = true;
            } else {
                toastr.error("Please Fill Required Fields");
            }
        };

        $scope.update = function() {
            if ($scope.decision) {
                $scope.decision.actionPlanId = $scope.data.id;
                DecisionService.bulkSave($scope.decision).then(function(response){
                    toastr.success("Saved successfully.");
                    var path = 'settings/action-plans/create/' + $scope.data.id;
                    $location.path('settings/action-plans');
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/decisions/bulkSave', { data: $scope.decision }).then(function(response) {
                    
                // });
            };
        };

        $scope.closePicker = function() {
            $('.datepicker').hide();
        };

        $scope.addModal = function() {
            $scope.act = {};
            ModalService.showModal({
                templateUrl: "views/settings/task-libraries/form.html",
                controller: "addTaskCtrl",
                inputs: {
                    taskAssign: false
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result){
                        $scope.taski = result.data;
                        $scope.act.outcomes = [];
                        $scope.act.taskListId = $scope.taski.id;
                        $scope.act.categoryId = $scope.taski.categoryId;
                        $scope.act.description = $scope.taski.description;
                        var data = { activity: $scope.act };
                        ActivityService.save(data).then(function(response){
                            toastr.success("Task created", 'Success!');
                            var data = { activitySelected: response.data.id, actionPlanId: $scope.data.id, nextIndex: $scope.activities.length, sectionId: $scope.defaultSectionID };
                                ActionPlanService.assignActivity(data).then(function(response){
                                    response.data = response.data.activity;
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                $scope.selActivities.push(response.data);
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });   
                    }else{
                        toastr.error("Something went wrong try again.")
                    }
                    // $http.post('/settings/activities/save', { data: data }).then(function (response) {
                        

                    // });
                });
            });
        };

        $scope.updateActivity = function(activity) {
            var data = { activityId: activity.id, planId: $scope.data.id, defaultActivity: activity.default };
            PlanActivityService.updateDefault(data).then(function(response){
                toastr.success("Activity updated successfully.");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/plan-activities/update-default', data).then(function(response) {
                
            // });
        };

        var updateActivityIndex = function(sId) {
            var index;
            angular.forEach($scope.sections, function (el,ind) {
                if(el.id === sId){
                    index = ind;
                }
            });
            angular.forEach($scope.sections[index].activities, function(activity, index) {
                activity.index = index;
                var data = { activityId: activity.id, sectionId: sId, index: activity.index };
                PlanActivityService.updateIndexSection(data).then(function(response){

                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/plan-activities/update-index-section", data).then(function(response) {
                    
                // });

            });
        }

        $scope.deleteActivityFromList = function(activity, index) {
            $scope.selActivities.splice(index,1);
        };

        $scope.deleteActivity = function(activity, index) {
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
            // .then(function(response) {
                
            // });
        };

        $scope.backToAllCategories = function() {
            $scope.page3 = false;
            $scope.page2 = true;
        };

        $scope.backToAllActivities = function() {
            $scope.page3 = true;
            $scope.page4 = false;
            $scope.page5 = false;
        };

        // $scope.newAssignTask = function () {
        //     $scope.page3 = false;
        //     $scope.page4 = true;
        // };
        $scope.addinsection = function(activity, select) {
            if (select) {
                $scope.tsks.push(activity);
            } else {
                angular.forEach($scope.tsks, function(task, ind) {
                    if (task.id == activity.id) {
                        $scope.tsks.splice(ind, 1);
                    }
                });
            }
        }

        $scope.addtasksss = function() {
            angular.forEach($scope.tsks, function(tsk) {
                $scope.selActivities.push(tsk);
            });
            toastr.success('Tasks Added.', 'Success');
            $scope.page8 = false;
            $scope.page5 = true;
        }

        $scope.addTasks = function() {
            $scope.page2 = false;
            $scope.page3 = true;
            var selectedCategories = filterFilter($scope.allCategories, { 'selected': true });
            $scope.allActivities = [];
            angular.forEach(selectedCategories, function(selectedCategory) {
                angular.forEach($scope.allActivitiesCopy, function(activityCopy) {
                    if (activityCopy && activityCopy.task_list && activityCopy.task_list.all_category && activityCopy.task_list.all_category.id === selectedCategory.id) {
                        $scope.allActivities.push(activityCopy);
                    }
                });
            });
            $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
            $scope.search();
            $scope.select($scope.currentPage);
        };

        $scope.addSections = function() {
            $scope.selectedActivities = filterFilter($scope.allActivities, { 'selected': true });
            if ($scope.selectedActivities.length > 0) {
                $scope.page3 = false;
                $scope.page5 = true;
            } else {
                toastr.error('Please select at least one assigned task', 'Error');
            }
        };

        $scope.newSection = function() {
            $scope.sec_heading = "Add New Section";
            $scope.sectionName = '';
            $scope.position = 99;
            $scope.page5 = false;
            $scope.page6 = true;
            $scope.sel = [];
            angular.forEach($scope.selActivities, function(selectedCategory) {
                $scope.sel.push(false);
            });
            $scope.tsks = [];
        };

        $scope.editSection = function(sec, ind) {
            $scope.sec_heading = "Edit Section";
            $scope.sectionName = sec.name;
            $scope.position = sec.index;
            $scope.page5 = false;
            $scope.page7 = true;
            $scope.editedsection = sec;
            $scope.concatinate = [];
            $scope.sel = [];
            angular.forEach(sec.activities, function(act) {
                $scope.concatinate.push(act);
                $scope.sel.push(true);
            });
            $scope.tsks = angular.copy($scope.concatinate);
            angular.forEach($scope.selActivities, function(s) {
                $scope.concatinate.push(s);
                $scope.sel.push(false);
            });
        };

        $scope.editActivities = function() {
            $scope.page5 = false;
            $scope.page9 = true;
        }

        $scope.updateActivities = function() {
            $scope.page9 = false;
            $scope.page5 = true;
        }

        $scope.opentask = function() {
            $scope.page5 = false;
            $scope.page8 = true;
            $scope.tasksToShow = [];
            $scope.sel = [];
            $scope.tsks = [];
            $scope.tasksToShow = angular.copy($scope.allActivitiesCopy);
            console.log($scope.tasksToShow.length);
            angular.forEach($scope.selActivities, function(s) {
                angular.forEach($scope.tasksToShow, function(tsk, ind) {
                    if (s.id == tsk.id) {
                        $scope.tasksToShow.splice(ind, 1)
                    }
                });
            });
            console.log($scope.tasksToShow.length);
            angular.forEach($scope.tasksToShow, function(s) {
                $scope.sel.push(false);
            });
        };

        $scope.updateSection = function() {
            if ($scope.sectionName === '') {
                toastr.error('Please provide section name');
            } else {
                SectionService.update({ index: $scope.position, id: $scope.editedsection.id, name: $scope.sectionName, actionPlanId: $scope.data.id, activities: $scope.tsks }).then(function(response){
                    console.log(response.data, $scope.editedsection);
                    var ii = $scope.sections.indexOf($scope.editedsection);
                    $scope.sections[ii] = response.data;
                    $scope.sections[ii].activities = response.data.activities;
                    $scope.sections[ii].addActivities = false;
                    $scope.sections = _.sortBy($scope.sections, function(activity) { return activity.index; });

                    angular.forEach($scope.tsks, function(task, index) {
                        var ind = $scope.selActivities.indexOf(task);
                        // console.log("index ======", ind);
                        if (ind != -1) {
                            $scope.selActivities.splice(ind, 1);
                        }
                    });
                    toastr.success('Section Updated', 'Success');
                    $scope.page7 = false;
                    $scope.page5 = true;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/sections/update', { index: $scope.position, id: $scope.editedsection.id, name: $scope.sectionName, actionPlanId: $scope.data.id, activities: $scope.tsks }).then(function(response) {
                    
                // });
            }
        };

        $scope.backToSections = function() {
            if ($scope.page6 == true) {
                $scope.page6 = false;
            } else if ($scope.page7 == true) {
                $scope.page7 = false;
            } else if ($scope.page8 == true) {
                $scope.page8 = false;
            } else if ($scope.page10 == true) {
                $scope.page10 = false;
            }
            $scope.page5 = true;
        };

        $scope.createNewSection = function() {
            if ($scope.sectionName === '') {
                toastr.error('Please provide section name');
            } else {
                SectionService.create({ index: $scope.position, name: $scope.sectionName, actionPlanId: $scope.data.id, activities: $scope.tsks }).then(function(response){
                    $scope.sections.unshift(response.data);
                    $scope.assignSectionTasks(response.data);
                    $scope.sections[0].activities = response.data.activities;
                    $scope.sections = _.sortBy($scope.sections, function(activity) { return activity.index; });
                    angular.forEach($scope.tsks, function(task, index) {
                        var ind = $scope.selActivities.indexOf(task);
                        $scope.selActivities.splice(ind, 1);
                    });
                    toastr.success('Section Created', 'Success');
                    $scope.page6 = false;
                    $scope.page5 = true;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/sections/create', { index: $scope.position, name: $scope.sectionName, actionPlanId: $scope.data.id, activities: $scope.tsks }).then(function(response) {
                    
                // });
            }
        };

        $scope.assignSectionTasks = function(section) {
            section.addActivities = false;
        };

        $scope.saveActionPlan = function(id) {
            // var selectedActivities = angular.copy($scope.selActivities);
            ModalService.showModal({
                templateUrl: "views/wizard/after-save-action-plan.html",
                controller: "afterSaveActionPlanCtrl",
                inputs: {
                    actionPlan: $scope.data
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result === undefined){
                        $location.path('/actionPlanPage');
                    }else if(result === 'TO-AP-DASHBOARD') {
                        $location.path('/home')
                    }
                });
            });
            $scope.selActivities = angular.copy($scope.planTasks);
        };

        $scope.addTaskItem = function() {
            ModalService.showModal({
                templateUrl: "views/action.item.create.html",
                controller: "AddActionItemCtrl",
            }).then(function(modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function(result) {
                    TaskService.all($scope.user.userAccountId).then(function(response){
                        $scope.tasks = response.data;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get('/settings/tasks/all?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                        
                    // });
                });
            });
        };

        $scope.displayActivityActor = function(activity) {
            if (activity) {
                return !activity.response_actor ? 'N/A' : activity.response_actor.firstName + " " + activity.response_actor.lastName;
            }
        };

        function activityObj(reslevel, possible_outcomes, description, type) {
            this.responsibility_level = reslevel,
            this.possible_outcomes = possible_outcomes,
            this.description = description;
            this.type = type;
            this.response_actor = null;
            this.userAccountId = $scope.user.userAccountId
        }

        $scope.activity = new activityObj('', 0, '', "action");

        var validateActivity = function() {
            if (!$scope.act.taskListId) {
                toastr.error('Activity Task is not selected.', 'Error!');
                return false;
            }
            return true;
        };

        $scope.createAssignTask = function() {
            if (validateActivity()) {
                $scope.act.outcomes = [];
                var data = { activity: $scope.act };
                ActivityService.save(data).then(function(response){
                    toastr.success("Assign Task created", 'Success!');
                    $scope.selActivities.push(response.data);
                    $scope.selActivities = $filter('orderBy')($scope.selActivities, 'task_list.title');
                    $scope.search();
                    $scope.select($scope.currentPage);
                    $scope.page5 = true;
                    $scope.page10 = false;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/activities/save', { data: data }).then(function(response) {
                    
                // });
            };
        };

        $scope.displayActorName = function(actor) {
            var displayString = actor.firstName + ' ' + actor.lastName;
            if (actor.title) {
                displayString = displayString + ', ' + actor.title;
            }
            if (actor.departmentId) {
                displayString = displayString + ', ' + actor.department.name;
            }
            return displayString;
        };

        $scope.CategoryFilter = function() {
            if ($scope.categoriesFilter && $scope.categoriesFilter === 'All Categories') {
                $scope.categoriesFilter = null;
            }
            $scope.filteredActivities = $filter('filter')($scope.allActivities, $scope.categoriesFilter);
            return $scope.onFilterChange();
        };

    }
}());
