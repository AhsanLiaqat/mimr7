(function () {
	'use strict';

	angular.module('app.account').controller('accountCtrl', ['$scope','$location', '$timeout','ModalService', 'Upload','AuthService', '$filter', '$http', 'user','Query','DepartmentService','AccountService','RoleService','LocationService', accountCtrl]);

	function accountCtrl($scope, $location, $timeout,ModalService, Upload, AuthService,$filter, $http, user,Query,DepartmentService,AccountService, RoleService, LocationService) {
		$scope.user = {role: 'admin'};
		$scope.accounts = [{country: ''}];

		var defaultCountry = [{id: '', nicename: 'Select Country'}];
		var defaultAccount = {countryId: '', type: ''};
		var defaultLocation = {address1: '', address2: '', address3:'', city:'', state:'', type:'primary', userAccountId: ''};
		//userAccountId

		$scope.user = user;
		$scope.user.role = 'admin';
		$scope.user.password = '';
		$scope.accounts = defaultAccount;
		$scope.locations = [defaultLocation];
		$scope.isAccountSettings = true;

		function init() {

			var user = Query.getCookie('user');
			$http.post('users/get', {id: $scope.user.id}).then(function(res) {
				$scope.data = res.data;
				if($scope.data.countryCode){
					$scope.num_str = $scope.data.countryCode;
				}
			});

			RoleService.all().then(function(response){
				$scope.roles = response.data;
			},function(err){
				if(err)
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			});
			// var path = "/settings/roles/all";
			// $http.get(path).then(function(response) {
				
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
			// 	(response) {
					
			// 	});
			AccountService.get($scope.user.userAccountId).then(function(res){
					if(res.data !== ''){
					$scope.accounts = res.data;
					LocationService.get($scope.accounts.id).then(function(response){
						$scope.locations = response.data;
						console.log('+++++++++++++++++==========',$scope.locations)
					},function(err){
						if(err)
							toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
						else
							toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
					});
					// var location =  '/settings/locations/get?id=' + $scope.accounts.id;		
					// $http.get(location).then(function(response) {
						
					// });
				}
			},function(err){
				if(err)
					toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
				else
					toastr.error(AccountService.GENERAL_ERROR_MSG,'Custom Error')
			});
			// var path = '/settings/accounts/get?id=' + $scope.user.userAccountId;
			// $http.get(path).then(function(res) {

			// });
		}

		init();

		$scope.callback = function (selectedCountryObj) {
			$scope.num_str = selectedCountryObj.code;
			$scope.data.countryCode = $scope.num_str;

		};

		$scope.saveAccount = function() {
			populateLocation($scope.accounts);
			AccountService.update($scope.accounts).then(function(response){
				saveLocation();
				 $http.post('users/update', {data: $scope.data}).then(function(res) {
				toastr.success("Account updated successfully");
                });
				},function(err){
					if(err)
						toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
					else
						toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
				});
			// $http.post('/settings/accounts/update', {data: $scope.accounts}).then(function(response) {
				
			// });
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


		function populateLocation() {
			for(var i=0; i<$scope.locations.length; i++) {
				$scope.locations[i].userAccountId = $scope.accounts.id;
			}
		}

		function saveLocation() {
			if ($scope.locations && $scope.locations[0]){
                $scope.locations[0].type = "primary";
                populateLocation();
                LocationService.save($scope.locations).then(function(res){

                },function(err){
                	if(err)
                		toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                	else
                		toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/locations/save', { locations:$scope.locations }).then(function(res) {
                // });
			}
		}

		$scope.uploadFiles = function(file, errFiles, type) {
			var avatar = file;
			if(avatar) {
				avatar.upload = Upload.upload({
					url: '/users/test',
					data: { file: avatar, type: type }
    			});

				avatar.upload.then(function (response) {
					$timeout(function () {
						if(response.data.type == 'User') {
							$scope.user.avatar = response.data.path;

						}
						else if(response.data.type == 'Organization') {
							$scope.accounts.avatar = response.data.path;
						}
					});
				}, function (response) {
					if (response.status > 0)
						$scope.errorMsg = response.status + ': ' + response.data;
				}, function (evt) {
					avatar.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
			}

		};

	};

})();
