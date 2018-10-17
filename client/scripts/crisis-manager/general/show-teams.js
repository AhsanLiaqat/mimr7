(function () {
    'use strict';

    angular.module('app')
    .controller('showTeamsCtrl', ['$scope',
    '$rootScope',
    'close',
    '$routeParams',
    '$http',
    'AuthService',
    '$location',
    '$filter',
    'filterFilter',
    'IncidentTeamService',
    'MailService',
    ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        $routeParams,
        $http,
        AuthService,
        $location,
        $filter,
        filterFilter,
        IncidentTeamService,
        MailService
    ) {
        $scope.users={};
        $scope.userStatus=false;
        $scope.numPerPageOpt = [3, 5, 10, 20];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.filteredActivities = [];
        $scope.filteredUsers = [];
        $scope.selected = 0;

        function init() {
            $http.get("/users/list").then(function(res){
                $scope.users = res.data;
                $scope.filteredUsers = $scope.users;
                $scope.search();
            });
            // Get teams to show drop down
            IncidentTeamService.list().then(function(res){
                $scope.incidents_teams=res.data;
                $scope.incidents_teams.unshift({id: 0, name: 'All'});
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/incident-teams/list").then(function(res){
                
            // });
        };
        init();

        $scope.sendActivation = function(user){
            console.log(user);
            var sendto =user.email;
            var mailOptions = {
                from: 'noreply@crisishub.co',
                to: sendto.toString(),
                subject:  'Activation Email',
                html: 'Welcome to crisishub! you are now a registered member.<br>Please update your password using the information below<br><p>Your Email: '+user.email+'</p><br><p>Temporary password: '+user.password+'</p>' + "<br>" + $scope.getBaseUrl()
            };

            MailService.send(mailOptions).then(function(response){
                $http.post('/users/updateActivationEmail', {data: user}).then(function(response){
                    toastr.success('Email sent successfully.', 'Success!');
                });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/mail/send', { data: mailOptions }).then(function (response) {
                
            // });
        };

        $scope.getBaseUrl = function(){
            return $location.protocol() + "://" + location.host + "/#/pages/invite";
        }


        $scope.showUsers=function(team){
            //  console.log(team,'hasjkhdk');
            var team = filterFilter($scope.incidents_teams, { 'id': team})[0];
            if(team.id == 0){
                $scope.filteredUsers = $scope.users;
                $scope.search();
            }else{
                $scope.filteredUsers = [];
                angular.forEach($scope.users, function (user, ind) {
                    angular.forEach(user.incidents_teams, function (u_team, index) {
                        if(u_team.name == team.name){
                            $scope.filteredUsers.push(user);
                        }
                    });
                });
                $scope.search();
            }
        };
        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            $scope.currentPageActivities = $scope.filteredActivities.slice(start, end);
        };
        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };
        $scope.search = function() {
            $scope.filteredActivities = $filter('filter')($scope.filteredUsers, $scope.searchKeywords);
            return $scope.onFilterChange();
        };
        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };
        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredActivities = $filter('orderBy')($scope.filteredActivities, rowName);
            $scope.select($scope.currentPage);
        };

        $scope.userStatusClass = function(user){
            return user.available ? 'user-present' : 'user-absent';
        };

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        $scope.close = function(){
            close();
        };

        $scope.toggle = function (user) {
            console.log(user.available);
            user.available = user.available? false:true;
            $http.post("/users/updateStatus",  {data: user})
            .then(function (response) {
                toastr.success('User status updated.', 'Success!');
            });

        };





    }
}
());
