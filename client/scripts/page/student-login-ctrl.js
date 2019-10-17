(function () {
    'use strict';

    angular.module('app')
        .controller('studentLoginCtrl', ['$scope', '$filter','$routeParams', '$http', 'AuthService', '$location','$uibModal','ModalService','$sce','$timeout','Query',ctrlFunction]);

        function ctrlFunction($scope ,$filter,$routeParams, $http, AuthService, $location,$uibModal,ModalService,$sce,$timeout,Query) {
            
            
            $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
            $scope.pageItems = 10;

            $scope.verify = function(){
                $http.post('users/verifyEmail',{data:$scope.data}).then(function(res) {
                    $scope.user = res.data;
                    var user = res.data.token;
                    var exp = new Date(new Date().getTime() + 1000*60*60).toUTCString();
                    Query.setCookie('Auth_token',user,{expires: exp});
                    if($scope.user.id){
                        $scope.state = 'first';
                        localStorage["loginStudentUser"] = JSON.stringify($scope.user);
                        localStorage["loginStudentState"] = $scope.state;
                        setTimeout(function(){ 
                            $scope.activeContentTable($scope.tableState);
                        }, 300);
                        toastr.success('Here is your active content');

                    }else{
                        toastr.error('Record Not found! Please provide correct information');
                    }
               });
            }

            $scope.show_messages = function(content){
                if(typeof content === 'string'){
                    var content = JSON.parse(content);
                }
                if(content.id == 0){
                    $scope.state = 'third';
                    localStorage["loginStudentState"] = $scope.state;
                    localStorage["loginStudentMessageId"] = $scope.user.id;
                    $scope.studentMessages = $scope.studentMessages;
                }else{
                    if(content.article.kind == 'message'){
                        $scope.state = 'second';
                        localStorage["loginStudentState"] = $scope.state;
                        localStorage["loginStudentContent"] = JSON.stringify(content);
                        $http.get('/question-scheduling/my-messages/' + content.id + '/' + $scope.user.id)
                        .then(function (response) {
                            if(response.status == 380){
                                toastr.warning('Content not Found');
                            }else{
                                $scope.myMessages = response.data;
                                console.log('-----how many messages',$scope.myMessages);
                                $scope.readMessages = [];
                                $scope.unReadMessages = [];
                                angular.forEach($scope.myMessages, function(msg){
                                    if(msg.read_messages == true){
                                        $scope.readMessages.push(msg);
                                    }else{
                                        $scope.unReadMessages.push(msg);
                                    }
                                });
                            }
                        });
                    }else{
                        $scope.state = 'fourth';
                        localStorage["loginStudentState"] = $scope.state;
                        localStorage["loginStudentContent"] = JSON.stringify(content);
                        $http.get('/scheduled-surveys/my-surveys/' + content.id + '/' + $scope.user.id)
                        .then(function (response) {
                            if(response.status == 380){
                                toastr.warning('Content not Found');
                            }else{
                                $scope.mySurveys = response.data;
                            }
                        });
                    }
                }
            }

            $scope.readMessage = function (message) {
                var data = {
                    read_messages : true
                }
                $http.post('/question-scheduling/update/' + message.id, { data: data }).then(function (res) {
                    $scope.readMessages.push(res.data);
                    $scope.read_messages = $scope.readMessages.map(function(x) { return x.id;})
                    $scope.unReadMessages = $filter('filter')($scope.unReadMessages, function(item){ 
                        return !$scope.read_messages.includes(item.id);
                    });
                });

            };

            $scope.show_student_messages = function(){
                $scope.state = 'third';
                localStorage["loginStudentState"] = $scope.state;
                localStorage["loginStudentMessageId"] = $scope.user.id;
                $http.get('/student-message/all-messages/' + $scope.user.id)
                .then(function (response) {
                    $scope.studentMessages = response.data;
                });
            }

            function init() {
                $scope.data = {};
                $scope.state = 'login';

                if(localStorage["loginStudentUser"]){
                    $scope.user = JSON.parse(localStorage["loginStudentUser"]);
                    $scope.data.email = $scope.user.email;
                    if(localStorage["loginStudentState"]){
                        $scope.state = localStorage["loginStudentState"];
                        if($scope.state == 'first'){
                            $scope.verify();
                        }else if ($scope.state == 'second'){
                            $scope.show_messages(localStorage["loginStudentContent"],$scope.user.id);
                        }
                        else if ($scope.state == 'third'){
                            $scope.show_student_messages(localStorage["loginStudentMessageId"],$scope.user.id);
                        }
                        else if ($scope.state == 'fourth'){
                            $scope.show_messages(localStorage["loginStudentContent"],$scope.user.id);
                        }
                    }
                }
            }

            init();


            $scope.logout = function(){
                $scope.state = 'login';
                delete localStorage["loginStudentUser"];
                delete localStorage["loginStudentState"];
                delete localStorage["loginStudentContent"];
                delete localStorage["loginStudentMessageId"]
                Query.delCookie('Auth_tk.sig');
                Query.delCookie('user');
                Query.delCookie('Auth_token');
            }

            $scope.addModal = function() {
                ModalService.showModal({
                    templateUrl: "views/pages/add-student-message.html",
                    controller: "addMessageCtrl",
                    inputs : {
                        messageId : null,
                        user : $scope.user
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        if(result){
                            $scope.studentMessages.push(result);
                        }
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };


            $scope.edit = function(record,index) {
                ModalService.showModal({
                    templateUrl: "views/pages/add-student-message.html",
                    controller: "addMessageCtrl",
                    inputs : {
                        messageId : record.id,
                        user : null
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        if(result){
                            $scope.studentMessages[index] = result;
                        }
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };

            $scope.deleteMessage = function (id, index) {
                $http.delete('/student-message/delete/' + id)
                    .then(function(res){
                       $scope.studentMessages.splice(index, 1);
                });
            };

            $scope.changeStatus = function (record, index) {
                if(record.status == 'Active'){
                    record.status = 'InActive';
                }else{
                    record.status = 'Active';
                    record.setOffTime = new Date(new Date().getTime() + 1*1000*60*60);
                }
                $http.post('/student-message/update-status',{ data : record}).then(function(result){
                    $scope.studentMessages[index] = result.data;
                    $scope.activeContentTable($scope.tableState);
                });
            };

            $scope.activeContentTable = function (tableState) {
                $scope.tableState = tableState;
                if($scope.state != 'login'){
                    $scope.isLoading = true;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;
                    var number = pagination.number || 10;
                    $http.get('users/student-details/' + $scope.user.id)
                    .then(function (response) {
                        $http.get('/student-message/all-messages/' + $scope.user.id)
                        .then(function (studentMsgs) {
                            $scope.studentMessages = studentMsgs.data;
                            $scope.activeContent = response.data;
                            $scope.a = [];
                            angular.forEach($scope.activeContent, function(msg, key) {
                                if(msg.content_activated == true && msg.status != 'stop'){
                                    $scope.a.push(msg);
                                }
                            });
                            $scope.total = response.data.length;
                            var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                            if (tableState.sort.predicate) {
                                filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                            }
                            var result = filtered.slice(start, start + number);
                            $scope.activeContent = result;
                            angular.forEach($scope.activeContent,function(content){
                                content.readMsg = 0;
                                content.unReadMsg = 0;
                                content.question_schedulings = content.question_schedulings.filter(function(item){return item.userId == $scope.user.id;});
                                angular.forEach(content.question_schedulings,function(scheduled_ques){
                                    if(scheduled_ques.read_messages){
                                        content.readMsg++;
                                    }else{
                                        content.unReadMsg++;
                                    }
                                });
                            });
                            var flag = $scope.studentMessages.every((msg)=>{
                                return msg.status == 'InActive'
                            });
                            if(!flag){
                                $scope.activeContent.unshift({
                                    id: 0,
                                    article : {
                                        title: 'Quick Content',
                                    }
                                });
                            }
                            tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                            $scope.isLoading = false;
                        });

                    });
                }
            };

            $scope.dateTimeFormat = function (dat) {
                return moment(dat).utc().local().format('DD-MM-YYYY');
            };

            $scope.trustedHtml = function (value) {
                return $sce.trustAsHtml(value);
            };
        }
}());