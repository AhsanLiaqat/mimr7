(function () {
        'use strict';

        angular.module('app')
            .controller('rolesCtrl', ['$scope', '$location', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', 'Query','RoleService', ctrlFunction]);

        function ctrlFunction($scope, $location, $filter, $routeParams, $http, AuthService, ModalService, Query, RoleService) {

            function init() {
                $scope.selected = [];
                $http.get("/users/list").then(function(res){
                    $scope.users = res.data;
                });
                $scope.listPage = true;


                if($scope.roles == undefined){
                    $scope.role = {};
                    $scope.selected = [];
                }
            }
            $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
            $scope.pageItems = 10;

            $scope.RoleTable = function (tableState) {
                $scope.isLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;

                $scope.user = Query.getCookie('user');
                RoleService.all().then(function(response){
                    $scope.roles = response.data;
                    $scope.sortByCreate = _.sortBy($scope.roles, function (o) { return new Date(o.createdAt); });
                    $scope.roles = $scope.sortByCreate.reverse();
                    $scope.a = _.sortBy($scope.roles, function (o) { return new Date(o.title); });

                    $scope.total = response.data.length;
                    var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
                    if (tableState.sort.predicate) {
                        filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                    }
                    var result = filtered.slice(start, start + number);
                    $scope.roles = result;
                    tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                    $scope.isLoading = false;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                
                // var path = "/settings/roles/all";
                // $http.get(path).then(function
                //     (response) {
                        
                // });
            };
            $scope.createModal = function() {
                ModalService.showModal({
                    templateUrl: "views/settings/roles/form.html",
                    controller: "rolesCreateCtrl",
                    inputs : {
                        role: undefined
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                         $('.modal-backdrop').remove();
                         $('body').removeClass('modal-open');
                         init();
                    });
                });

            };
            $scope.CreatePageTrue = function (){
                $scope.listPage = false;
                $scope.CreatePage = true ;
                $scope.role = {};
            }
            $scope.CreateRole = function (){
                if($scope.role.name == undefined){
                    toastr.error("Please Enter Role Name!");
                }else{
                    $scope.role.users = angular.copy($scope.selected);
                    RoleService.saveUserRole($scope.role).then(function(response){
                        toastr.success("Role saved successfully!");
                       if($scope.roles){
                        $scope.roles.unshift($scope.role);
                       }
                       else{
                        $scope.roles = [];
                        $scope.roles.unshift($scope.role);

                       }
                        $scope.listPageTrue();
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/roles/save-user-role', {data: $scope.role}).then(function(response) {
                        
                    // });
                }

            };
            $scope.update = function (){
                if($scope.role.name == undefined){
                    toastr.error("Please Enter Role Name!");
                }else{
                    $scope.role.users = angular.copy($scope.selected);
                    RoleService.updateUserRole($scope.role).then(function(response){
                        toastr.success("Role saved successfully!");
                        $scope.listPageTrue();
                        init();
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/roles/update-user-role', {data: $scope.role}).then(function(response) {
                        
                    // });
                }

            };
            $scope.listPageTrue = function (){
                $scope.CreatePage = false;
                $scope.listPage = true;
                $scope.editPage = false;
                $scope.role = {};
                $scope.selected = [];
                angular.forEach($scope.users, function(user, key1) {
                        user.checked = false;
                });
            };
            $scope.editPageTrue = function (){
                $scope.CreatePage = false;
                $scope.listPage = false;
                $scope.editPage = true;
            };
            $scope.selectUser = function(user){
                user.checked = !user.checked
                if (user.checked == false){
                    angular.forEach($scope.selected, function(Suser, key1) {
                        if (user.id == Suser.id){
                            $scope.selected.splice(key1, 1);
                        }
                    });
                }else{
                    user.name = user.firstName;
                    $scope.selected.push(angular.copy(user));
                }
            };

            $scope.editModal = function(role) {
                 ModalService.showModal({
                    templateUrl: "views/settings/roles/form.html",
                    controller: "rolesCreateCtrl",
                    inputs : {
                        role: role
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                         $('.modal-backdrop').remove();
                         $('body').removeClass('modal-open');
                         init();
                    });
                });
            };
            $scope.Edit = function(role){
                angular.forEach($scope.users, function(user, key1) {
                    angular.forEach(role.users, function(roleUser, key2) {
                        if (user.id == roleUser.id){
                         user.checked = true;
                         $scope.selected.push(angular.copy(roleUser));

                     }
                 });
                });
                $scope.editPageTrue();
                $scope.role = role;
            };
            $scope.deleteRole = function (role,index){
                var id = role.id;
                RoleService.delete(id).then(function(res){
                    toastr.success("Delete successful");
                    $scope.roles.splice(index,1);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            // $http.post("/settings/roles/remove", {id: id}).then(function(res) {
                
            // });
            }

            $scope.dateFormat = function(dat) {
                return moment(dat).utc().local().format('ll');
            };

            $scope.getUserName = function (user){
                return user.firstName +' '+ user.lastName;
            };

            init();

        }
    }());
