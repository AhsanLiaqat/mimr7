(function () {
    'use strict';

    angular.module('app')
        .controller('generateEmailsActiveGamesCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','gameId','$timeout','$window','Query','MailService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,gameId,$timeout,$window,Query, MailService) {

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        //fetch and  set some initial data
        function init() {
            $scope.user = Query.getCookie('user');
            $scope.playGame = {};
            $scope.showButton="Next";
            $scope.emails = [];
            $scope.gmails = [];
            $scope.gameMessages = [];
            $scope.gameId = gameId;
            $http.get('/simulation/schedule-games/play-game-summary/' + $scope.gameId).then(function (response) {
                $scope.playGame = response.data;
                $scope.time = new Date($scope.playGame.start_time).getTime();
                $scope.gameMessages = $scope.playGame.template_plan_messages;
                $scope.templatePlanMessagesShow = _.sortBy($scope.gameMessages, function(o) { return  o.index });
                angular.forEach($scope.playGame.roles, function(role,ind){
                    if(role.user){
                        var wow = $scope.emails.filter(function(email){ return email === role.user.email });
                        if(wow.length == 0 ){
                            $scope.emails.push(role.user.email);
                        }
                    }
                });
                angular.forEach($scope.emails, function(email,ind){
                    $scope.gmails.push({text: email});
                });
                $scope.message = "\n\n\n\n\n\n\n\n\n\n\n\n"+$window.location.origin+"/#/pages/simulationLogin";
            });
            
        };
        init();

        //send emails to all
        $scope.sendEmails = function(){
            angular.forEach($scope.gmails, function(email,ind){
                var mailOptions = {
                    from: 'noreply@crisishub.co',
                    to: email.text,
                    subject:  $scope.subject,
                    html: $scope.message
                };
                MailService.send(mailOptions).then(function(response){

                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

                });
                // $http.post('/mail/send', { data: mailOptions }).then(function (response) {

                // });
                close();
            });
        }

        $scope.setOffTimeFormat = function (dat) {
            return moment(dat).utc().local().format('mm:ss');
        };
        
        $scope.getUserName = function (user) {
            return user.firstName + ' ' + user.lastName;
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());