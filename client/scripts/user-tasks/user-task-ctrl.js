(function () {
    'use strict';

    angular.module('app')
    .controller('userTaskCtrl', ['$scope', '$http', '$rootScope', '$route', 'AuthService', '$routeParams', '$timeout', 'filterFilter', 'ModalService','IncidentPlanService','IncidentActivityService','IncidentService', userTaskCtrl]); // overall control


    function userTaskCtrl($scope, $http, $rootScope, $route, AuthService, $routeParams, $timeout, filterFilter, ModalService, IncidentPlanService, IncidentActivityService, IncidentService) {

        function setDateFormat(planDate) {
            return moment.utc(planDate).format('HH:mm DD-MM-YYYY');
        }

        var setSocketForActivity = function () {
            $timeout(function () {
                console.log('setting socket: ', $scope.selectedIncidentPlan);
                // socket.subscribe($scope, 'incident_activity_update:' + $scope.selectedIncidentPlan.id, function (evt, reply) {
                //     var activity = reply.activity;
                //     console.log('got and update', activity);
				//
                //     if (activity.incident_id === $scope.incident.id && $scope.activities.length > 0) {
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

        function init() {
            setTimeout(function(){ $rootScope.fixedHeader = false; }, 10);
            $scope.incidentId = $routeParams.incidentId;
            $scope.statusOptions = [{ value: 'na', name: 'N/A' },
            { value: 'incomplete', name: 'NO INFORMATION' },
            { value: 'in progress', name: 'IN PROGRESS' },
            { value: 'completed', name: 'COMPLETED' },
            { value: 'overdue', name: 'Overdue' }];

            $http.get("/users/me").then(function (res) {
                $scope.user = res.data;
            });

            IncidentService.get($routeParams.incidentId).then(function(res){
                $scope.incident = res.data;
                $scope.selectedIncidentPlan = filterFilter($scope.incident.incident_plans, {'selected': true})[0];
                IncidentPlanService.userTasks($routeParams.incidentId).then(function(res){
                    $scope.activities = res.data;
                    if ($scope.selectedIncidentPlan) {
                        setSocketForActivity();
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/incident-plan/user-tasks?incidentId=" + $routeParams.incidentId)
                // .then(function (res) {

                // }, function (error) {
                //     toastr.error(error.data.message, 'Error!');
                // });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/api/incidents/get?id=" + $routeParams.incidentId)
            // .then(function (res) {

            // }, function (error) {
            //     toastr.error(error.data.message, 'Error!');
            // });
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
                return 'orange-text';
                default:
            }
        };

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

        $scope.userHasActivities = function () {
            if ($scope.activities){
                var filteredActivity = filterFilter($scope.activities, { 'activated': true })[0];
                return filteredActivity ? true : false;
            }else{
                return false;
            }
        }

        $scope.getStatusName = function (status) {
            return filterFilter($scope.statusOptions, { 'value': status })[0].name;
        }

        $scope.logout = function () {
            AuthService.logout();
        }

        init();
    }
}());
