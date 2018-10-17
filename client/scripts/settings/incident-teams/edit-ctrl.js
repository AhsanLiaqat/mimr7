(function () {
    'use strict';

    angular.module('app')
        .controller('teamEditCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location','IncidentTeamService', editFunction]);

        function editFunction($scope, $routeParams, $http, AuthService, ModalService, $location, IncidentTeamService) {

            function init() {
               if($routeParams.id !== undefined) {

                   $http.get('/users/internalList').then(function(response) {
                       $scope.users = response.data;
                   });

                   $http.get('/users/externalList').then(function(response) {
                       $scope.externalUsers = response.data;
                   });

                   $scope.Id = $routeParams.id;
                   IncidentTeamService.get($routeParams.id).then(function(response){
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
                   // var path = '/settings/incident-teams/get?id=' + $routeParams.id;
                   // $http.get(path).then(function(response) {
                       

                   // });
               }
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

            $scope.update = function(name, users) {
                var data = {};
                data.id = $routeParams.id;
                data.name = name;
                data.users = $scope.selectedUsers;
                data.teamType = $scope.teamType;
                data.emailList = emailList(users);
                if(data.name != null){
                  IncidentTeamService.update(data).then(function(response){
                    toastr.success("Update Successful");
                    $location.path('/settings/incident-teams');
                  },function(err){
                    if(err)
                      toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                      toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                  });
                // $http.post('/settings/incident-teams/update', {data: data}).then(function(response) {
                    
                // });
              }else{
                toastr.error("Please Fill out required fields.")
              }


            }

           function emailList(users) {
                var list = [];
                for(var i=0; i<users.length; i++) {
                    list.push(users[i].email);
                }
                return list;
            }

            init();
        }
}());
