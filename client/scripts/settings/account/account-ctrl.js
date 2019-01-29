(function () {
	'use strict';

	angular.module('app.account').controller('accountCtrl', ['$scope','$location', '$timeout','ModalService', 'Upload','AuthService', '$filter', '$http', 'user','Query','AccountService', accountCtrl]);

	function accountCtrl($scope, $location, $timeout,ModalService, Upload, AuthService,$filter, $http, user,Query,AccountService) {
		$scope.user = {role: 'admin'};
		$scope.accounts = [{country: ''}];

		var defaultCountry = [{id: '', nicename: 'Select Country'}];
		var defaultAccount = {countryId: '', type: ''};
		//userAccountId

		$scope.user = user;
		$scope.user.role = 'admin';
		$scope.user.password = '';
		$scope.accounts = defaultAccount;
		
		$scope.isAccountSettings = true;

		function init() {

			var user = Query.getCookie('user');
			$http.post('users/get', {id: $scope.user.id}).then(function(res) {
				$scope.data = res.data;
				if($scope.data.countryCode){
					$scope.num_str = $scope.data.countryCode;
				}
			});

			// RoleService.all().then(function(response){
			// 	$scope.roles = response.data;
			// },function(err){
			// 	if(err)
			// 		toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
			// 	else
			// 		toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			// });
			// var path = "/settings/roles/all";
			// $http.get(path).then(function(response) {
				
			// });
			// DepartmentService.getAll($scope.user.userAccountId).then(function(response){
			// 	$scope.departments = response.data;
			// },function(err){
			// 	if(err)
			// 		toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
			// 	else
			// 		toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
			// });
			// var path = "/settings/departments/all?userAccountId=" + $scope.user.userAccountId ;
			// $http.get(path).then(function
			// 	(response) {
					
			// 	});
			AccountService.get($scope.user.userAccountId).then(function(res){
					if(res.data !== ''){
					$scope.accounts = res.data;
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
