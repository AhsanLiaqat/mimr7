(function () {
    'use strict';

    angular.module('app')
        .controller('usersCtrl', ['$rootScope','$scope', 'ModalService', '$location', '$routeParams', 'Upload', '$timeout', '$filter', 'AuthService', '$http','Query','DepartmentService','AccountService','RoleService','LocationService', usersCtrl]);

    function usersCtrl($rootScope,$scope, ModalService, $location, $routeParams, Upload, $timeout, $filter, AuthService, $http, Query, DepartmentService, AccountService, RoleService, LocationService) {
        $scope.users = [];
        $('.modal-backdrop').remove();
        $('body').removeClass('.modal-open');
        $scope.user = Query.getCookie('user');

        function init() {
            RoleService.all().then(function(response){
                $scope.roles = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // path = "/settings/roles/all";
            // $http.get(path).then(function
            // (response) {
                
            // });
            DepartmentService.getAll($scope.user.userAccountId).then(function(response){
                $scope.departments = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/settings/departments/all?userAccountId=" + $scope.user.userAccountId ;
            // $http.get(path).then(function
            //     (response) {
                    
            // });
            $http.get('users/list').then(function(res) {
                $scope.usersList = res.data;
                $scope.currentPageStores = res.data;
            });
            if($routeParams.id !== undefined) {
                $http.post('users/get', {id: $routeParams.id}).then(function(res) {
                    $scope.data = res.data;
                    $scope.temp = [];
                    _.each($scope.data.roles, function(role){
                        $scope.temp.push(role.id);
                    });
                    $scope.data.roles = $scope.temp;
                    setPreference();
                });
            }else if($scope.user && $scope.user.userAccountId){
                $http.post('users/get', {id: $scope.user.id}).then(function(res) {
                    $scope.data = res.data;
                    $scope.temp = [];
                    _.each($scope.data.roles, function(role){
                        $scope.temp.push(role.id);
                    });
                    $scope.data.roles = $scope.temp;
                    setPreference();
                });
            };


            AuthService.user().then(function(response) {
                // var path = '/settings/accounts/get?id=' + response.userAccountId;
                if(response.id !== undefined) {
                    AccountService.get(response.userAccountId).then(function(account){
                        if(account.data.id !== undefined) {
                            LocationService.get(account.data.id).then(function(locations){
                                $scope.locations = locations.data;
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // var query = '/settings/locations/get?id=' + account.data.id;
                            // $http.get(query).then(function(locations) {
                               
                            // });
                        }
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get(path).then(function(account) {
                        
                    // });
                }
            });
        }
        var setPreference = function(){
            $scope.allow = false;
            if($scope.user.id == $scope.data.id){
                $scope.allow = false;
            }else if($scope.user.role == 'admin'){
                $scope.allow = true;
            }else if($scope.user.role == 'CA'){
                if($scope.data && ($scope.data.role == 'admin' || $scope.data.role == 'CA')){
                    $scope.allow = false;
                }else{
                    $scope.allow = true;
                }
            }
        }

        init();

        $scope.searchKeywords = '';

        $scope.filteredStores = [];

        $scope.row = '';

        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageStores = $scope.filteredStores.slice(start, end);
        };

        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.onOrderChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.search = function() {
            $scope.filteredStores = $filter('filter')($scope.usersList, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredStores = $filter('orderBy')($scope.usersList, rowName);
            return $scope.onOrderChange();
        };

        $scope.numPerPageOpt = [3, 5, 10, 20];

        $scope.numPerPage = $scope.numPerPageOpt[2];

        $scope.currentPage = 1;

        $scope.currentPageStores = [];
        $scope.callback = function (selectedCountryObj) {
            $scope.num_str = selectedCountryObj.code;
        };
        $scope.departmentModal = function () {
            ModalService.showModal({
                templateUrl: "views/settings/departments/form.html",
                controller: "departmentModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    console.log(result);
                    $scope.departments.push(result);
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.createRole = function() {
            ModalService.showModal({
                templateUrl: "views/settings/roles/form.html",
                controller: "rolesCreateCtrl",
                inputs : {
                    role: "undefined"
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $scope.roles.push(result);
                   $('.modal-backdrop').remove();
                   $('body').removeClass('modal-open');
               });
            });
        }
        $scope.submitUser = function() {
            if($scope.data.id === undefined) {
                $scope.data.countryCode = $scope.num_str;
                $http.post('/users/create', {data: $scope.data}).then(function(res) {
                    toastr.success("User added successfully");
                    $location.path('/settings/users');
                    $scope.data = '';
                });
            }
            else {
                $scope.data.countryCode = $scope.num_str;
                $scope.newdata = {};
                $scope.newdata.email = $scope.data.email
                $scope.newdata.id = $scope.data.id
                if($scope.allow){
                    if($scope.new_pass && $scope.new_pass.length > 0){
                        if($scope.new_pass == $scope.confirm_pass){
                            $scope.data.new_pass = $scope.new_pass;
                        }else{
                            toastr.warning("Confirmation Password doesn't match!");
                            return;
                        }
                    }else{
                        toastr.warning("Please Enter New Password.!");
                        return;
                    }
                }else{
                    if($scope.current_pass && $scope.current_pass.length > 0){
                        $scope.data.current_pass = $scope.current_pass;
                        if($scope.new_pass && $scope.new_pass.length > 0){
                            if($scope.new_pass == $scope.confirm_pass){
                                $scope.data.new_pass = $scope.new_pass;
                            }else{
                                toastr.warning("Confirmation Password doesn't match!");
                                return;
                            }
                        }else{
                            toastr.warning("Please Enter New Password.!");
                            return;
                        }
                    }else{
                        if($scope.new_pass && $scope.new_pass.length > 0){
                            if($scope.new_pass == $scope.confirm_pass){
                                $scope.data.new_pass = $scope.new_pass;
                            }else{
                                toastr.warning("Confirmation Password doesn't match!");
                                return;
                            }
                        }else{
                            toastr.warning("Please Enter New Password.!");
                            return;
                        }
                    }
                }
                // if($scope.user.role != 'admin'){
                //     if($scope.current_pass && $scope.current_pass.length > 0){
                //         $scope.data.current_pass = $scope.current_pass;
                //         if($scope.new_pass && $scope.new_pass.length > 0){
                //             if($scope.new_pass == $scope.confirm_pass){
                //                 $scope.data.new_pass = $scope.new_pass;
                //             }else{
                //                 toastr.warning("Confirmation Password doesn't match!");
                //                 return;
                //             }
                //         }else{
                //             toastr.warning("Please Enter New Password.!");
                //             return;
                //         }
                //     }
                // }else{
                //     //admin
                //     if($scope.data && $scope.user && $scope.data.id == $scope.user.id){
                //         if($scope.current_pass && $scope.current_pass.length > 0){
                //             $scope.data.current_pass = $scope.current_pass;
                //             if($scope.new_pass && $scope.new_pass.length > 0){
                //                 if($scope.new_pass == $scope.confirm_pass){
                //                     $scope.data.new_pass = $scope.new_pass;
                //                 }else{
                //                     toastr.warning("Confirmation Password doesn't match!");
                //                     return;
                //                 }
                //             }else{
                //                 toastr.warning("Please Enter New Password.!");
                //                 return;
                //             }
                //         }
                //     }else{
                //         if($scope.new_pass && $scope.new_pass.length > 0){
                //             if($scope.new_pass == $scope.confirm_pass){
                //                 $scope.data.new_pass = $scope.new_pass;
                //             }else{
                //                 toastr.warning("Confirmation Password doesn't match!");
                //                 return;
                //             }
                //         }
                //     }
                // }
                // $http.post('users/CheckEmail',{data:$scope.data}).then(function(res) {
                //     console.log('what is response',res)
                // if(res.data.length > 0){
                //     toastr.error('User Aleardy Exist with Email provided!');
                // }
                // else{
                    console.log($scope.data);
                $http.post('users/update', {data: $scope.data}).then(function(res) {
                    if(res.data.success == false){
                        toastr.warning(res.data.message);
                    }else{
                        toastr.info("Update successful");
                        if($scope.user.id == $scope.data.id){
                            $rootScope.userNam = $scope.data.firstName + ' ' + $scope.data.lastName
                        }
                        if ($location.path() !== '/pages/profile'){
                            $location.path('/settings/users');
                        };
                    }
                });
               
             // }
                // });
            }
        }
        $scope.clear_image = function(){
            if($scope.data && $scope.data.id){
                $http.get('/users/clear-image/'+$scope.data.id).then(function(res) {
                    $scope.data.avatar = '';
                    toastr.success("Image Deleted successful!");
                });
            }
        }
        $scope.uploadFiles = function(file, errFiles) {
			var avatar = file;
			if(avatar) {
				avatar.upload = Upload.upload({
					url: '/users/avatar',
					data: { file: avatar }
    			});

				avatar.upload.then(function (response) {
					$timeout(function () {
            console.log(response);
						$scope.data.avatar = response.data.path;
					});
				}, function (response) {
					if (response.status > 0)
						$scope.errorMsg = response.status + ': ' + response.data;
				}, function (evt) {
					avatar.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
			}

		}

       function deleteUser() {
            $http.post('/users/delete', { id: $scope.selectedUser }).then(function(res) {
                toastr.success("Delete request successful!");
                init();
                $location.path('/settings/users');
            });
        }

    };

})();
