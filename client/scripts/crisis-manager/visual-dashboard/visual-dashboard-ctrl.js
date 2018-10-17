
(function () {
    'use strict';

    angular.module('app')
    .controller('visualDashboardCtrl', ['$scope', '$http', '$rootScope', '$route', 'AuthService', '$routeParams', 'ModalService', '$location', '$timeout', 'filterFilter', '$filter', '$window','VisDataSet','Query','AccountService','CheckListService','ColorPaletteService','IncidentTeamService','LibraryService','IncidentPlanService','IncidentCheckListService','ClassService','MessageHistoryService','MessageService','ReportService','IncidentService', dashCtrl]);

    function dashCtrl($scope ,$http ,$rootScope ,$route,AuthService ,$routeParams,ModalService ,$location ,$timeout,filterFilter ,$filter ,$window,VisDataSet,Query, AccountService, CheckListService, ColorPaletteService, IncidentTeamService, LibraryService, IncidentPlanService, IncidentCheckListService, ClassService, MessageHistoryService, MessageService, ReportService, IncidentService) {
            //////////////// Sockets Work ////////////////////////

            $scope.user = Query.getCookie('user',true);
            var setSocketForIncomingMessages = function () {
                $timeout(function () {

                })
            }

            var setSocketForIncidentProperties = function(){
                $timeout(function () {

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
            $scope.options = {
               "align": "center",
               "autoResize": true,
               "editable": true,
               "selectable": true,
               "orientation": "bottom",
               "showCurrentTime": true,
               // "showCustomTime": false,
               "showMajorLabels": true,
               "showMinorLabels": true
              };

            function init() {

                $scope.classes = {};
                $scope.check = {};
                $scope.summaryPage = true;
                $scope.classes = [];
                $scope.msg = '';
                $scope.posArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                $scope.messagesStyle = {};
                $scope.priceSlider = 150;
                $scope.showTimeline = false;

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
                        } else if (Query.getCookie('incidentSelected',false) === undefined) {
                            $scope.incident = $scope.incidents[0];
                            $scope.selectIncident = false;
                            Query.setCookie('incidentSelected', JSON.stringify($scope.incident));
                        } else if (Query.getCookie('incidentSelected',false) !== undefined) {
                            var incident = Query.getCookie('incidentSelected',false);
                            var selectedIncident = filterFilter($scope.incidents, { 'id': incident.id });
                            $scope.incident = selectedIncident[0];
                            Query.setCookie('incidentSelected', JSON.stringify($scope.incident));
                        }

                        if ($scope.incident) {
                            loadTimeline();
                            // loadClasses();
                            // loadIncomingMessages();
                            setSocketForIncomingMessages();
                            setSocketForIncidentProperties();

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
                        $scope.checkedList.push(result);
                        console.log($scope.checkedList);
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    }.bind($scope));
                }.bind($scope));
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

            $scope.DragOptionsIncome = {
                accept: function (sourceItemHandleScope, destSortableScope) { return true; },
                orderChanged: function (event) {
                    console.log('nhere');

                    var message = event.source.itemScope.item;
                    message.index = event.source.index;
                    var catID = event.dest.sortableScope.element[0].id
                    if (catID) {
                        var category = $scope.data.classes.find(function (cl) {
                            return cl.id == catID;
                        });
                        updateAfterDrag(message, category);
                        console.log(message, category)
                    }
                },
                itemMoved: function (event) {
                    var message = event.source.itemScope.item;
                    message.index = event.source.index;
                    var catID = event.dest.sortableScope.element[0].id;
                    if (catID) {
                        var category = filterFilter($scope.data.classes, {'id': catID})[0];
                        message.status = 'Copied';
                        MessageService.update(message).then(function(res){
                            var data = {
                                content: message.message,
                                status: true,
                                editorId: message.userId,
                                classId: category.id,
                                messageId: message.id,
                                incidentId: message.incidentId,
                                userId: message.userId
                            };
                            MessageHistoryService.incomeToHistory(data).then(function(res){
                                loadIncomingMessages();
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

            $scope.DragOptionsClass = {
                accept: function (sourceItemHandleScope, destSortableScope) { return true; },
                orderChanged: function (event) {
                    console.log('here');
                    var message = event.source.itemScope.item;
                    message.index = event.source.index;
                    var catID = event.dest.sortableScope.element[0].id
                    if (catID) {
                        var category = $scope.data.classes.find(function (cl) {
                            return cl.id == catID;
                        });
                        angular.forEach(category.messages, function(obj, ind) {
                            obj.index = ind;
                            $scope.updateMessage(obj,category);
                        });
                    }
                },
                itemMoved: function (event) {
                    var message = event.source.itemScope.item;
                    message.index = event.source.index;
                    var catID = event.dest.sortableScope.element[0].id
                    if (catID) {
                        var category = $scope.data.classes.find(function (cl) {
                            return cl.id == catID;
                        });
                        angular.forEach(category.messages, function(obj, ind) {
                            obj.index = ind;
                            obj.classId = category.id;
                            $scope.updateMessage(obj,category);
                        });
                    }else{
                        //from cat to incom
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
                    // loadClasses();
                    loadTimeline();
                    // loadIncomingMessages();
                    setSocketForIncomingMessages();
                    setSocketForIncidentProperties();
                }
            };
            function loadTimeline(){
                if ($scope.incident.id !== undefined) {
                    ClassService.all($scope.incident.id).then(function(response){
                        $scope.data = response.data;
                        $scope.Class = response.data;
                        $scope.classes = _.object(_.map($scope.data.classes, function (item) {
                            item.show = true;
                            return [item.id, item]
                        }));
                        var cat_classes = [];
                        var cat_messages = [];
                        angular.forEach($scope.classes, function(c, index){
                            if(c.messages.length > 0){
                                c.messages = _.sortBy(c.messages, function (o) { return o.index });
                                angular.forEach(c.messages, function(m, index1){
                                    $scope.classes[index].messages[index1].showFilter = true;
                                    cat_messages.push({
                                        id: m.id,
                                        group: m.classId,
                                        content: m.content,
                                        start: new Date(m.createdAt),
                                        type: 'point'
                                    });
                                });
                            }
                            cat_classes.push({
                                id: c.id,
                                content: c.title,
                                value: c.index
                            })
                        });
                        MessageService.incoming($scope.incident.id).then(function(response){
                            cat_classes.push({
                                id: "23bc77ed-ba2f-4f38-8581-000000000000",
                                content: 'Incoming Messages',
                                value: 0
                            })
                            $scope.messages = response.data;
                            $scope.sortByCreate = _.sortBy($scope.messages, function (o) { return new Date(o.createdAt); });
                            $scope.messages = $scope.sortByCreate.reverse();
                            angular.forEach($scope.messages, function(m, index1){
                                cat_messages.push({
                                    id: m.id,
                                    group: "23bc77ed-ba2f-4f38-8581-000000000000",
                                    content: m.message,
                                    start: new Date(m.createdAt),
                                    type: 'point'
                                });
                            });
                            console.log("Incoming messages =====>", $scope.messages);
                            var groups = VisDataSet(cat_classes);
                            var items = VisDataSet(cat_messages);
                            $scope.timelineData = {groups: groups, items: items};
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // var query = '/messages/incoming/' + $scope.incident.id;
                        // $http.get(query).then(function (response) {

                        // });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // var path = '/class/all?incidentId=' + $scope.incident.id;
                    // $http.get(path).then(function (response) {

                    // });
                }else{
                    toastr.warning("No Incident Selected");
                }
            }

            // function loadClasses() {
            //     if($scope.incident){
            //         var path = '/class/all?incidentId=' + $scope.incident.id;
            //         $http.get(path).then(function (response) {
            //             $scope.data = response.data;
            //             $scope.Class = response.data;
            //             $scope.classes = _.object(_.map($scope.data.classes, function (item) {
            //                 item.show = true;
            //                 return [item.id, item]
            //             }));
            //             angular.forEach($scope.classes, function(c, index){
            //                 if(c.messages.length > 0){
            //                     c.messages = _.sortBy(c.messages, function (o) { return o.index });
            //                     angular.forEach(c.messages, function(m, index1){
            //                         $scope.classes[index].messages[index1].showFilter = true;
            //                     });
            //                 }
            //             });
            //         });
            //     }else{
            //         toastr.warning("No Incident Selected");
            //     }
            // }

            // function loadIncomingMessages() {
            //     if ($scope.incident !== undefined) {
            //         var query = '/messages/incoming/' + $scope.incident.id;
            //         $http.get(query).then(function (response) {
            //             $scope.messages = response.data;
            //             $scope.sortByCreate = _.sortBy($scope.messages, function (o) { return new Date(o.createdAt); });
            //             $scope.messages = $scope.sortByCreate.reverse();
            //             console.log("Incoming messages =====>", $scope.messages);

            //         });
            //     }
            // }

            $scope.onSelect = function (items) {
            };

            $scope.onClick = function (props) {
            };

            $scope.onDoubleClick = function (props) {
                // debugger;
                console.log('DoubleClick',props);
            };

            $scope.rightClick = function (props) {

                props.event.preventDefault();
            };


            $scope.events = {
                select: $scope.onSelect,
                click: $scope.onClick,
                doubleClick: $scope.onDoubleClick,
                contextmenu: $scope.rightClick
            };

            function isDateInArray(needle, haystack) {
              for (var i = 0; i < haystack.length; i++) {
                console.log(needle.toDateString())
                if (needle.toDateString() === haystack[i].toDateString()) {
                  return true;
                }
              }
              return false;
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

            $rootScope.$on("updateClassData", function (event, data) { // tick
                $scope.data.classes[data.index] = angular.copy(data)
            });

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
                $scope.layout.list = $scope.layout.list ? false : true;
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
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
                popupWin.document.close();
            }

            $scope.close = function () {
                // loadClasses();
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

            $scope.toggleInformationSize = function () {
                $scope.layout.zoomout = $scope.layout.zoomout ? false : true;
            };

            $scope.toggleZoomClass = function () {
                return $scope.layout.zoomout ? 'fa-search-plus' : 'fa-search-minus';
            };

            $scope.toggleInformationZoom = function () {
                return $scope.layout.zoomout ? 'col-zoom-out' : '';
            }
            if(Query.getCookie('message_toggle',false) != undefined){
                var mess_toggle = Query.getCookie('message_toggle',false)
            }else{
                var mess_toggle = true;
            }
            if(Query.getCookie('checklist_toggle',false) != undefined){
                var chk_toggle = Query.getCookie('checklist_toggle',false)
            }else{
                var chk_toggle = true;
            }
            $scope.layout = { // tick
                page: "flat",
                inbox: false,
                zoomout: false,
                list: false
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
                    toastr.success("checkList Task Updated");
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
                cls.summary = cls.summary + " " + msg.content;
                ClassService.update(cls).then(function(res){
                    var updatedClass = res.config.data.data;
                    $scope.$emit('updateClassData', updatedClass);
                    toastr.success("Summary updated successfully");
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
                    toastr.success("Category added successfully");
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
                    $scope.message = '';
                    data.userId = $scope.user.id;
                    MessageService.save(data).then(function(res){
                        $scope.msg = '';
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
            };

            $scope.summaryEditor = function(){ // tick

                $scope.summaryEditorPage = true;
                $scope.summaryPage = false;
                $scope.incident;
                ClassService.all($scope.incident.id).then(function(response){
                    $scope.classes = response.data;
                    $scope.status_report = '<h3>Incident: '  + $scope.incident.name + '</h3><h3>Report: ' + $filter('date')(new Date(), "HH:mm dd-MM-yyyy") + '</h3>';
                    $scope.status_report += '<h3>From: '  + $scope.user.firstName + ' ' + $scope.user.lastName + '</h3><br>';

                    for (var i = 0; i < $scope.classes.classes.length; i++) {
                        $scope.status_report += '<h2>' + $scope.classes.classes[i].title + '</h2> <p>' + $scope.classes.classes[i].summary + '</p>';
                        if($scope.check.detail){
                            if($scope.classes.classes[i].messages.length == 0 ){
                                // $scope.status_report += '<h3>No Messages.</h3><br>';
                            }else{
                                $scope.status_report += '<h3>Messages:</h3>';
                                angular.forEach($scope.classes.classes[i].messages, function(msg, index){
                                    $scope.status_report += '<p>'+ msg.content+'</p>';

                                });
                            }
                            $scope.status_report += '<br>';
                        }
                    }
                    if($scope.check.actionPlan){
                        var selectedPlan = '';
                        if($scope.incident.incident_plans.length > 0){
                            angular.forEach($scope.incident.incident_plans, function(plan, index){
                                if (plan.selected == true){
                                    selectedPlan = plan;
                                }
                            });
                            $scope.status_report += AbindMessages();
                        }else{
                            $scope.status_report += '<br><br><h2>Action Plan Report</h2>';
                            $scope.status_report += '<br>No Plan is Linked with this incident';
                        }
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = '/class/all?incidentId=' + $scope.incident.id;
                // //idhr iff lgana hay
                // $http.get(path).then(function (response) {

                // });


            };

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
                    var updatedClass = res.config.data.data
                    $scope.$emit('updateClassData', updatedClass);
                    toastr.success("Category updated successfully");
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
                    toastr.success("Category updated successfully");
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/class/update', { data: cls }).then(function (res) {

                //     // loadClasses();

                // });
            };

            $scope.deleteMessage = function (item, cls) { // tick
                MessageHistoryService.delete(item.id,cls.id).then(function(res){
                    toastr.success("Message deleted successfully");
                    var idx = cls.messages.indexOf(item);
                    cls.messages.splice(idx, 1);
                    cls.messages.find(function (msg) {
                        if (msg && msg.index >= item.index) {
                            msg.index = msg.index - 1;
                            $scope.updateMessage(msg, cls);
                        }
                    });
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
                    toastr.success("Category removed successfully");
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

            $scope.newMessage = function (cls) { // tick
                if (cls.input) {
                    var data = {
                        content: cls.input,
                        incidentId: cls.incidentId,
                        classId: cls.id,
                        index: 0,
                        createAt: moment().utc().format(),
                        status: true
                    };
                    MessageHistoryService.save(data).then(function(res){
                        toastr.success("Message added successfully");
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
