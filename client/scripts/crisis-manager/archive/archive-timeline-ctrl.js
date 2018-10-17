(function () {
    'use strict';

    angular.module('app')
    .controller('archiveTimelineCtrl', ['$scope',
        '$rootScope',
        'close',
        '$routeParams',
        '$http',
        'AuthService',
        'incident',
        '$filter',
        '$location',
        'ClassService',
        'MessageHistoryService',
        'MessageService',
        ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        $routeParams,
        $http,
        AuthService,
        incident,
        $filter,
        $location,
        ClassService,
        MessageHistoryService,
        MessageService
        ) {

        function init() {
            $scope.incident = incident;
            var incidentId = $scope.incident.id;
            $scope.direction = false;
            $scope.selected = [];
            $scope.date = {};
            $scope.category = 'incoming';
            $scope.classes = [];
            ClassService.list($scope.incident.id).then(function(response){
                $scope.classes = response.data;
                $scope.classes.push({id: "incoming", title:"Incoming" });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = '/class/list?incidentId=' +  $scope.incident.id;             
            // $http.get(path).then(function(response) {               
                    
            // });
            $http.get('/users/list')
            .then(function(response) {
                $scope.userList = response.data;
                $scope.users = [];
            });
            MessageService.timeLine(incidentId).then(function(response){
                $scope.messages = response.data;
                    if($scope.messages[0]!== null){
                var sortByCreate = _.sortBy($scope.messages, function(o) { return new Date(o.createdAt); });
                $scope.messages = sortByCreate.reverse();
                $scope.backup = angular.copy($scope.messages);
                console.log('in if', $scope.messages);
                _.each($scope.messages, function (msg) {
                    _.each($scope.userList, function (user) {
                        if(msg.userId == user.id){
                            $scope.users.push(user);
                        }
                    });
                });
                $scope.userList = $filter('unique')($scope.users);
            }else{
                console.log('comes here');
                $scope.messages = []
                $scope.userList = [];
                $scope.users = [];
            }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = '/messages/timeline/' + incidentId;
            // $http.get(path)
            // .then(function(response) {
                
            // });
        };
        $scope.onUserSelect = function (){
            $scope.msg = [];
            $scope.messages = [];
            if($scope.selected != ''){
                _.each($scope.selected, function (userid) {
                    _.each($scope.backup, function (msg) {
                        if(msg.userId == userid){
                            $scope.msg.push(msg);
                        }
                    });
                });
                $scope.messages = angular.copy($scope.msg)
            }else{
                $scope.messages = angular.copy($scope.backup);
            }
        };
        $scope.loadMessages = function() {
            $http.get('/users/list')
            .then(function(response) {
                $scope.userList = response.data;
                $scope.users = [];
            });
            if($scope.category === 'incoming') {
                MessageService.timeLine($scope.incident.id).then(function(response){
                    $scope.messages = response.data;
                    if($scope.messages[0]!== null){
                        var sortByCreate = _.sortBy($scope.messages, function(o) { return new Date(o.createdAt); });
                        $scope.messages = sortByCreate.reverse();
                        $scope.backup = angular.copy($scope.messages);
                        _.each($scope.messages, function (msg) {
                            _.each($scope.userList, function (user) {
                                if(msg.userId == user.id){
                                    $scope.users.push(user);
                                }
                            });
                        });
                        $scope.userList = $filter('unique')($scope.users);
                    }else{
                        $scope.messages = [];
                        $scope.userList = [];
                        $scope.users = [];
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = '/messages/timeline/' + $scope.incident.id;
                // $http.get(path).then(function(response) {
                    
                // });
            }
            
            else {
                MessageHistoryService.timeLine($scope.incident.id,$scope.category).then(function(response){
                    $scope.messages = response.data;
                    if($scope.messages[0]!== null){
                    var sortByCreate = _.sortBy($scope.messages, function(o) { return new Date(o.createdAt); });
                    $scope.messages = sortByCreate.reverse();
                    $scope.backup = angular.copy($scope.messages);
                    _.each($scope.messages, function (msg) {
                        _.each($scope.userList, function (user) {
                            if(msg.userId == user.id){
                                $scope.users.push(user);
                            }
                        });
                    });
                $scope.userList = $filter('unique')($scope.users);
                }else{
                    console.log('comes hereeeee')
                    $scope.userList = null;
                    $scope.users = null;
                }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var p = '/message-history/timeline/' + $scope.incident.id + '?category=' + $scope.category;
                // $http.get(p).then(function(response) {
                    
                // });
            }
        };
        $scope.clearfilter = function(){
            $scope.messages = $scope.backup;
            $scope.date={};
            $scope.selected = '';
        };
        $scope.dateFilter = function(){
            $scope.msg = [];
            $scope.messages = '';
            $scope.messages = [];
            _.each($scope.backup, function (msg) {
             msg.updatedAt =  $filter('date')(msg.updatedAt,"dd/MM/yyyy");
             console.log(msg.updatedAt);
             console.log($scope.date.from,'compared with');
             if(msg.updatedAt >= $scope.date.from && msg.updatedAt <= $scope.date.to){
                $scope.msg.push(msg);
            }
        });
            if($scope.msg != null){

                $scope.messages = angular.copy($scope.msg);
            }else{
                $scope.messages = angular.copy($scope.backup);
            }
        }
        $scope.userName = function(id) {
            if (id !== "undefined" && $scope.userList) {
                var ind = $scope.userList.findIndex(function(obj){
                    return obj.id === id;
                });
                if($scope.userList[ind]){
                    var name = $scope.userList[ind].firstName + ' ' + $scope.userList[ind].lastName ;
                }
                if(name != null){
                    return name;
                }else{
                    name = 'N/A';
                    return name;
                }
            }
        }

        $scope.object_to_html = function(){
            var date = new Date();
            date = $filter('date')(date, "dd/MM/yyyy");
            var ondate = '';
            $scope.timeline = '<br><strong>Timeline <br>Incident: '+$scope.incident.name+'<br> generated At:  '+date+'</strong><br>';
                angular.forEach($scope.messages, function (msg) {
                   $scope.user = {};
                $scope.user = $filter('filter')($scope.userList, {id: msg.userId});
                ondate = $filter('date')(msg.createdAt, "dd/MM/yyyy");
                if($scope.user[0]){
                   $scope.timeline +='<hr> message: '+msg.message+'<p> date:'+ondate+'</p><p>by: '+$scope.user[0].firstName+'  '+$scope.user[0].lastName +'</p>';
                }else{
                   $scope.timeline +='<hr> message: '+msg.message+'<p> date:'+ondate+'</p>';

                }
                });
                $scope.printTimeline();
            }
            $scope.printTimeline = function () {
            var windowContent = $scope.timeline;
            var printWin = window.open('', '', 'width=700,height=500');
            printWin.document.open();
            printWin.document.write(windowContent);
            printWin.document.close();
            printWin.focus();
            printWin.print();
            printWin.close();
        }
        
        $scope.sortDirection = function(){
            $scope.direction = !$scope.direction;
        };

        $scope.close = function() {
            close();
        }

        init();
    }
} ());
