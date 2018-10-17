(function () {
    'use strict';

    angular.module('app')
    .controller('colorPaletteCreateCtrl', ['$scope', 'close', '$routeParams', '$http', 'color','Query','ColorPaletteService', ctrlFunction]);
    function ctrlFunction($scope, close, $routeParams, $http, color,Query, ColorPaletteService) {
        function init() {
            if($routeParams.id !== undefined) {
                $scope.classId = $routeParams.id;
            }
            $scope.selectedUsers = [];
            $scope.externalUsers = [];
            $(".content").mCustomScrollbar({
                axis:"y",
                theme:"dark-3",
                setTop: "0px",
                advanced:{ autoExpandHorizontalScroll:true }
            });
            if(color){
                $scope.data = color;
                $scope.usersList = color.users;

                $http.get('/users/internalList').then(function(response) {
                    $scope.users = response.data;
                    angular.forEach($scope.usersList, function(suser, key1) {
                        angular.forEach($scope.users, function(user, key2) {
                            if (user.id == suser.id){
                                user.checked = true;
                                // selectedUsers.push(user);
                            }else {
                                // user.checked = false;
                            }
                        });
                    });
                });

                $http.get('/users/externalList').then(function(response) {
                    $scope.externalUsers = response.data;
                    angular.forEach($scope.usersList, function(suser, key1) {
                        angular.forEach($scope.externalUsers, function(user, key2) {
                            if (user.id == suser.id){
                                user.checked = true;
                                // selectedUsers.push(user);
                            }else {
                                // user.checked = false;
                            }
                        });
                    });
                });
                $scope.selectedUsers = angular.copy($scope.usersList);
            }else{
                $http.get('/users/internalList').then(function(response) {
                    $scope.users = response.data;
                });
                $http.get('/users/externalList').then(function(response) {
                    $scope.externalUsers = response.data;
                });
                $scope.data = {};
            }
            $scope.user = Query.getCookie('user');
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

        $scope.submit = function() {
            console.log('Color Palette Submit',users);
            var usersAll = $scope.externalUsers.concat($scope.users)
            var users=[];
            angular.forEach(usersAll,function(user){
                if(user.checked){
                    users.push(user)
                }
            });
            $scope.data.users = userList(users);
            if($scope.data.id === undefined) {
                $scope.data.userAccountId = $scope.user.userAccountId;
                ColorPaletteService.save($scope.data).then(function(response){
                    toastr.success("Color Palette saved successfully!");
                    close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/color-palettes/save', {data: $scope.data}).then(function(response) {
                    
                // });
            }
            else {
                $scope.data.incident = null;
                ColorPaletteService.save($scope.data).then(function(response){
                    toastr.success("Color Palette updated successfully!");
                    close();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/color-palettes/save', {data: $scope.data}).then(function(response) {
                    
                // });
            }

        };
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

        $scope.close = function() {
            close();
        }
        init();
    }
}());
