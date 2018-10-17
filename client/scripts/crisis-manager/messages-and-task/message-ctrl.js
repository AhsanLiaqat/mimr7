(function () {
    'use strict';

    angular.module('app')
        .controller('messageCtrl', ['$scope', '$http', '$rootScope', '$route', 'AuthService', '$routeParams', 'ModalService','$window','Query','MessageService','IncidentService', messageCtrl]); // overall control


    function messageCtrl($scope, $http, $rootScope, $route, AuthService, $routeParams, ModalService,$window,Query, MessageService, IncidentService) {

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
        function init() {
            $scope.user = Query.getCookie('user');
            setTimeout(function(){ $rootScope.fixedHeader = false; }, 10);
            $scope.id = $routeParams.id;
            if ($routeParams.id === undefined) {
                $http.get("/users/me").then(function (res) {
                    $scope.user = res.data;
                    IncidentService.all($scope.user.userAccountId).then(function(res){
                        $scope.incidents = res.data;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get("/api/incidents/all?userAccountId=" + $scope.user.userAccountId)
                    //     .then(function (res) {
                            
                    // });
                });
            } else {
                IncidentService.get($routeParams.id).then(function(response){
                    $scope.incident = response.data;
                    MessageService.all($scope.user.id,$scope.incident.id,'others').then(function(res){
                        $scope.sortByCreated = _.sortBy(res.data, function (o) { return new Date(o.updatedAt); });
                        $scope.messages = $scope.sortByCreated.reverse();
                        if ($scope.messages.length === 0) {
                            $scope.noMessage = true;
                        }
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get('/messages/all/' + $scope.user.id + '/' + $scope.incident.id).then(function (res) {
                        
                    // });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var query = "/api/incidents/get?id=" + $routeParams.id;
                // $http.get(query).then(function (response) {
                    
                // })
            }
        }

        navigator.geolocation.getCurrentPosition(function (position) { })
        var userAgent = $window.navigator.userAgent;
        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                console.log(key);
            }
        };

        var postMessage = function (data) {
            if (data.message != '' && data.message != undefined){
                $scope.message = '';
                data.userId = $scope.user.id
                MessageService.save(data).then(function(res){
                    $scope.messages.unshift(res.data);
                    $scope.noMessage = false;
                    $scope.message = '';
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

        $scope.sendMessage = function (msg) {
            var data = {};
            data.message = msg;
            data.incidentId = $routeParams.id;
            postMessage(data);
            // navigator.geolocation.getCurrentPosition(function (position) {
            //     data.coords = _.extend({}, position.coords);
            // }, function (res) {
            //     postMessage(data);
            // });
        };

        $scope.logout = function () {
            AuthService.logout();
        }

        init();
    }
}());
