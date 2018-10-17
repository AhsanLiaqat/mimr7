(function () {
    'use strict';

    angular.module('app')
        .controller('newCategoryPlanModalCtrl', ['$scope', 'close', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'filterFilter','Query','AllCategoryService','ActivityService','IncidentTypeService','ScenarioService','RoleService','TagService','TaskService','ActionPlanService','DecisionService','PlanActivityService','SectionService','AgendaPointService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, $filter, AuthService, $location, ModalService, filterFilter,Query, AllCategoryService,ActivityService, IncidentTypeService, ScenarioService, RoleService, TagService, TaskService, ActionPlanService, DecisionService, PlanActivityService, SectionService, AgendaPointService) {
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
                $scope.scenarioOptionsAll = angular.copy($scope.scenarioOptions);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/scenarios/list?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                
            // });
            $scope.bro = ['1', '2', '3', '4', '5'];
            $scope.sections = [];
            $scope.newTask = {};
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
            AllCategoryService.list().then(function(res){
                $scope.allCategories = res.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/all-categories/list").then(function (res) {
                
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
                $scope.tags.unshift({ id: 0, text: 'All Categories' });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });

            // $http.get('/settings/tags/get-account-tags?userAccountId=' + $scope.user.userAccountId).then(function (response) {
            //     $scope.tags = response.data;
            //     $scope.tags.unshift({id: 0, text: 'All Categories'});
            // });
            ActivityService.all($scope.user.userAccountId).then(function(response){
                $scope.allActivities = response.data;
                $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title','agendaPoint.name');
                $scope.allActivitiesCopy = angular.copy($scope.allActivities);
                $scope.search();
                $scope.select($scope.currentPage);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            AgendaPointService.list($scope.user.userAccountId).then(function(response){
                $scope.allAgendaPoint = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/activities/all?userAccountId=" + $scope.user.userAccountId)
            //     .then(function (response) {
                    
            //     });
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
        };

        $scope.addActivity = function () {
            ModalService.showModal({
                templateUrl: "views/incidents/link-activity-modal.html",
                controller: "linkActivityModalCtrl",
                inputs: {
                    userAccountId: $scope.user.userAccountId,
                    actionPlanId: $scope.data.id,
                    defaultSectionID: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result !== '' && typeof result !== 'undefined') {
                        $scope.activities.push(result);
                        sortList();
                    }
                });
            });
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
            //     .then(function (response) {
                    
            //     });
        };
        $scope.selectedTask = [];
        $scope.selected = [];
        $scope.unselectAgendaPoint = function(agendaPoint){
            agendaPoint.checked = !agendaPoint.checked
            if (agendaPoint.checked == false){
                angular.forEach($scope.selected, function(stask, key1) {
                    if (stask == agendaPoint.id){
                        $scope.selected.splice(key1, 1);
                        $scope.selectedTask.splice(key1, 1);
                    }
                });
            }else{
                $scope.selected.push(angular.copy(agendaPoint.id));
                agendaPoint.status = 'incomplete';
                $scope.selectedTask.push(angular.copy(agendaPoint));
            }
        };
        $scope.submit = function() {
            ActionPlanService.saveAgendaPointList({data : $scope.data.id, selected : $scope.selected}).then(function(response){
                toastr.success('Successfully added new action plan');
                close();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
        };
        $scope.save = function (data,exit,decider) {
            $scope.data = data;
            $scope.decider = decider;
            if($scope.decider == false){
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
                    }
                    else {
                        ActionPlanService.update(data).then(function(response){

                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                    }
                    $scope.page1 = false;
                    $scope.page2 = true;
                } else {
                    toastr.error("Please Fill Required Fields");
                }
            }else{
                if ($scope.data.name != null && data.plandate != null) {
                    $scope.data.type = ($scope.data.categoryId)? Query.filter($scope.categories,{'id': $scope.data.categoryId},true).name : '';
                    if (data.id === undefined) {
                        data.plandate = moment.utc(data.plandate, 'DD/MM/YYYY', true).format();
                        $scope.data.kind = 'agendaPoints';
                        ActionPlanService.save(data).then(function(response){
                            $scope.data = response.data;
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                    }
                    else {
                        ActionPlanService.update(data).then(function(response){

                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                    }
                    $scope.page1 = false;
                    $scope.page7 = true;
                } else {
                    toastr.error("Please Fill Required Fields");
                }
            }
        };
        $scope.deleteActivityFromSection = function(section,activity, index) {
            $scope.selectedActivities.push(activity);
            section.activities.splice(index,1);
        };
        $scope.deleteActivityFromList = function(activity, index) {
            $scope.selectedActivities.splice(index,1);
        };
        $scope.update = function () {
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
                // $http.post('/decisions/bulkSave', { data: $scope.decision }).then(function (response) {
                    
                // });
            };
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

        var updateActivityIndex = function (sId) {
            var index;
            angular.forEach($scope.sections, function (el,ind) {
                if(el.id === sId){
                    index = ind;
                }
            });
            angular.forEach($scope.sections[index].activities, function (activity, index) {
                activity.index = index;
                console.log(index);
                console.log(activity.id);
                var data = { activityId: activity.id, sectionId: sId, index: activity.index };
                PlanActivityService.updateIndexSection(data).then(function(response){

                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/plan-activities/update-index-section", data).then(function (response) {
                //     });

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
                console.log(event.source.itemScope.activity.plan_activities.sectionId);
                var sectionId = event.source.itemScope.activity.plan_activities.sectionId;
                updateActivityIndex(sectionId);
                // sortList(sectionId);
            },
            itemMoved: function (event) {
                console.log('item moved');
            },
            dragStart: function (event) { console.log('drag started') },
            dragEnd: function (event) { console.log('drag ended') }
        };

        $scope.DragOptions1 = {
            accept: function (sourceItemHandleScope, destSortableScope) { return true; },
            orderChanged: function (event) {
                // console.log(event.source.itemScope.activity.plan_activities.sectionId);
                // var sectionId = event.source.itemScope.activity.plan_activities.sectionId;
                // updateActivityIndex(sectionId);
                // sortList(sectionId);
            },
            itemMoved: function (event) {
                console.log('item moved');
            },
            dragStart: function (event) { console.log('drag started') },
            dragEnd: function (event) { console.log('drag ended') }
        };

        $scope.backToAllCategories = function (){
            $scope.page3 = false;
            $scope.page2 = true;
        };

        $scope.backToAllCategoriesList = function (){
            $scope.page8 = false;
            $scope.page7 = true;
        };
        $scope.backToAllActivities = function () {
            $scope.page3 = true;
            $scope.page4 = false;
            $scope.page5 = false;
        };

        $scope.newAssignTask = function () {
            $scope.page3 = false;
            $scope.page4 = true;
        };
        $scope.selectedActivities = [];
        $scope.addTasks = function(){
            $scope.page2 = false;
            $scope.page3 = true;
            var selectedCategories = filterFilter($scope.allCategories, { 'selected': true });
            $scope.allActivities = [];
            angular.forEach(selectedCategories, function(selectedCategory){
                angular.forEach($scope.allActivitiesCopy, function(activityCopy){
                    if (activityCopy && activityCopy.task_list &&
                        activityCopy.task_list.all_category &&
                        activityCopy.task_list.all_category.id === selectedCategory.id){
                            $scope.allActivities.push(activityCopy);
                        }
                });
            });
            // $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
            $scope.search();
            $scope.select($scope.currentPage);
            if($scope.selectedActivities && $scope.selectedActivities.length <= 0){
                $scope.selectedActivities = [];
            }
            console.log($scope.allActivities);
        };

        $scope.addAgendaPoint = function(){
            $scope.page7 = false;
            $scope.page8 = true;
            var selectedCategories = filterFilter($scope.allCategories, { 'selected': true });
            $scope.allActivities = [];
            angular.forEach(selectedCategories, function(selectedCategory){
                angular.forEach($scope.allAgendaPoint, function(activityCopy){
                    if (activityCopy.allCategoryId === selectedCategory.id){
                            $scope.allActivities.push(activityCopy);
                        }
                });
            });
            // $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
            $scope.search();
            $scope.select($scope.currentPage);
            if($scope.selectedActivities && $scope.selectedActivities.length <= 0){
                $scope.selectedActivities = [];
            }
            console.log($scope.allActivities);
        };

        $scope.selectedActivity=function(selectedActivity,sel){
            console.log("dskfhskldfj");
            $scope.selectedActivity = selectedActivity;
            console.log('333333333333333333',$scope.selectedActivity.id)
            if(sel == true){
                console.log(selectedActivity);
                $scope.selectedActivities.push(selectedActivity);
            }else{
                var ind = $scope.selectedActivities.indexOf(selectedActivity);
                $scope.selectedActivities.splice(ind,1);
            }

            //  var selectedCategories = filterFilter($scope.allCategories, { 'selected': true });
            // $scope.allActivities = [];
            // angular.forEach(selectedCategories, function(selectedCategory){
            //     angular.forEach($scope.allActivitiesCopy, function(activityCopy){
            //         if (activityCopy && activityCopy.task_list &&
            //             activityCopy.task_list.all_category &&
            //             activityCopy.task_list.all_category.id === selectedCategory.id){
            //                 $scope.allActivities.push(activityCopy);
            //             }
            //     });
            // });
            // // $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
            // $scope.search();
            // $scope.select($scope.currentPage);

        };

        $scope.addSections = function () {
            // $scope.selectedActivities = filterFilter($scope.allActivities, { 'selected': true });
            angular.forEach($scope.selectedActivities, function(activity, index){
                activity.tindex = index;
                // $scope.selectedActivities.push(activity);
            });
            if ($scope.selectedActivities.length > 0){
              $scope.page3 = false;
              $scope.page5 = true;
            }
            else {
               toastr.error('Please select at least one assigned task', 'Error');
            }
        };

        $scope.newSection = function (){
          $scope.sectionData = '';
          $scope.page5 = false;
          $scope.page6 = true;
        };

        $scope.backBtn=function(){
            $scope.page1=true;
            $scope.page7=false;
        };
        $scope.previousScreen=function(){
            $scope.page1=true;
            $scope.page2=false;
        };
        $scope.backToSections = function() {
          $scope.page6 = false;
          $scope.page5 = true;
        };

        $scope.createNewSection = function() {
          if ($scope.sectionData.name === ''){
            toastr.error('Please provide section name');
          } else {
            SectionService.create1({name: $scope.sectionData.name, actionPlanId: $scope.data.id, activities: $scope.sectionData.tasks}).then(function(response){
                $scope.sections.unshift(response.data);
                $scope.sections[0].activities = response.data.activities;
                angular.forEach($scope.sectionData.tasks, function(task, index){
                    var ind = $scope.selectedActivities.indexOf(task);
                    $scope.selectedActivities.splice(ind, 1);
                });
                toastr.success('Section Created','Success');
                $scope.page6 = false;
                $scope.page5 = true;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/sections/create1', {name: $scope.sectionData.name, actionPlanId: $scope.data.id, activities: $scope.sectionData.tasks}).then(function (response) {
                
            // });
          }
        };

        $scope.assignSectionTasks = function(section) {
          section.activities = section.tasks;
          angular.forEach($scope.selectedActivities, function(selectedActivity, index){
            var filteredActivity = filterFilter(section.activities, {'id': selectedActivity.id})[0];
            if (filteredActivity){
              $scope.selectedActivities.splice(index, 1);
            }
          });
          section.addActivities = false;
        };

        $scope.changeSelectedList = function(task){
            console.log($scope.sectionData.tasks);
            console.log(task);
            // var index = $scope.selectedActivities.indexOf(task);
            // $scope.selectedActivities.splice(index, 1);

        }
        $scope.saveActionPlan = function() {
            console.log($scope.sections);
            var sectionId = null;
            // console.log("yehoi");
            // var selectedActivities = $scope.selectedActivities;
            var nextIndex = 0;
            var sectionId = null;
            console.log($scope.selectedActivities);
            SectionService.createDefault({actionPlanId: $scope.data.id}).then(function(sec){
                angular.forEach($scope.selectedActivities, function (activitySelected, index) {
                  var data = { activitySelected: activitySelected.id, actionPlanId: $scope.data.id, nextIndex: index, sectionId: sec.data.id };
                  ActionPlanService.assignActivity(data).then(function(response){
                    response.data = response.data.activity;
                        if ($scope.selectedActivities.length - index === 1) {
                            toastr.success('Tasks have been assigned', 'Success');
                              close();
                        }
                  },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                  });
                  // $http.post('/settings/action-plans/assign-activity', { data: data })
                  //     .then(function (response) {
                          
                  //   });
                });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/sections/create-default', {actionPlanId: $scope.data.id})
            // .then(function(sec){
                
            // });

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

        var validateActivity = function () {
            if (!$scope.activity.taskListId) {
                toastr.error('Activity Task is not selected.', 'Error!');
                return false;
            }
            return true;
        };

        $scope.createAssignTask = function () {

            $scope.activity.outcomes = [];
            // $scope.newTask = {}
            console.log("activity====>", $scope.activity);
            var data = { activity: $scope.activity };
            ActivityService.create(data).then(function(response){
                toastr.success("Assign Task created", 'Success!');
                console.log("response data",response.data);
                $scope.allActivities.push(response.data);
                $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
                $scope.search();
                $scope.select($scope.currentPage);
                $scope.activity = {};
                $scope.page3 = true;
                $scope.page4 = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/activities/create', { data: data }).then(function (response) {
                
            //     });

        };
        $scope.closeModal = function(){
            $('.modal-backdrop').remove();
            $('.modal-backdrop').remove();
            close(undefined);
          }

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
