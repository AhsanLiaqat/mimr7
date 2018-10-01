(function () {
    'use strict';

    angular.module('app')
        .controller('taskDetailCtrl', ['$scope', '$http', '$rootScope', '$window', 'AuthService', '$routeParams', 'filterFilter', 'ModalService','IncidentActivityService', taskDetailCtrl]);


    function taskDetailCtrl($scope, $http, $rootScope, $window, AuthService, $routeParams, filterFilter, ModalService, IncidentActivityService) {

        function setDateFormat(planDate) {
            return moment.utc(planDate).format('HH:mm DD-MM-YYYY');
        }

        var initWS = function () {
            var host = window.document.location.host.replace(/:.*/, '');

            var ws = new WebSocket('wss://' + host + ':443/websocket', null, {
                reconnectIfNotNormalClose: true,
                maxTimeout: 30 * 60 * 1000
            });

            // var ws = new WebSocket('ws://' + host + ':8888/websocket');

            ws.onopen = function (res) {
                ws.send("connected");
            }

            ws.onmessage = function (response) {
                if (response.data !== 'Hello') {
                    var reply = JSON.parse(response.data);
                    if (reply.type === 'incident_activity_update') {
                        var activity = reply.activity;
                        if (activity && activity.id === $scope.activity.id){
                            $scope.activity = activity;
                            $scope.$apply();
                        }
                    }
                }
            }
            return ws;
        };

        var openWS = function () {
            var ws = initWS();
            if ($rootScope.infoProvider === true) {
                ws.onclose = function () {
                    openWS();
                }
            }
        };

        function init() {
            setTimeout(function(){ $rootScope.fixedHeader = false; }, 10);
            $scope.statusOptions = [{ value: 'na', name: 'N/A' },
                { value: 'incomplete', name: 'NO INFORMATION' },
                { value: 'in progress', name: 'IN PROGRESS' },
                { value: 'completed', name: 'COMPLETED' }];

            $http.get("/users/me").then(function (res) {
                $scope.user = res.data;
            });

            IncidentActivityService.get($routeParams.taskId).then(function(res){
                $scope.activity = res.data;
                    IncidentActivityService.getTask($scope.activity.id).then(function(result){
                        $scope.taskList = result.data.task_list;
                        openWS();
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get('/incident-activities/get-task/' + $scope.activity.id)
                    //     .then(function (result) {
                            
                    //     }, function (error) {
                    //         toastr.error(error, 'Error!');
                    // });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/incident-activities/get?id=" + $routeParams.taskId)
            //     .then(function (res) {
                    
            //     }, function (error) {
            //         toastr.error(error.data.message, 'Error!');
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
                        //     .then(function (response) {
                                
                        // });
                    }
                });
            });
        };

        $scope.getStatusName = function (status) {
            return filterFilter($scope.statusOptions, { 'value': status })[0].name;
        };

        $scope.back = function () {
            $window.history.back();
        };

        $scope.shortUrl = function (url) {
            if (url.indexOf('https') !== -1){
                return url.replace('https://','');
            }else if(url.indexOf('http') !== -1){
                return url.replace('http://','');
            }else{
                return url
            }
        };

        init();
    }
}());
