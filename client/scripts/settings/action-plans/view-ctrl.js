(function () {
    'use strict';

    angular.module('app')
    .controller('viewActionPlanModalCtrl', ['$q','$scope', 'close', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'planId', 'filterFilter','Query','ActionPlanService','$timeout', ctrlFunction]);

    function ctrlFunction($q,$scope, close, $routeParams, $http, $filter, AuthService, $location, ModalService, planId, filterFilter,Query, ActionPlanService,$timeout) {
        var sortList = function () {
            $scope.activities = _.sortBy($scope.activities, function (activity) { return activity.index; });
        };

        function setDateFormat(planDate) {
            return moment.utc(planDate).format('DD-MM-YYYY');
        }
        var setSocketForActionPlan = function () {
            $timeout(function () {
                console.log("Socket set for action_plan:" + $scope.user.userAccountId);
                SOCKET.on('action_plan:' + $scope.user.userAccountId, function (response) {
                    console.log("listening sockets....",response);
                    var data = response.data;
                    if(response.action == "new"){
                        console.log("incident_plan_activity new",data);
                        $scope.plans.push(data);
                        get_plans_ready();
                        toastr.success("New Plan Added.");
                    }else if(response.action == "delete"){
                        console.log("incident_plan_activity delete",data);
                    }else if(response.action == "update"){
                        
                    }
                    else {
                        toastr.error("Something went wrong!");
                        console.log("incoming_message --> does not match any action incident_plan_activity socket.",response);
                    }
                    $scope.$apply();
                });
            })
        }
        
        
        $scope.userStatusImg = function (actor) {
            return (actor && actor.available) ? '../images/user-available.png' : '../images/user-unavailable.png';
        };
        $scope.displayActorName = function (actor) {
            return actor ? (actor.firstNam + ' ' + actor.lastName) : 'N/A';
        };
        var fetchPlan = function (planId) {
            ActionPlanService.get(planId).then(function(response){
                $scope.data = response.data;
                $scope.data.plandate = $scope.data.plandate ? setDateFormat($scope.data.plandate) : false;
                if($scope.data.kind == 'agendaPoints'){
                    ActionPlanService.getAgendaPoints($scope.data.id).then(function(response){
                        $scope.agendaList = response.data;
                        $scope.agenda = $scope.agendaList.agendaPoints;
                        $scope.agendapoints = [];
                        angular.forEach($scope.agenda, function(value, key) {
                            $scope.agendapoints.push(value);
                        });
                        sortList();
                        $scope.page1 = false;
                        $scope.page2 = false;
                        $scope.page3 = true;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    
                }else{
                    ActionPlanService.activities($scope.data.id).then(function(response){
                        $scope.activities = response.data;
                        sortList();
                        $scope.page1 = false;
                        $scope.page2 = true;
                        $scope.page3 = false;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get("/settings/action-plans/activities?actionPlanId=" + $scope.data.id)
                    // .then(function (response) {
                        
                    // });
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/action-plans/get?id=' + planId)
            // .then(function (response) {
                
            // });
        }
        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.plans = $filter('orderBy')($scope.plans, rowName);
        };
        var get_plans_ready = function(){
            $scope.plans = filterFilter($scope.plans, { 'active': true });
            $scope.sortByCreate = _.sortBy($scope.plans, function (o) { return new Date(o.createdAt); });
            $scope.plans = $scope.sortByCreate.reverse();
        }

        function init() {
            $scope.planId = planId;
            $scope.page1 = true;
            $scope.action = [];
            $scope.expand = false;
            $scope.activityExpand = false;
            $scope.activities = [];

            $scope.user = Query.getCookie('user');

            if (planId !== null) {
                fetchPlan(planId);
            } else {
                ActionPlanService.all().then(function(response){
                    $scope.plans = response.data;
                    get_plans_ready();
                    setSocketForActionPlan();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/settings/action-plans/all').then(function (response) {
                    
                // });
            }
        };

        init();
        $scope.printPlan=function(plan){
            $scope.printPlanActivities='';
            $scope.printPlanActivities+='<h1>Plan Name: '+ plan.name+'</h1><br>'
            ActionPlanService.activities(plan.id).then(function(response){
                var loopPromises = [];
                $scope.activities = response.data;
                sortList();
                console.log($scope.activities);
                $scope.printPlanActivities+='<table>'
                _.each($scope.activities, function (activity,ind) {
                    var deferred = $q.defer();
                    loopPromises.push(deferred.promise);
                    if(activity.role==null || activity.responsibility_level==null){
                        activity.role='N/A';
                        activity.responsibility_level='N/A';
                    }

                    $scope.printPlanActivities+='<tr>'
                    var indexx = ind + 1;
                    $scope.printPlanActivities+='<td>' + indexx + ' - ' + activity.title +'</td>'

                    $scope.printPlanActivities+='</tr>'

                    $scope.printPlanActivities+='<tr>'
                    $scope.printPlanActivities+='<td></td>'
                    $scope.printPlanActivities+='<td></td>'
                    $scope.printPlanActivities+='</tr>'

                    setTimeout(function () {
                        deferred.resolve();
                        console.log('long-running operation inside loop done');
                    }, 2000);
                });
                $scope.printPlanActivities+='</table>'

                $q.all(loopPromises).then(function () {
                    console.log($scope.printPlanActivities);
                    var printContents=$scope.printPlanActivities;
                    var popupWin = window.open('', '_blank', 'width=1000,height=800');
                    if(popupWin){
                        popupWin.document.open();
                        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
                        popupWin.document.close();
                    }


                });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/action-plans/activities?actionPlanId=" + plan.id)
            // .then(function (response) {
                

            // });

        }

        $scope.selectPlan = function (plan) {
            fetchPlan(plan.id);
        };

        $scope.back = function () {
            $scope.page2 = false;
            $scope.page1 = true;
        };

        $scope.userStatusClass = function (response_actor_available) {
            return response_actor_available ? 'user-available' : 'user-unavailable'
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

        $scope.displayProperty = function (property) {
            return property ? property : 'N/A'
        };
    }
}());
