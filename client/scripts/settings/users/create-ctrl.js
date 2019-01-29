(function () {
    'use strict';

    angular.module('app')
        .controller('usersCreateCtrl', ['$scope', 'ModalService', '$location', '$routeParams', 'Upload', '$timeout', '$filter', 'AuthService', '$http','Query','AccountService', usersCreateCtrl]);

    function usersCreateCtrl($scope, ModalService, $location, $routeParams, Upload, $timeout, $filter, AuthService, $http,Query, AccountService) {

        $scope.user = Query.getCookie('user');
        function init() {
            $scope.data = {};
            $scope.data.userCountry = $scope.user.userCountry;
            $scope.data.countryCode = $scope.user.countryCode;
            AuthService.user().then(function(response) {
                if(response.id !== undefined) {
                    AccountService.get(response.id).then(function(account){
                        if(account.data.id !== undefined) {
                            LocationService.get(account.data.id).then(function(locations){
                                $scope.locations = locations.data;
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                        }
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                }
            });
        }

        init();

     
        $scope.submitUser = function() {
            if($scope.num_str != undefined){
            $scope.data.countryCode = $scope.num_str;
            }
            
            if($scope.user.role == 'admin'){
                $http.post('users/One',{data:$scope.data}).then(function(res) {   
                    if(res.data.id){
                        toastr.error('User Aleardy Exist with Email provided!');
                    }else{

                        if($scope.data.role != undefined){
                            $http.post('/users/create', {data: $scope.data}).then(function(res) {
                                toastr.success("User added successfully");
                                $location.path('/settings/users');
                                $scope.data = '';
                            });
                        }else{
                            toastr.error("please fill require fields");
                        }
                    }
                });
            }else { 
                if($scope.data.role != undefined){
                    $http.post('/users/create', {data: $scope.data}).then(function(res) {
                        toastr.success("User added successfully");
                        $location.path('/settings/users');
                        $scope.data = '';
                    });
                }else{
                    toastr.error("please fill require fields");
                }

            }
        }
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
        };
        $scope.saveAndSend = function(){
            if($scope.num_str != undefined){
                $scope.data.countryCode = $scope.num_str;
            }
            
            if($scope.user.role == 'admin'){
                $http.post('users/One',{data:$scope.data}).then(function(res) {   
                    if(res.data.id){
                        toastr.error('User Aleardy Exist with Email provided!');
                    }else{
                        if($scope.data.role != undefined){
                            $http.post('/users/create', {data: $scope.data}).then(function(res) {
                                toastr.success("User added successfully");
                                $scope.sendActivation();
                                $location.path('/settings/users');
                                $scope.data = '';
                            });
                        }else{
                            toastr.error("please fill require fields");
                        }
                    }
                });
            }else {

            if($scope.data.role != undefined){
            $http.post('/users/create', {data: $scope.data}).then(function(res) {
                toastr.success("User added successfully");
                $scope.sendActivation();
                $location.path('/settings/users');
                $scope.data = '';
            });
        }else{
            toastr.error("please fill require fields");
        }
        }
        }
        
        $scope.getBaseUrl = function(){
            return $location.protocol() + "://" + location.host + "/#/pages/invite";
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

    };

})(); 