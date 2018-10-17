(function () {
    'use strict';

    angular.module('app')
        .controller('teamCreateCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location','IncidentTeamService', createFunction]);

        function createFunction($scope, $routeParams, $http, AuthService, ModalService, $location, IncidentTeamService) {

            function init() {
                $scope.selectedUsers = [];
                $scope.externalUsers = [];
                $http.get('/users/internalList').then(function(response) {
                    $scope.users = response.data;
                    console.log($scope.users);

                     $(".content").mCustomScrollbar({
                        axis:"y",
                        theme:"dark-3",
                        setTop: "0px",
                        advanced:{ autoExpandHorizontalScroll:true }
                    });

                });

                $http.get('/users/externalList').then(function(response) {
                    $scope.externalUsers = response.data;
                });
            }

            $scope.submit = function(name, users, teamType) {
                var emaillist = emailList(users);
                var userlist = userList(users);
                var data = {};
                data.name = name;
                data.users = userlist;
                data.emailList = emaillist;
                data.teamType = teamType;
                if(name != null){
                    IncidentTeamService.save(data).then(function(response){
                        toastr.success("Success");
                        $location.path('/settings/incident-teams');
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/incident-teams/save', {data: data}).then(function(response) {
                        
                    // });
               }else{
                    toastr.error('Please Provide team name');
               }

            }

            function emailList(users) {
                var list = [];
                for(var i=0; i<users.length; i++) {
                    list.push(users[i].email);
                }
                return list;
            }

            function userList(users) {
                var user = function(id, name, dpt, title, role, org_name, email) {
                    this.id = id;
                    this.name = name;
                    this.department = dpt;
                    this.title = title;
                    this.role = role;
                    this.org_name = org_name;
                    this.email = email;
                };

                var userList = [];
                var name = '';
                for(var i=0; i<users.length; i++) {
                    if(users[i].middleName !== null) {
                        name = users[i].firstName + ' ' + users[i].middleName + ' ' + users[i].lastName;
                    }
                    else {
                        name = users[i].firstName + ' ' + users[i].lastName;
                    }

                    userList.push(new user(users[i].id, name, users[i].department, users[i].title, users[i].role, users[i].organization ? users[i].organization.name : "" ,users[i].email));
                }
                return userList;
            }

            init();
        }
}());
