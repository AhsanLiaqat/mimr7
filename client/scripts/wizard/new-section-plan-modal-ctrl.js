(function () {
    'use strict';

    angular.module('app')
    .controller('newSectionPlanModalCtrl', ['$scope', 'close', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'filterFilter','Query','ActivityService','IncidentTypeService','ScenarioService','RoleService','TagService','TaskService','ActionPlanService','DecisionService','PlanActivityService','SectionService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, $filter, AuthService, $location, ModalService, filterFilter,Query,ActivityService, IncidentTypeService, ScenarioService, RoleService, TagService, TaskService, ActionPlanService, DecisionService, PlanActivityService, SectionService) {
        $scope.loadScenario = function(id){
            $scope.scenarioOptions = []
            console.log($scope.scenarioOptionsAll);
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
            $scope.activities = [];

            IncidentTypeService.list().then(function(res){
                $scope.categories = res.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant,GENERAL_ERROR_MSG,'Custom Error')
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
                $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
                $scope.allActivities = [];
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
        $scope.orderp = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.allActivities = $filter('orderBy')($scope.allActivities, rowName);
        };

        // $scope.addActivity = function () {
        //     ModalService.showModal({
        //         templateUrl: "views/incidents/link-activity-modal.html",
        //         controller: "linkActivityModalCtrl",
        //         inputs: {
        //             userAccountId: $scope.user.userAccountId,
        //             actionPlanId: $scope.data.id
        //         }
        //     }).then(function (modal) {
        //         modal.element.modal({ backdrop: 'static', keyboard: false });
        //         modal.close.then(function (result) {
        //             $('.modal-backdrop').remove();
        //             $('body').removeClass('modal-open');
        //             if (result !== '' && typeof result !== 'undefined') {
        //                 $scope.activities.push(result);
        //                 sortList();
        //             }
        //         });
        //     });
        // };
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
                        angular.forEach(result, function (task) {
                            $scope.allActivities.push(task);
                        });
                    }
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
            // .then(function (response) {
                
            // });
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
            $scope.sections = [];
            if ($scope.data.name != null && data.plandate != null) {
                console.log($scope.data.categoryId)
                $scope.data.type = ($scope.data.categoryId)? Query.filter($scope.categories,{'id': $scope.data.categoryId},true).name : '';
                if (data.id === undefined) {
                    data.plandate = moment.utc(data.plandate, 'DD/MM/YYYY', true).format();
                    data.isComplete = false;
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

        var updateActivityIndex = function () {
            // console.log($scope.activities);
            angular.forEach($scope.selectedActivities, function (activity, index) {
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
            var ind = $scope.selectedActivities.indexOf(activity);
            $scope.selectedActivities.splice(ind, 1);
            var data = { activityId: activity.id, planId: $scope.data.id };
            PlanActivityService.removeActivity(data).then(function(response){
                toastr.success('activity deleted', 'Success');
                updateActivityIndex();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/plan-activities/remove-activity", data)
            // .then(function (response) {
                
            // });
        };

        $scope.deleteActivitySection = function (activity, index, section) {
            var ind = $scope.sections.indexOf(section);
            var ind1 = $scope.sections[ind].activities.indexOf(activity);
            if(section.default){
                $scope.sections[ind].activities.splice(ind1, 1);
                // $scope.selectedActivities.push($scope.sections[ind].activities[ind1]);
            }else {
                $scope.sections[ind].activities.splice(ind1, 1);
                $scope.selectedActivities.push($scope.sections[ind].activities[ind1]);
            }
            toastr.success('activity deleted', 'Success');
        };

        $scope.saveExit = function () {
            close($scope.data);
        };
        $scope.closeModal = function () {
            close(undefined);
        };


        $scope.DragOptions1 = {
            accept: function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            },
            orderChanged: function (event) {
                console.log($scope.sections);
                var sectionId = parseInt(event.source.itemScope.element[0].id);
                console.log("section id drag", sectionId);

                var ind = $scope.sections.map(function(el) {
                    return el.id;
                })
                console.log(ind);
                var ind = $scope.sections.map(function(el) {
                    return el.id;
                }).indexOf(sectionId);

                console.log(ind);
                console.log("after drag", $scope.sections[ind]);

                angular.forEach($scope.sections[ind].activities, function (section, index) {
                    $scope.sections[ind].activities[index].tindex = index;
                });


                console.log("after drag", $scope.sections[ind]);
            },
            itemMoved: function(event) {
                event.preventDefault();
                console.log('item moved');
            },
            dragStart: function(event) { console.log('drag started') },
            dragEnd: function(event) { console.log('drag ended') }
        };

        $scope.DragOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            },
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

        $scope.backToAllActivities = function () {
            $scope.page3 = true;
            $scope.page4 = false;
            $scope.page5 = false;
        };

        $scope.newAssignTask = function () {
            $scope.page3 = false;
            $scope.page4 = true;
        };

        $scope.addSections = function () {
            $scope.selectedActivities = [];
            ActionPlanService.sections($scope.data.id).then(function(response){
                $scope.sections = response.data;
                angular.forEach($scope.allActivities, function(activity, index){
                    activity.tindex = index;
                    $scope.selectedActivities.push(activity);
                });

                if ($scope.selectedActivities.length > 0){
                    $scope.page3 = false;
                    $scope.page5 = true;
                }
                else {
                    toastr.error('Please select at least one assigned task', 'Error');
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/action-plans/'+$scope.data.id+'/sections').then(function (response) {
                
            // });
        };

        $scope.newSection = function (){
            $scope.sectionName = '';
            $scope.page5 = false;
            $scope.page6 = true;
        };

        $scope.backToSections = function() {
            $scope.page6 = false;
            $scope.page5 = true;
        };

        $scope.createNewSection = function() {
            if ($scope.sectionName === ''){
                toastr.error('Please provide section name');
            } else {
                SectionService.create({name: $scope.sectionName, actionPlanId: $scope.data.id}).then(function(response){
                    $scope.sections.unshift(response.data);
                    $scope.sections[0].activities = [];
                    toastr.success('Section Created','Success');
                    $scope.page6 = false;
                    $scope.page5 = true;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/sections/create', {name: $scope.sectionName, actionPlanId: $scope.data.id}).then(function (response) {
                    
                // });
            }
        };

        $scope.assignSectionTasks = function(section) {
            for(var i=0 ;i<section.tasks.length;i++) {
                section.tasks[i].tindex = i;
                section.activities.push(section.tasks[i]);
            }
            console.log("on task add", section.activities,section.tasks);
            angular.forEach($scope.selectedActivities, function(selectedActivity, index){
                var filteredActivity = filterFilter(section.activities, {'id': selectedActivity.id})[0];
                // $scope.deleteActivity(filteredActivity, index);
                if (filteredActivity){
                    $scope.selectedActivities.splice(index, 1);
                }
            });
            section.addActivities = false;
        };

        $scope.saveActionPlan = function() {
            console.log($scope.sections);
            // console.log("yehoi");
//open it up 
            // var selectedActivities = $scope.selectedActivities;
            // var nextIndex = 0;
            // var sectionId = null;
            // $http.post('/settings/action-plans/update', { data: {id: $scope.data.id, isComplete: true} });
            // angular.forEach($scope.sections, function (section, index) {
            //     angular.forEach(section.activities, function (activitySelected) {
            //         var data = { activitySelected: activitySelected.id, actionPlanId: $scope.data.id, nextIndex: activitySelected.tindex, sectionId: section.id };
            //         $http.post('/settings/action-plans/assign-activity-section', { data: data })
            //         .then(function (response) {
            //             if ($scope.sections - index === 1) {
            //                 toastr.success('Tasks have been assigned', 'Success');
            //             }

            //         });
            //         // nextIndex = nextIndex + 1;
            //         //   sectionId = null;
            //     });
            // });
            close($scope.data);

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
                            var data = { activitySelected: response.data.id, actionPlanId: $scope.data.id, nextIndex: 0, sectionId: $scope.defaultSection.id };
                            ActionPlanService.assignActivity(data).then(function(response){
                                response.data = response.data.activity;
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/settings/action-plans/assign-activity', { data: data })
                            // .then(function (response) {
                                
                            // });

                            $scope.allActivities.push(response.data);
                            console.log($scope.allActivities);
                            $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post('/settings/activities/save', { data: data }).then(function (response) {
                            

                        // });
                    }
                });
            });
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
            $scope.allActivities = $filter('filter')($scope.allActivities, $scope.categoriesFilter);
            console.log($scope.allActivities);
        };

    }
}());
