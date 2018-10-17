(function () {
    'use strict';

    angular.module('app')
    .controller('planningDashboardCtrl', ['$q','$scope', '$http', '$rootScope', '$route', 'AuthService', '$routeParams', 'ModalService', '$location', '$timeout', 'filterFilter', '$filter', '$window','Query','AllCategoryService','ActivityService','TaskService','ActionPlanService','ClassService','MessageHistoryService','MessageService','PlanActivityService','SectionService','AgendaPointService', dashCtrl]);

    function dashCtrl($q,$scope ,$http ,$rootScope ,$route,AuthService ,$routeParams,ModalService ,$location ,$timeout,filterFilter ,$filter ,$window,Query, AllCategoryService, ActivityService, TaskService, ActionPlanService, ClassService, MessageHistoryService, MessageService, PlanActivityService, SectionService, AgendaPointService) {
        //Constants
        $scope.LAYOUT_KEY = 'selectedPalanningLayout';
        $scope.SECTION_VIEW = 'sectionView';
        $scope.CATEGORY_VIEW = 'categoryView';
		$scope.QUESTIONNAIRE_KEY = 'questionnaire_toggle';
        $scope.selectedCategory = {id:undefined,name:'All'};
        //////////////// Sockets Work ////////////////////////
        $scope.user = Query.getCookie('user');
        var setSocketForIncomingMessages = function () {
            $timeout(function () {
            })
        }
        var setSocketForIncidentProperties = function(){
            $timeout(function () {
            })
        }
        var setSocketForSectionProperties = function(actionPlanId,prev){
            $timeout(function () {
                if($scope.actionPlanId && actionPlanId != prev){
                    SOCKET.off('section_action_plan:' + actionPlanId, function (response) {});
                }          
                console.log('Listening ----> section_action_plan:'+actionPlanId);
                SOCKET.on('section_action_plan:' + actionPlanId, function (response) {
                    console.log('Game Recieved ----> section_action_plan:'+actionPlanId,response.data);
                    var data = response.data;
                    if(data){
                        switch (response.action) {
                            case 'delete':
                                angular.forEach($scope.sections, function(section,index){
                                    if(section.id == data){
                                        $scope.sections.splice(index, 1);
                                    }
                                })
                                break;
                            // case 1:
                            //     day = "Monday";
                            //     break;
                            
                        }
                    }else{
                        console.log('Recieved Nothing on ---> section_action_plan:'+actionPlanId);
                    }
                    $scope.$apply();
                });
            });
        }
        /////////////// End /////////////

        ////////////// Init Function //////////
        function init() {
            $scope.myHtml = '<h1>Hello World</h1>';
            $scope.classes = {};
            $scope.check = {};
            $scope.summaryPage = true;
            $scope.classes = [];
            $scope.msg = '';
            $scope.taskListStyle = {};
            $scope.showTimeline = false;
            $scope.taskCategory = 0;
            $scope.layout1 = true;
            $scope.sections = [];
			$scope.layout ={page:'flat'};

			$http.get("/dynamic-form/get?formType=Planning Questionnaire").then(function(response){
				$scope.questionnaires = response.data;
			})

            loadActionPlan();

            console.log('Layout',Query.getCookie($scope.LAYOUT_KEY,false));
            if(Query.getCookie($scope.LAYOUT_KEY,false) == $scope.SECTION_VIEW){
                $scope.layout1 = true;
                loadCategories();
                loadTaskLibrary();
            }else if(Query.getCookie($scope.LAYOUT_KEY,false) == $scope.CATEGORY_VIEW) {
                loadTaskByCategories();
                $scope.layout1 = false;
            }else {
                Query.setCookie($scope.LAYOUT_KEY,$scope.SECTION_VIEW);
                $scope.layout1 = true;
                loadCategories();
                loadTaskLibrary();
            }
			if(Query.getCookie($scope.QUESTIONNAIRE_KEY,false)){
                $scope.layout.questionnaire = true;
            }else {
            	$scope.layout.questionnaire = false
            }

        }
        ///////////// End /////////////////////////////////////////////

        /////////// All Modal Fucntions /////////////////////////////////////
        $scope.viewSection = function (section) { // tick
            ModalService.showModal({
                templateUrl: "views/crisis-manager/planning-dashboard/section-view.html",
                controller: "sectionViewCtrl",
                inputs: {
                    section: section
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.changeActionPlan($scope.actionPlanId)
                });
            });
        };
        /////////// End Modal Functions /////////////////////////////////////

        //////////// Drag Functionality ///////////////
        var updateAfterDrag = function (message, category) {
            if (!category.messages) {
                category.messages = [];
            }
            if (message.message) {
                message.content = message.message;
                var time = message.createdAt;
                message.createdAt = time;
                ClassService.newMessage({
                    class_id: category.id,
                    incident_id: $scope.incident.id,
                    msg: message
                }).then(function(res){
                    toastr.success("Message moved successfully");
                    message = res.data;
                    // loadClasses();
                    var filteredMessage = filterFilter(category.messages, {'message': message.message})[0];
                    if (filteredMessage){
                        angular.forEach(category.messages, function(msg){
                            if (msg && msg.id !== filteredMessage.id && msg.index >= filteredMessage.index && msg.status !== "Incoming" ){
                                msg.index = msg.index + 1;
                                $scope.updateMessage(msg, category);
                            }
                        })
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/class/new-message", {
                //     class_id: category.id,
                //     incident_id: $scope.incident.id,
                //     msg: message
                // }).then(function (res) {

                // });
            } else {
                message.classId = category.id;
                $scope.updateMessage(message, category);
                category.messages.find(function (msg) {
                    if (msg && msg.id !== message.id && msg.index >= message.index) {
                        msg.index = msg.index + 1;
                        $scope.updateMessage(msg, category);
                    }
                });
            }
        };
		$scope.fillUpForm = function(form) {
            ModalService.showModal({
                templateUrl: "views/dynamic-form/view.html",
                controller: "dynamicFormViewCtrl",
                inputs : {
                    sender: $scope.user,
                    record: 'user',
                    dynamicForm: form,
                    detailed : true,
					tableInfo: {
						tableId: $scope.actionPlanId,
						tableName: AppConstant.ACTION_PLAN_TABLE_NAME,
						dynamicFormId:form.id
					}
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    // init();
                });
            });
        };

        $scope.DragOptionsTaskList = {
            accept: function (sourceItemHandleScope, destSortableScope) { return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id; },
            orderChanged: function (event) {

            },
            itemMoved: function (event) {
                var task = event.source.itemScope.item;
                task.index = event.source.index;
                var sectionId = event.dest.sortableScope.element[0].id;
                if (sectionId) {
                    var section = $scope.sections.find(function (cl) {
                        return cl.id == sectionId;
                    });
                    var nextIndex = event.dest.index;
                    event.dest.sortableScope.removeItem(event.dest.index);
                    event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
                    var found = section.plan_activities.find(function (cl) {
                        return cl.activity.task_list.id == task.id;
                    });
                    if(found){
                        toastr.warning('Task Already associated in this Section '+section.name,'Warning')
                    }else{
                        var activity= {
                            userAccountId: $scope.user.userAccountId,
                            taskListId: task.id,
                            response_time: 0,
                            completion_time: 0
                        }
                        var act = {activity: activity,outcomes: []};
                        ActivityService.create(act).then(function(resp){
                            var plan = { activitySelected: resp.data.id, actionPlanId: $scope.actionPlan.id, nextIndex: nextIndex, sectionId: section.id };
                            ActionPlanService.assignActivity(plan).then(function(respp){
                                toastr.success('Task Added','Success');
                                var newActivity = {
                                    default:false,
                                    id:respp.data.planActivity.id,
                                    index:nextIndex,
                                    tindex:nextIndex,
                                    activity:{
                                        id:respp.data.activity.id,
                                        name:respp.data.activity.name,
                                        task_list:{
                                            id:respp.data.activity.taskListId,
                                            title:respp.data.activity.task_list.title
                                        }
                                    }
                                }
                                section.plan_activities.splice(nextIndex, 0, newActivity);
                                $scope.planActivities.push(newActivity);
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/settings/action-plans/assign-activity', { data: plan })
                            // .then(function (respp) {

                            // });
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post('/settings/activities/create',{data: act}).then(function(resp){

                        // })
                    }
                } else {
                    console.log('---------',there);

                    // event.source.sortableScope.removeItem(event.source.index);
                    event.source.itemScope.item.message = event.source.itemScope.item.content;
                    event.dest.sortableScope.insertItem(event.source.itemScope.item);
                    // $http.post('/message-history/remove', { id: message.id }).then(function (res) {
                    //     var msg =  $scope.makeIncommingPayload(event.source.itemScope.item);
                    //     $scope.ToIncommingMessage(msg);
                    //     toastr.success("added to incomming");
                    // });
                }
            },
            dragStart: function (event) { console.log('drag started')},
            dragEnd: function (event) { console.log('drag ended');}
        };
        $scope.DragOptionsSection = {
            accept: function (sourceItemHandleScope, destSortableScope) { return true; },
            orderChanged: function (event) {
                var secID = event.dest.sortableScope.element[0].id
                if (secID) {
                    var section = $scope.sections.find(function (cl) {
                        return cl.id == secID;
                    });
                    angular.forEach(section.plan_activities, function(obj, ind) {
                        var object ={id : obj.id, tindex: ind};
                        obj.tindex = ind;
                        PlanActivityService.update(object).then(function(res){

                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post('/plan-activities/update', object ).then(function (res) {
                        // });
                    });
                }
            },
            itemMoved: function (event) {
                var activity = event.source.itemScope.item;
                var sectionId = event.dest.sortableScope.element[0].id
                if (sectionId) {
                    var object ={id : activity.id, sectionId: sectionId};
                    PlanActivityService.update(object).then(function(res){
                        var section = $scope.sections.find(function (cl) {
                            return cl.id == sectionId;
                        });
                        angular.forEach(section.plan_activities, function(obj, ind) {
                            var object ={id : obj.id, tindex: ind};
                            obj.tindex = ind;
                            PlanActivityService.update(object).then(function(res){

                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/plan-activities/update', object ).then(function (res) {
                            // });
                        });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/plan-activities/update', object ).then(function (res) {

                    // });
                }else{
                    //from cat to incom
                    event.source.itemScope.item.message = event.source.itemScope.item.content;
                    MessageHistoryService.delete(message.id,event.source.itemScope.item.classId).then(function(res){
                        var data ={
                            id: event.source.itemScope.item.messageId,
                            status: 'Incoming',
                            incidentId: event.source.itemScope.item.incidentId,
                            message: event.source.itemScope.item.message,
                            userId: event.source.itemScope.item.editorId
                        }
                        if(data.id){
                            MessageService.update(data).then(function(res){
                                loadIncomingMessages();
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
                                loadIncomingMessages();
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post("/messages/save", { data: data }).then(function (res) {

                            // });
                        }
                        toastr.success("Added to incomming");
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/message-history/remove', { id: message.id,clsId: event.source.itemScope.item.classId }).then(function (res) {

                    // });
                }
            },
            dragStart: function (event) { console.log('drag started') },
            dragEnd: function (event) { console.log('drag ended') }
        };
        $scope.DragOptionsActionPlanAgenda = {
            accept: function (sourceItemHandleScope, destSortableScope) { 
                if(sourceItemHandleScope.itemScope.item['activityId']){
                    return false;
                }else{
                    return sourceItemHandleScope.$parent.sortableScope != destSortableScope;
                }
            },
            orderChanged: function (event) {
                var secID = event.dest.sortableScope.element[0].id
                console.log(secID);
                // if (secID) {
                //     var section = $scope.sections.find(function (cl) {
                //         return cl.id == secID;
                //     });
                //     angular.forEach(section.plan_activities, function(obj, ind) {
                //         var object ={id : obj.id, tindex: ind};
                //         obj.tindex = ind;
                //         PlanActivityService.update(object).then(function(res){

                //         },function(err){
                //             if(err)
                //                 toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                //             else
                //                 toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                //         });
                //         // $http.post('/plan-activities/update', object ).then(function (res) {
                //         // });
                //     });
                // }
            },
            itemMoved: function (event) {
                var activity = event.source.itemScope.item;
                var sectionId = event.dest.sortableScope.element[0].id
                console.log(activity,sectionId)
                if (sectionId) {
                //     var object ={id : activity.id, sectionId: sectionId};
                //     PlanActivityService.update(object).then(function(res){
                //         var section = $scope.sections.find(function (cl) {
                //             return cl.id == sectionId;
                //         });
                //         angular.forEach(section.plan_activities, function(obj, ind) {
                //             var object ={id : obj.id, tindex: ind};
                //             obj.tindex = ind;
                //             PlanActivityService.update(object).then(function(res){

                //             },function(err){
                //                 if(err)
                //                     toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                //                 else
                //                     toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                //             });
                //             // $http.post('/plan-activities/update', object ).then(function (res) {
                //             // });
                //         });
                //     },function(err){
                //         if(err)
                //             toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                //         else
                //             toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                //     });
                  
                }else{
                    //from cat to incom
                    event.source.itemScope.item.message = event.source.itemScope.item.content;
                    console.log(event.source.itemScope.item.message)
                }
            },
            dragStart: function (event) { console.log('drag started') },
            dragEnd: function (event) { console.log('drag ended') }
        };
        $scope.DragOptionsAgendaPoint = {
            accept: function (sourceItemHandleScope, destSortableScope) { return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;},
            orderChanged: function (event) {
                var secID = event.dest.sortableScope.element[0].id
                console.log(secID);
                // if (secID) {
                //     var section = $scope.sections.find(function (cl) {
                //         return cl.id == secID;
                //     });
                //     angular.forEach(section.plan_activities, function(obj, ind) {
                //         var object ={id : obj.id, tindex: ind};
                //         obj.tindex = ind;
                //         PlanActivityService.update(object).then(function(res){

                //         },function(err){
                //             if(err)
                //                 toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                //             else
                //                 toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                //         });
                //         // $http.post('/plan-activities/update', object ).then(function (res) {
                //         // });
                //     });
                // }
            },
            itemMoved: function (event) {
                var agenda_point = event.source.itemScope.item;
                var index = event.dest.index;
                event.dest.sortableScope.removeItem(event.dest.index);
                event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
                var found = false;
                angular.forEach($scope.actionPlan.agendaPoints, function(obj, ind) {
                    console.log(obj.id , agenda_point.id);
                    if(obj.id == agenda_point.id){
                        found = true; 
                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')  
                    }
                });
                if(!found){
                    ActionPlanService.saveAgendaPointList({data: $scope.actionPlanId,selected: [agenda_point.id]}).then(function(res){
                        toastr.success('Agenda point assigned.');
                        $scope.actionPlan.agendaPoints.splice( index, 0, agenda_point );
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                }
                // if (sectionId) {
                // //     var object ={id : activity.id, sectionId: sectionId};
                // //     PlanActivityService.update(object).then(function(res){
                // //         var section = $scope.sections.find(function (cl) {
                // //             return cl.id == sectionId;
                // //         });
                // //         angular.forEach(section.plan_activities, function(obj, ind) {
                // //             var object ={id : obj.id, tindex: ind};
                // //             obj.tindex = ind;
                // //             PlanActivityService.update(object).then(function(res){

                // //             },function(err){
                // //                 if(err)
                // //                     toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                // //                 else
                // //                     toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                // //             });
                // //             // $http.post('/plan-activities/update', object ).then(function (res) {
                // //             // });
                // //         });
                // //     },function(err){
                // //         if(err)
                // //             toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                // //         else
                // //             toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                // //     });
                  
                // }else{
                //     //from cat to incom
                //     event.source.itemScope.item.message = event.source.itemScope.item.content;
                //     console.log(event.source.itemScope.item.message)
                // }
            },
            dragStart: function (event) { console.log('drag started') },
            dragEnd: function (event) { console.log('drag ended') }
        };
        $scope.DragOptionsActionPlan = {
            accept: function (sourceItemHandleScope, destSortableScope) { return true; },
            orderChanged: function (event) {
                updateActivityIndex();
                $scope.planActivities = Query.sort($scope.planActivities, 'index', false, false);
            },
            itemMoved: function (event) {
                var task = event.source.itemScope.item;
                task.index = event.source.index;
                var sectionId = event.dest.sortableScope.element[0].id;
                if (sectionId) {
                    var section = $scope.sections.find(function (cl) {
                        return cl.default == true;
                    });
                    var nextIndex = event.dest.index;
                    event.dest.sortableScope.removeItem(event.dest.index);
                    event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
                    var found = section.plan_activities.find(function (cl) {
                        return cl.activity.task_list.id == task.id;
                    });
                    if(found){
                        toastr.warning('Task Already associated in this action Plan.','Warning')
                    }else{
                        var activity= {
                            userAccountId: $scope.user.userAccountId,
                            taskListId: task.id,
                            response_time: 0,
                            completion_time: 0
                        }
                        var act = {activity: activity,outcomes: []};
                        ActivityService.create(act).then(function(resp){
                            var plan = { activitySelected: resp.data.id, actionPlanId: $scope.actionPlan.id, nextIndex: nextIndex, sectionId: section.id };
                            ActionPlanService.assignActivity(plan).then(function(respp){
                                toastr.success('Task Added','Success');
                                var newActivity = {
                                    default:false,
                                    id:respp.data.planActivity.id,
                                    index:nextIndex,
                                    tindex:nextIndex,
                                    activity:{
                                        id:respp.data.activity.id,
                                        name:respp.data.activity.name,
                                        task_list:{
                                            id:respp.data.activity.taskListId,
                                            title:respp.data.activity.task_list.title
                                        }
                                    }
                                }
                                section.plan_activities.splice(nextIndex, 0, newActivity);
                                $scope.planActivities.push(newActivity);
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/settings/action-plans/assign-activity', { data: plan })
                            // .then(function (respp) {

                            // });
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post('/settings/activities/create',{data: act}).then(function(resp){

                        // })
                    }
                } else {
                    event.source.itemScope.item.message = event.source.itemScope.item.content;
                    event.dest.sortableScope.insertItem(event.source.itemScope.item);
                }
            },
            dragStart: function (event) { console.log('drag started')},
            dragEnd: function (event) { console.log('drag ended');}
        };

        $scope.DragOptionsCategory = {
            accept: function (sourceItemHandleScope, destSortableScope) { return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id; },
            orderChanged: function (event) {

            },
            itemMoved: function (event) {
                var activity = event.source.itemScope.item;
                var categoryId = event.dest.sortableScope.element[0].id
                if (categoryId) {
                    //from category to categpry
                    var object ={id : activity.id, sectionId: sectionId};
                    PlanActivityService.update(object).then(function(res){
                        var section = $scope.sections.find(function (cl) {
                            return cl.id == sectionId;
                        });
                        angular.forEach(section.plan_activities, function(obj, ind) {
                            var object ={id : obj.id, tindex: ind};
                            obj.tindex = ind;
                            PlanActivityService.update(object).then(function(res){

                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/plan-activities/update', object ).then(function (res) {
                            // });
                        });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/plan-activities/update', object ).then(function (res) {

                    // });
                }else{
                    //from cat to actionplan
                    var task = event.source.itemScope.item;
                    task.index = event.source.index;
                    var sectionId = event.dest.sortableScope.element[0].id;
                    if (sectionId) {

                    } else {
                        var section = $scope.sections.find(function (cl) {
                            return cl.default == true;
                        });
                        var nextIndex = event.dest.index;
                        event.dest.sortableScope.removeItem(event.dest.index);
                        event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
                        console.log($scope.planActivities);
                        var found = $scope.planActivities.find(function (activity) {
                            return activity.taskListId == task.id;
                        });
                        if(found){
                            toastr.warning('Task Already associated in this action Plan.','Warning')
                        }else{
                            var activity= {
                                userAccountId: $scope.user.userAccountId,
                                taskListId: task.id,
                                response_time: 0,
                                completion_time: 0
                            }
                            var act = {activity: activity,outcomes: []};
                            ActivityService.create(act).then(function(resp){
                                var plan = { activitySelected: resp.data.id, actionPlanId: $scope.actionPlan.id, nextIndex: nextIndex, sectionId: section.id };
                                ActionPlanService.assignActivity(plan).then(function(respp){
                              
                                    respp.data.activity.title = respp.data.activity.task_list.title
                                    var newActivity = respp.data.activity;
                                    console.log('new activity',respp.data);
                                    // section.plan_activities.splice(nextIndex, 0, newActivity);
                                    $scope.planActivities.push(newActivity);
                                    toastr.success('Task Added','Success');
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                // $http.post('/settings/action-plans/assign-activity', { data: plan })
                                // .then(function (respp) {

                                // });
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                        }
                    }
                }
            },
            dragStart: function (event) { console.log('drag started')},
            dragEnd: function (event) { console.log('drag ended');}
        };

        $scope.DragOptionsSection = {
            accept: function (sourceItemHandleScope, destSortableScope) { return true; },
            orderChanged: function (event) {
                var secID = event.dest.sortableScope.element[0].id
                if (secID) {
                    var section = $scope.sections.find(function (cl) {
                        return cl.id == secID;
                    });
                    angular.forEach(section.plan_activities, function(obj, ind) {
                        var object ={id : obj.id, tindex: ind};
                        obj.tindex = ind;
                        PlanActivityService.update(object).then(function(res){

                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post('/plan-activities/update', object ).then(function (res) {
                        // });
                    });
                }
            },
            itemMoved: function (event) {
                var activity = event.source.itemScope.item;
                var sectionId = event.dest.sortableScope.element[0].id
                if (sectionId) {
                    var object ={id : activity.id, sectionId: sectionId};
                    PlanActivityService.update(object).then(function(res){
                        var section = $scope.sections.find(function (cl) {
                            return cl.id == sectionId;
                        });
                        angular.forEach(section.plan_activities, function(obj, ind) {
                            var object ={id : obj.id, tindex: ind};
                            obj.tindex = ind;
                            PlanActivityService.update(object).then(function(res){

                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/plan-activities/update', object ).then(function (res) {
                            // });
                        });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/plan-activities/update', object ).then(function (res) {

                    // });
                }else{
                    //from cat to incom
                    event.source.itemScope.item.message = event.source.itemScope.item.content;
                    MessageHistoryService.delete(message.id,event.source.itemScope.item.classId).then(function(res){
                        var data ={
                            id: event.source.itemScope.item.messageId,
                            status: 'Incoming',
                            incidentId: event.source.itemScope.item.incidentId,
                            message: event.source.itemScope.item.message,
                            userId: event.source.itemScope.item.editorId
                        }
                        if(data.id){
                            MessageService.update(data).then(function(res){
                                loadIncomingMessages();
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
                                loadIncomingMessages();
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post("/messages/save", { data: data }).then(function (res) {

                            // });
                        }
                        toastr.success("Added to incomming");
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/message-history/remove', { id: message.id,clsId: event.source.itemScope.item.classId }).then(function (res) {

                    // });
                }
            },
            dragStart: function (event) { console.log('drag started') },
            dragEnd: function (event) { console.log('drag ended') }
        };

        //////////// End /////////////


        /////////// Main Functionality //////////////////////
        $scope.changeLayout = function(){
            $scope.layout1 = !$scope.layout1
            if($scope.layout1){
                Query.setCookie($scope.LAYOUT_KEY,$scope.SECTION_VIEW);
            }else {
                Query.setCookie($scope.LAYOUT_KEY,$scope.CATEGORY_VIEW);
            }
            init();
        }
        AgendaPointService.list($scope.user.userAccountId).then(function(response){
            $scope.agenda_points = response.data;
        },function(err){
            if(err)
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            else
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
        });

        

        AllCategoryService.list($scope.user.userAccountId).then(function(response){
            response.data.unshift({id:undefined,name:'All'})
            $scope.safeCategories = angular.copy(response.data)
            $scope.categories = response.data;
        },function(err){
            if(err)
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            else
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
        });

        $scope.changeCategory = function(category){
            $scope.selectedCategory = category;
            $scope.filterFromCat = { allCategoryId : category.id};
        }

        $scope.applyCategoryFilter = function(){
            console.log($scope.taskCategory);
            console.log($scope.safeTasklist);
            if($scope.taskCategory == 0)
            $scope.taskList = angular.copy($scope.safeTasklist);
            else
            $scope.taskList = Query.filter($scope.safeTasklist,{'categoryId': $scope.taskCategory},false);
        }
        $scope.changeActionPlan = function (id) {
            Query.setCookie('selectedActionPlanId',id);
            setSocketForSectionProperties(id,$scope.actionPlanId);
			$scope.actionPlanId = id;
            // if($scope.layout1){
            ActionPlanService.sections(id).then(function(response){
                $scope.actionPlan = $scope.action_plans_lookup.find(function (plan) {
                    return plan.id == id;
                });
                console.log('Section --------------->',response);
                $scope.sections = response.data;
                $scope.sections = Query.sort($scope.sections, 'index', false, false);
                angular.forEach($scope.sections, function(section){
                    section.plan_activities = Query.sort(section.plan_activities, 'tindex', false, false);
                });
                $scope.defaultSection = $scope.sections.find(function (plan) {
                    return plan.default == true;
                });
                ActionPlanService.getAgendaPoints($scope.actionPlanId).then(function(response){
                    if(response.data)$scope.actionPlan.agendaPoints = response.data.agendaPoints;
                    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%',$scope.actionPlan.agendaPoints)
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
            // $http.get('/settings/action-plans/'+id+'/sections').then(function (response) {

            // })
            // }

            ActionPlanService.activities(id).then(function(response){
                console.log('plan Activities --------------->',response);
                $scope.planActivities = response.data;
                $scope.planActivities = Query.sort($scope.planActivities, 'index', false, false);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/action-plans/activities?actionPlanId='+id).then(function (response) {

            // });
        };
        $scope.updateSection = function (section,index) { // tick
            SectionService.updateForEdit(section).then(function(res){
                console.log(res);
                section.edit = false;
                section.ex = false;
                var updatedSection = res.data
                $scope.$emit('updateSectionData', updatedSection,index);
                toastr.success("Category updated successfully");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/sections/update-for-edit', section ).then(function (res) {

            // });
        };
        var delSection = function(id){
            SectionService.delete(id).then(function(response){
                if (response.data.success) {
                    toastr.success('Section Deleted', 'Success!');
                }else {
                    toastr.error('while deleting section', 'Error!');
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
        }

        $scope.deleteSection = function(section,index){
            var indexxx = $scope.defaultSection.plan_activities.length;
            if(section.plan_activities.length > 0){
                angular.forEach(section.plan_activities, function(obj, ind) {
                    var object = {id : obj.id, tindex: angular.copy(indexxx),index: angular.copy(indexxx), sectionId: $scope.defaultSection.id};
                    indexxx++;
                    PlanActivityService.update(object).then(function(res){
                            $scope.defaultSection.plan_activities.push(obj);
                            $scope.defaultSection.activities.push(obj.id);
                        if(ind == section.plan_activities.length -1){
                            delSection(section.id);
                        }
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/plan-activities/update', object ).then(function (res) {
                    // });
                });
            }else{
                delSection(section.id);
            }
            // $http.delete("/sections/delete/" + section.id).then(function(response) {

            // }, function(error) {
            //     toastr.error(error, 'Error!');
            // })
        }
        $scope.taskInfo = function (activity) {
            console.log(activity);
            ModalService.showModal({
                templateUrl: "views/actionPlanDashboard/task-info-modal.html",
                controller: "taskInfoModalCtrl",
                inputs: {
                    activity: activity,
                    showEditButton: true
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result){
                        $scope.changeActionPlan($scope.actionPlanId)
                    }
                });
            });
        };
        $scope.deleteActivity = function(activity,section,index){
            console.log('for delete',activity);
            var data = {
                actionPlanId: $scope.actionPlanId,
                activityId:activity.id,
                sectionId:section.id
            }
            console.log('Deteletion',data);
            ActionPlanService.deleteAssignedActivity(data).then(function(response){
                console.log('delete status--------------->',response);
                if(response.data.success){
                    section.plan_activities.splice(index,1);
                    toastr.success('Plan activity deleted!','Success');
                }else {
                    toastr.error('while deleting activity','Error');
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/action-plans/delete-assigned-activity',{data:data}).then(function (response) {

            // });
        }
        $scope.editTask = function(task) {
            ModalService.showModal({
                templateUrl: "views/settings/task-libraries/form.html",
                controller: "editTaskWizardCtrl",
                inputs: {
                    Task : task
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result && result !== ''){
                        init();
                    }
                });
            });
        };
        $scope.editActivity = function (activity, index) {
            ModalService.showModal({
                templateUrl: "views/settings/activities/edit.html",
                controller: "editActivityModalCtrl",
                inputs: {
                    activity: activity,
                    tasks: $scope.taskList
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result !== '' && typeof result !== 'undefined'){
                        init();
                    }
                });
            });
        };
        function loadCategories() {
            AllCategoryService.list($scope.user.userAccountId).then(function(response){
                response.data.unshift({id:0,name:'All'})
                $scope.safeCategories = angular.copy(response.data)
                $scope.categories = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/all-categories/list?accountId=" + $scope.user.userAccountId).then(function(response) {

            // });
        }
        function loadTaskLibrary() {
            var defer = $q.defer()
            TaskService.all($scope.user.userAccountId).then(function(response){
                console.log("Task Lib =====>", response);
                $scope.taskList = response.data;
                $scope.sortByCreate = _.sortBy($scope.taskList, function (o) { return new Date(o.title); });
                $scope.safeTasklist = angular.copy($scope.taskList);
                defer.resolve($scope.taskList);
            },function(err){

                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    defer.reject(err);
            });
            // var query = "/settings/tasks/all?userAccountId=" + $scope.user.userAccountId;
            // $http.get(query).then(function (response) {

            // },function(err){

            // });
            return defer.promise;
        }
        function loadActionPlan() {
            ActionPlanService.lookUp($scope.user.userAccountId).then(function(response){
                $scope.action_plans_lookup = filterFilter(response.data, { 'active': true });
                console.log("Action plans =====>", $scope.action_plans_lookup);
                $scope.actionPlanId = $scope.action_plans_lookup[0].id;
                if(Query.getCookie('selectedActionPlanId',false)){
                    $scope.actionPlanId = Query.getCookie('selectedActionPlanId',false);
                }else {
                    Query.setCookie('selectedActionPlanId',$scope.actionPlanId)
                }
                $scope.changeActionPlan($scope.actionPlanId)
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var query = "/settings/action-plans/lookup?userAccountId=" + $scope.user.userAccountId;
            // $http.get(query).then(function (response) {

            // });
        }
        function loadTaskByCategories(){
            AllCategoryService.listWithTask($scope.user.userAccountId).then(function(response){
                // response.data.push({id:0,name:'others'})
                var other = {
                    id:0,
                    name:'Other Task',
                    task_lists: []
                }
                loadTaskLibrary().then(function(tasks){
                    tasks.forEach(function(task){
                        if(task.categoryId == null)
                        other.task_lists.push(task)
                    });
                    response.data.push(other)
                    $scope.safeCategoriesWithTask = angular.copy(response.data)
                    response.data = Query.sort(response.data, 'position', false, false);
                    $scope.categoriesWithTask = response.data;
                    console.log($scope.categoriesWithTask);
                })
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/all-categories/list-with-tasks?userAccountId=" + $scope.user.userAccountId).then(function(response) {

            // });
        }
        $scope.createActionPlan = function () {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/planning-dashboard/new-action-plan.html",
                controller: "newPlanModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.action_plans_lookup.unshift(result);
                        $scope.changeActionPlan(result.id)
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.addCategory = function() {
            if($scope.categoryName != ''){
                var maxIndex = Math.max.apply(Math,$scope.categoriesWithTask.map(function(item){return item.position;})) + 1;
                var data = {
                    name:$scope.categoryName,
                    position:maxIndex
                }
                AllCategoryService.create(data).then(function(response){
                    toastr.success("Category created successfully!");
                    response.data.taskList = []
                    $scope.categoriesWithTask.push(response.data)
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/all-categories/save', {data: data}).then(function(response) {


                // });
            }else {
                toastr.error("Please fill the required fields!");
            }
        }
        $rootScope.$on("updateSectionData", function (event, data,index) { // tick
            $scope.sections[index] = angular.copy(data)
            console.log($scope.sections);
        });
        $scope.closeCategoryForm = function () { // tick
            $('[data-toggle="dropdown"]').parent().removeClass('open');
        };
        $scope.toggleTaskList = function () { // tick
            $scope.layout.taskList = $scope.layout.taskList ? false : true;
            Query.setCookie('taskList_toggle', $scope.layout.taskList);
        };
		$scope.toggleQuestionnaire = function () { // tick
            $scope.layout.questionnaire = $scope.layout.questionnaire ? false : true;
            Query.setCookie($scope.QUESTIONNAIRE_KEY, $scope.layout.questionnaire);
        };
        $scope.toggleTimeline = function () { // tick
            if($scope.incident){
                $scope.showTimeline = $scope.showTimeline ? false : true;
                loadClasses();
            }else{
                toastr.warning("No Incident Selected");
            }
        };
        $scope.toggleTaskListSection = function () {
            return $scope.layout.taskList ? 'col-lg-9' : 'col-lg-12 toggle-padding-information';
        };
        $scope.addActivityInSection = function (msg,section) {
            if(!$scope.layout1){
                var section = $scope.sections.find(function (cl) {
                    return cl.default == true;
                });
            }

            var nextIndex = Math.max.apply(Math,$scope.planActivities.map(function(item){return item.index;})) + 1;
            console.log('sadasd',msg);
            // $scope.msg = ''
            var data = {
                title: msg,
                for_template: false,
                categoryId: $scope.layout1? $scope.taskCategory: 0,
                userAccountId: $scope.user.userAccountId
            };
            if(data.categoryId == 0)
            delete data.categoryId;
            TaskService.save(data).then(function(response){
                var activity= {
                    userAccountId: $scope.user.userAccountId,
                    taskListId: response.data.id,
                    response_time: 0,
                    completion_time: 0
                }
                var act = {activity: activity,outcomes: []};
                ActivityService.create(act).then(function(resp){
                    var plan = { activitySelected: resp.data.id, actionPlanId: $scope.actionPlanId, nextIndex: nextIndex, sectionId: section.id };
                    ActionPlanService.assignActivity(plan).then(function(respp){
                        toastr.success('Task Added','Success');
                        console.log('task respo',respp.data,'older tsk',section.plan_activities[0]);
                        var newActivity = {
                            default:false,
                            id:respp.data.planActivity.id,
                            index:nextIndex,
                            tindex:nextIndex,
                            activity:{
                                id:respp.data.activity.id,
                                name:respp.data.activity.name,
                                task_list:{
                                    id:respp.data.activity.taskListId,
                                    title:respp.data.activity.task_list.title
                                }
                            }
                        }
                        if(!$scope.layout1){
                            respp.data.activity.title = respp.data.activity.task_list.title
                            $scope.planActivities.push(respp.data.activity);
                            $scope.categoriesWithTask[$scope.categoriesWithTask.length-1].task_lists.push(response.data)
                        }
                        section.plan_activities.push(newActivity);
                        $scope.safeTasklist.push(response.data)
                        $scope.taskList.push(respp.data.activity.task_list)
                        angular.element('#section_'+section.id).scope().msg = '';
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/assign-activity', { data: plan })
                    // .then(function (respp) {

                    // });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/activities/create',{data: act}).then(function(resp){


                // })
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/tasks/save',{data: data}).then(function(response){

            // })
        };
        $scope.close = function () {
            loadClasses();
        };
        $scope.AllCategoryExist = function() { // tick
            if ($scope.all_categories && $scope.all_categories.length == 0){
                return false;
            }else{
                return true;
            }
        };
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
        $scope.toggleInformationZoom = function () {
            return $scope.layout.zoomout ? 'col-zoom-out' : '';
        }
        if(Query.getCookie('taskList_toggle') != undefined){
            var task_toggle = Query.getCookie('taskList_toggle')
        } else {
            var task_toggle = true;
        }
        $scope.layout = { // tick
            page: "flat",
            taskList: task_toggle,
            zoomout: false,
            list: true
        };
        /////////// End Static Functions //////////////////////////////////////

        /////////// Api Functions and Custom functions /////////////////////
        $scope.createSection = function(name) {
            var maxIndex = Math.max.apply(Math,$scope.sections.map(function(item){return item.index;})) + 1;
            SectionService.create({name: name, index: maxIndex, actionPlanId: $scope.actionPlan.id}).then(function(response){
                response.data.plan_activities = [];
                $scope.sections.push(response.data)
                $scope.closeCategoryForm();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/sections/create', {name: name, index: maxIndex, actionPlanId: $scope.actionPlan.id}).then(function (response) {

            // });
        };
        /////////// End /////////////////////

        /////////// Category Box Functionality //////////
        $scope.editItem = function (item, evt) { // tick
            item.edit = true;
            item._content = item.content;
        };
        $scope.cancelEditItem = function (item, evt) { // tick
            item.content = item._content;
            item.edit = false;
        };
        $scope.editSection = function (item, evt) { // tick
            item._title = item.title;
            item.edit = true;
        };
        $scope.cancelEditSection = function (item, evt) { // tick
            item.title = item._title;
            item.edit = false;
        };
        $scope.closeEditSection = function (item, evt) { // tick
            item.title = item._title;
            item.edit = false;
        };
        $scope.saveAgendaTask = function(task,agendaPoint){
            var data = {
                userAccountId: $scope.user.userAccountId,
                title: task
            }
            TaskService.save(data).then(function(response){
                var toData = {
                    taskListId: response.data.id,
                }
                ActivityService.create({activity: toData}).then(function(res){
                    $scope.activityId = res.data.id;
                    var toAgendaActivity = {
                        activityId : $scope.activityId,
                        agendaPointId: agendaPoint.id
                    }
                    $http.post('/settings/agenda-activities/save',{data: toAgendaActivity}).then(function(respp){
                        agendaPoint.agenda_activities.push(respp.data);

                    });
                });
            });
            $('.removeActivity').val('');
        }

        $scope.saveAgendaPoint = function(agendaPoint){

            var data = {
                userAccountId : $scope.user.userAccountId,
                name : agendaPoint,
                allCategoryId: ($scope.selectedCategory.id)? $scope.selectedCategory.id: null
            }
            AgendaPointService.save(data).then(function(response){
                $scope.agendaPoint = '';
                $scope.agenda_points.push(response.data);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstan.GENERAL_ERROR_MSG,'Custom Error')
            });
        }
        $scope.saveTask = function(task,categoryId,index){
            console.log(task,categoryId,index);
            if(!$scope.layout1)
            $scope.taskCategory = categoryId
            var data = {
                title: task,
                for_template: false,
                userAccountId: $scope.user.userAccountId,
                categoryId: $scope.taskCategory
            };
            if(data.categoryId == 0)
            delete data.categoryId;
            TaskService.save(data).then(function(response){
                $scope.taskList.push(response.data)
                $scope.safeTasklist.push(response.data)
                $scope.categoryTask = '';
                toastr.success('Task added in Category','Success')

                if(!$scope.layout1){
                    $scope.safeCategoriesWithTask[index].task_lists.push(response.data)
                    $scope.categoriesWithTask[index].task_lists.push(response.data)
                    // angular.element('#category_'+categoryId).scope().task_lists.push(response.data)
                    angular.element('#category_'+categoryId).scope().categoryTask = '';
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/tasks/save',{data: data}).then(function(response){

            // });
        }
        /////////// End  //////////
        init();
    }
}());
