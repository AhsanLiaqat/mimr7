(function () {
    'use strict';

    angular.module('app')
        .controller('teamViewCtrl', ['$scope', 'close', '$filter','$routeParams', '$http', 'AuthService', '$location', 'team','IncidentTeamService', ctrlFunction]);

        function ctrlFunction($scope, close ,$filter,$routeParams, $http, AuthService, $location, team, IncidentTeamService) {
            function init() {
              $scope.team = team;
                   $http.get('/users/internalList').then(function(response) {
                       $scope.users = response.data;
                   });

                   $http.get('/users/externalList').then(function(response) {
                       $scope.externalUsers = response.data;
                   });

                   $scope.Id = $routeParams.id;
                   IncidentTeamService.get(team.id).then(function(response){
                    $scope.usersList = response.data.users;
                       angular.forEach($scope.usersList, function(suser, key1) {
                        angular.forEach($scope.users, function(user, key2) {
                          if (user.id == suser.id){
                            user.checked = true;
                          }
                        });
                      });
                       angular.forEach($scope.externalUsers, function(suser, key1) {
                        angular.forEach($scope.usersList, function(user, key2) {
                          if (user.id == suser.id){
                            suser.checked = true;
                          }
                        });
                      });
                       $scope.name = response.data.name;
                       $scope.teamType = response.data.teamType;
                       $scope.selectedUsers = angular.copy($scope.usersList);
                       console.log($scope.selectedUsers);
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
                   // var path = '/settings/incident-teams/get?id=' + team.id;
                   // $http.get(path).then(function(response) {
                       

                   // });
             
            }
            $scope.uncheck = function(user){
              user.checked = !user.checked
              if (user.checked == false){
                angular.forEach($scope.selectedUsers, function(suser, key1) {
                  if (user.id == suser.id){
                    $scope.selectedUsers.splice(key1, 1);
                  }
                });
              }else{
                    $scope.selectedUsers.push(angular.copy(user));
                  }
                    console.log($scope.selectedUsers);
            }
            function userList(users) {
                var user = function(id, name, dpt, title, role, org_name, email) {
                    this.id = id;
                    this.name = name;
                    this.department = dpt;
                    this.title = title;
                    this.role = role;
                    this.org_name = org_name
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

                    userList.push(new user(users[i].id, name, users[i].department, users[i].title, users[i].role, users[i].organization ? users[i].organization.name : '', users[i].email));
                }
                return userList;
            }

           function emailList(users) {
                var list = [];
                for(var i=0; i<users.length; i++) {
                    list.push(users[i].email);
                }
                return list;
            }

            init();
             $scope.close = function() {
 	            close();
             };
        }
}());
