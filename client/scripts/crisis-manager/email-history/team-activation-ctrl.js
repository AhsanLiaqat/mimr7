(function () {
    'use strict';

    angular.module('app')
    .controller('teamsActivateCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', '$filter','Query','IncidentTeamService','CustomMessageService','MailService','AlertHistoryService','EmailTrackService', teamFunction]);

    function teamFunction($scope, $routeParams, $http, AuthService, ModalService, $location, $filter,Query, IncidentTeamService, CustomMessageService, MailService, AlertHistoryService, EmailTrackService) {


        function init() {
            $scope.alertCheck = {};
            $scope.alertCheck.sms = false;
            $scope.user = Query.getCookie('user')
            $scope.page0 = true;
            IncidentTeamService.all().then(function(response){
                $scope.teams = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/incident-teams/all').then(function(response) {
                
            // });

            $http.get("/users/list").then(function(res){
                $scope.users = res.data;
            });

            CustomMessageService.getactivationMessage('Action Plan','Email').then(function(response){
                $scope.customMessage = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/custom-messages/activation-message?type=Action Plan&template=Email').then(function(response) {
                
            // });

            CustomMessageService.getactivationMessage('Action Plan','SMS').then(function(response){
                $scope.customSms = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/custom-messages/activation-message?type=Action Plan&template=SMS').then(function(response) {
                
            // });

            $scope.selected = [];

            $scope.user_status;
        }

        init();

        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

        $scope.history = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            EmailTrackService.allTeam($scope.user.userAccountId).then(function(response){
                $scope.emails = response.data;
                $scope.sortByCreate = _.sortBy($scope.emails, function (o) { return new Date(o.createdAt); });
                $scope.emails = $scope.sortByCreate.reverse();

                var sentTo = '';
                for(var i=0; i<$scope.emails.length; i++) {
                    sentTo = sentTo + $scope.emails[i].sentTo + ', ' ;
                }
                $scope.sentTo = sentTo;
                $scope.sortByCreate = _.sortBy($scope.emails, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();
                $scope.total = $scope.emails.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }

                var result = filtered.slice(start, start + number);

                $scope.emails = result;

                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path= "/email-track/all-team?id=" +  $scope.user.userAccountId;
            // $http.get(path).then(function(response) {
                
            // });

        };
        $scope.toggleAll = function(team){
            angular.forEach(team.users, function(user) {
                user.checked = true;
            });
        }
        $scope.untoggleAll = function(team){
            angular.forEach(team.users, function(user) {
                user.checked = false;
            });
        }
        $scope.selectTeam = function(team, status){
            if (status == false){
                angular.forEach(team.users, function(user, key1) {
                    angular.forEach($scope.selected, function(suser, key2) {
                        if (user.id == suser.id){
                            $scope.selected.splice(key2, 1);
                        }
                    });
                });
                $scope.untoggleAll(team);
                console.log($scope.selected);
            }else{

                angular.forEach(team.users, function (user) {
                    $scope.selected.push(angular.copy(user));
                });
                $scope.toggleAll(team);
            }
        };
        $scope.unselectUser = function(user){
            user.checked = !user.checked
            console.log(user.checked);
            if (user.checked == false){
                angular.forEach($scope.selected, function(suser, key1) {
                    if (user.id == suser.id){
                        $scope.selected.splice(key1, 1);
                    }
                });
                console.log($scope.selected);
            }else{
                $scope.selected.push(angular.copy(user));

                console.log($scope.selected);
            }
        };
        $scope.parseing = function(arr1, arr2){
            $scope.ll = arr2;
            angular.forEach(arr1, function(value1, key1) {
                angular.forEach(arr2, function(value2, key2) {
                    if (value1.id == value2.id){
                        $scope.ll.splice(key2 ,1);
                    }
                });
            });
        };
        $scope.refresh = function(){
            init();
            $scope.page2 = false;
            $scope.page1 = false;
        }
        $scope.pageTwo = function(){
            $scope.page2 = true;
            $scope.alertCheck.email = true;
            $scope.page1 = false;
            $scope.page3 = false;
            $scope.page0 = false;

        };
        $scope.pageOne = function(){
            $scope.page2 = false;
            $scope.page1 = true;
            $scope.page3 = false;
            $scope.page0 = false;

        };
        $scope.pageThree = function(){
            $scope.page2 = false;
            $scope.page0 = false;
            $scope.page1 = false;
            $scope.page3 = true;
            var temp;
            $scope.unselectUser = [];
            $scope.parseing($scope.selected, $scope.users);
        };
        $scope.quickAddUser = function() {
            ModalService.showModal({
                templateUrl: "views/teams/user-create.html",
                controller:  "quickCreateUser",
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $scope.ll.push(result);
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.EditUser = function(user){
            ModalService.showModal({
                templateUrl: "views/teams/user-Edit.html",
                controller: "quickEditUser",
                inputs: {
                    User: user
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if(result){
                        IncidentTeamService.all().then(function(response){
                            $scope.teams = response.data;
                            $scope.selected = {};
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.get('/settings/incident-teams/all').then(function (response) {
                            
                        // });

                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.EditSelectedUser = function(user,index){
            ModalService.showModal({
                templateUrl: "views/teams/user-Edit.html",
                controller: "quickEditUser",
                inputs: {
                    User: user
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if(result){
                        $scope.selected[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        }
        $scope.selectUser = function(user){
            user.checked = !user.checked
            console.log(user.checked);
            if (user.checked == false){
                angular.forEach($scope.selected, function(suser, key1) {
                    if (user.id == suser.id){
                        $scope.selected.splice(key1, 1);
                    }
                });
                console.log($scope.selected);
            }else{
                user.name = user.firstName;
                $scope.selected.push(angular.copy(user));
                $scope.alertCheck.email = true;

                console.log($scope.selected);
            }
        };

        $scope.sendAlert = function () {
            $scope.tracking = {};
            $scope.UserIds = [];
            angular.forEach($scope.selected, function(user, key2) {
                $scope.UserIds.push(user.id);
            });
            if($scope.alertCheck.email == false && $scope.alertCheck.sms == false ){
                toastr.error('Select any mean to send Alert');
            }else{
                if($scope.alertCheck.email){
                    $scope.sendEmailAlerts();
                    $scope.tracking.type = 'Email';
                }

                if($scope.alertCheck.sms){
                    $scope.sendSmsAlerts();
                    $scope.tracking.type += ' Sms';
                }

                if($scope.alertCheck.push){
                    $scope.sendPushNotification();
                    $scope.tracking.type += ' Push';
                }
                $scope.emailTracking();
                if($scope.alertCheck.email == true || $scope.alertCheck.sms == true ){
                    $scope.page2 = false;
                    $location.path('/team-activation');
                    init();
                }
            }
        };
        $scope.emailTracking = function (){
            $scope.tracking.content = $scope.content;
            $scope.tracking.sentTo = $scope.emailList.toString();
            $scope.tracking.createdAt = moment().utc().format();
            EmailTrackService.save($scope.tracking).then(function(res){
                $scope.emails.unshift(res.data);
                toastr.success("Alert sent Successfuly");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/email-track/save', { data: $scope.tracking}).then(function (res) {
                
            // });

        };

        $scope.sendPushNotification = function(){
            var data = {};
            data.message = $scope.customSms;
            $scope.ids = [];
            angular.forEach($scope.selected, function(user, key2) {
                $scope.ids.push(user.id);

            });
            $scope.idList=$filter('unique')($scope.ids);
            angular.forEach($scope.idList, function(id, key2) {
                var data = {};
                data.to= id;
                data.message = $scope.customSms;
                $http.post('api/ios/push', { data: data }).then(function (response) {
                    if(key2 == $scope.idList.length -1){
                        var sms = {};
                        sms.to = angular.copy($scope.UserIds);
                        sms.type = 'Push';
                        sms.message = $scope.customSms;
                        AlertHistoryService.save(sms);
                        // $http.post('/alert-history/save', { data: sms});
                        toastr.success("Push notification sent Successfuly");
                    }
                });     
            }); 
        };

        $scope.sendSmsAlerts = function(){
            $scope.mobileNumbers = [];
            angular.forEach($scope.selected, function(user, key2) {
                $scope.mobileNumbers.push(user.mobilePhone);
            });

            $scope.numberList=$filter('unique')($scope.mobileNumbers);
            angular.forEach($scope.numberList, function(number, key2) {
                var data = {};
                data.to = number;
                data.message = $scope.customSms;

                $http.post('api/Sms/send', { data: data }).then(function (response) {
                    if(key2 == $scope.numberList.length -1){
                        var sms = {};
                        sms.to = angular.copy($scope.UserIds);
                        sms.type = 'sms';
                        sms.message = $scope.customSms;
                        AlertHistoryService.save(sms);
                        // $http.post('/alert-history/save', { data: sms});
                        toastr.success("Alert sent Successfuly");
                    }
                });     
            });   
        };

        $scope.sendEmailAlerts = function(){
            if($scope.selected == null){
                toastr.error("Error occurrred.");
            }
            $scope.email = [];
            angular.forEach($scope.selected, function(user, key2) {
                $scope.email.push(user.email);
            });
            $scope.content =  $scope.customMessage.content;
            $scope.emailList=$filter('unique')($scope.email);
            angular.forEach($scope.emailList, function(email, key2) {
                var mailOptions = {
                    from: 'noreply@crisishub.co',
                    to: email.toString(),
                    subject:  $scope.customMessage.subject,
                    html: $scope.content + "<br>" + $scope.getBaseUrl()
                };
                MailService.send(mailOptions).then(function(response){
                    if (response && response.status === 200) {
                        if(key2 == $scope.emailList.length -1){
                            var history = {};
                            history.to = angular.copy($scope.UserIds);
                            history.type = 'Email';
                            history.message = $scope.customMessage;
                            // toastr.success("Emails sent Successfuly");
                            AlertHistoryService.save(history);
                            // $http.post('/alert-history/save', { data: history});
                        }
                    }
                    else {
                        toastr.error("Error occurrred.");
                        close();
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/mail/send', { data: mailOptions }).then(function (response) {
                    
                // });
            });
        };
        $scope.getBaseUrl = function(){
            return $location.protocol() + "://" + location.host + "/#/pages/signin";
        }
    }
}());
