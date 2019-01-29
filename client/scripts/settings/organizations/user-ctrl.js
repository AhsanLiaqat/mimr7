(function () {
    'use strict';

    angular.module('app')
        .controller('organizationsUsersCtrl', ['$scope','ModalService' ,'$location', '$routeParams', '$http', 'AuthService', 'Query', ctrlFunction]);

    function ctrlFunction($scope,ModalService, $location, $routeParams, $http, AuthService, Query) {

        function init() {
            $scope.orgId = $routeParams.OrgId;
            if($routeParams.id !== undefined) {
                console.log($routeParams.id);
                var data = {};
                data.id = $routeParams.id;
                $http.post("/users/get", {id: $routeParams.id}).then(function(response) {
                    $scope.data = response.data;
                });
            }
            $scope.user = Query.getCookie('user');
            $scope.data = {};
            $scope.data.userCountry = $scope.user.userCountry;
            $scope.data.countryCode = $scope.user.countryCode;
        }

        $scope.submit = function() {
            $scope.data.organizationId = $routeParams.OrgId
            $scope.data.userType = "External";
            if ($routeParams.id !== undefined) {
                $http.post('users/CheckEmail',{data: {email: $scope.data.email, 
                                                        id: $scope.data.id}})
                .then(function(res) {
                    if(res.data.length > 0){
                        toastr.error('User Aleardy Exist with Email provided!');
                    } else {
                        $http.post('/users/update', {data: $scope.data}).then(function(response) {
                            toastr.info("User updated successfully.");
                            $location.path('/settings/organizations/details/' + $scope.orgId);
                        });
                    }
                });
            } else {
                if ($scope.data.role != undefined) {
                    $http.post('users/One',{data: {email: $scope.data.email}}).then(function(res) {
                        if(res.data.id){
                            toastr.error('User Aleardy Exist with Email provided!');
                        }else{
                            $http.post('/users/create', {data: $scope.data}).then(function(response) {
                                toastr.success("User created successfully.");
                                $location.path('/settings/organizations/details/' + $scope.orgId);
                            });
                        }
                    });
                } else {
                    toastr.error("please fill require fields");
                }
            }
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
        };

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


        init();

    }

}());
