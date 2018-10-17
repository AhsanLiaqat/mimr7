(function () {
    'use strict';

    angular.module('app')
        .controller('timeLinePageCtrl', ['$scope', '$routeParams', '$http', 'filterFilter', 'AuthService','Query','ClassService','MessageHistoryService','MessageService','IncidentService', ctrlFunction]);

        function ctrlFunction($scope, $routeParams, $http, filterFilter, AuthService,Query, ClassService, MessageHistoryService, MessageService, IncidentService) {

            function init() {
                $scope.user = Query.getCookie('user');
                $scope.category = [];
                $scope.direction = false;
                $scope.hasMessages = false;
                IncidentService.all($scope.user.userAccountId).then(function(response){
                    $scope.incidents = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/api/incidents/all?userAccountId='+ $scope.user.userAccountId).then(function(response) {
                    
                // });
                $http.get('/users/list').then(function(response) {
                    $scope.userList = response.data;
                });
            }
            init();

            $scope.loadCategory = function() {
                $scope.classes = [];
                $scope.category = undefined;
                ClassService.list($scope.incident).then(function(response){
                    $scope.classes = response.data;
                    $scope.classes.push({id: "incoming", title:"Incoming" });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

                });
                // var path = '/class/list?incidentId=' +  $scope.incident;
                
                // $http.get(path).then(function(response) {
                    
                // });
            };

            var checkMessagesLength = function(){
                return $scope.messages.length > 0 ? true : false;
            }

            $scope.loadMessages = function () {
                if ($scope.category === 'incoming') {
                    MessageService.timeLine($scope.incident).then(function(response){
                        $scope.messages = response.data;
                        var sortByCreate = _.sortBy($scope.messages, function(o) { return new Date(o.createdAt); });
                        $scope.messages = sortByCreate.reverse();
                        $scope.hasMessages = checkMessagesLength();
                         $(".content").mCustomScrollbar({
                            axis:"y",
                            theme:"dark-3",
                            setTop: "0px",
                            advanced:{ autoExpandHorizontalScroll:true }
                        });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // var path = '/messages/timeline/' + $scope.incident;
                    //  $http.get(path).then(function(response) {
                        
                    // });
                } else {
                    MessageHistoryService.timeLine($scope.incident,$scope.category).then(function(response){
                        $scope.messages = response.data;
                        var sortByCreate = _.sortBy($scope.messages, function(o) { return new Date(o.createdAt); });
                        $scope.messages = sortByCreate.reverse();
                        $scope.hasMessages = checkMessagesLength();
                         $(".content").mCustomScrollbar({
                            axis:"y",
                            theme:"dark-3",
                            setTop: "0px",
                            advanced:{ autoExpandHorizontalScroll:true }
                        });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // var p = '/message-history/timeline/' + $scope.incident + '?category=' + $scope.category;
                    // $http.get(p).then(function(response) {
                        
                    // });
                }
            };

            $scope.onUserSelect = function (){
                if ($scope.selected.length === 0) {
                  angular.forEach($scope.messages, function (msg) {
                      msg.filteredByUser = false;
                  });
                } else {
                    angular.forEach($scope.messages, function (msg) {
                        var matched = true;
                        angular.forEach($scope.selected, function (userId) {
                            if (userId === msg.userId) {
                                matched = false;
                            }
                            msg.filteredByUser = matched;
                        });
                    });
                }
            };

            $scope.displayMessage = function (message) {
                if (!message.filteredByUser) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.userName = function(userId) {
                if (userId && $scope.userList) {
                  var filteredUser = filterFilter($scope.userList, {'id': userId})[0];
                  return filteredUser ? filteredUser.firstName + ' ' + filteredUser.lastName : 'N/A'
                }
            };

            $scope.dateFormat = function(dat) {
                return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
            };

            $scope.sortDirection = function(){
                $scope.direction = !$scope.direction;
            };

            $scope.checkMessages = function(){
                return $scope.hasMessages ? true : false;
            };

            $scope.timeFormat = function (dat) {
                return moment(dat).utc().local().format('HH:mm');
            };
        }
}());
