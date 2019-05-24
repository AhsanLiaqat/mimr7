(function () {
	'use strict';

	angular.module('app')
	.controller('dynamicFormViewCtrl', ['$scope', 'close', 'dynamicForm', 'Query','$http','tableInfo','detailed','sender','record', ctrlFunction]);

	function ctrlFunction($scope, close, dynamicForm, Query,$http,tableInfo, detailed,sender,record) {
		$scope.TEXT_FIELD = "TEXT_FIELD";
		$scope.TEXT_AREA = "TEXT_AREA";
		$scope.CHECK_BOX = "CHECK_BOX";
		$scope.SELECT_BOX = "SELECT_BOX";
		$scope.RADIO_BUTTON = "RADIO_BUTTON";
		$scope.detailed = detailed;
		function init() {
			$scope.model = {};
			$scope.model.data = [];
			$scope.user = sender;
			if(tableInfo == undefined){
				$scope.insertionMode = false
			}else {
				$scope.insertionMode = true
				$http.post('/dynamic-form-data/list',tableInfo).then(function(response){
					$scope.formData = response.data;
					var query = (record == 'user')? {userId: sender.id} : {gamePlayerId: sender.id}
					$scope.formData = Query.filter($scope.formData, query, false);
					if($scope.formData.length > 0){
						$scope.currentVersion = $scope.formData.length - 1;
						$scope.model.data = JSON.parse($scope.formData[$scope.currentVersion].data);
					}else{
						if(dynamicForm.formType && dynamicForm.formType.name == "Incident Questionnaire"){
							angular.forEach(dynamicForm.fields, function(field) {
								$scope.model.data[field.model] = 'no'
							});
						}
					}
				})
			}

			if(dynamicForm !== undefined) {
				$scope.form = dynamicForm;
			}else {
				close();
			}
		}
		$scope.prevVersion = function(){
			if($scope.currentVersion > 0){
				$scope.currentVersion -= 1;
				$scope.model.data = $scope.formData[$scope.currentVersion].data;
				console.log('prev',$scope.model.data);
			}else {
				toastr.warning("No more older version available.")
			}
		}
		$scope.nextVersion = function(){
			if($scope.currentVersion < $scope.formData.length-1){
				$scope.currentVersion += 1;
				$scope.model.data = $scope.formData[$scope.currentVersion].data;
				console.log('next',$scope.model.data);
			}else {
				toastr.warning("This is a letest version.")
			}
		}
		$scope.letestVersion = function(){
			if($scope.formData.length > 0){
				$scope.currentVersion = $scope.formData.length-1;
				$scope.model.data = $scope.formData[$scope.currentVersion].data;
			}else {
				toastr.warning("Nothing in draft.")
			}
			console.log('letest',$scope.model.data);
		}
		$scope.fieldTypes = [
			{name: 'Text Field', val: $scope.TEXT_FIELD},
			{name: 'Text Area', val: $scope.TEXT_AREA},
			{name: 'Check Box', val: $scope.CHECK_BOX},
			{name: 'Select Box', val: $scope.SELECT_BOX},
			{name: 'Redio Button', val: $scope.RADIO_BUTTON}
		]

		$scope.close = function() {
			close();
		}
		$scope.submit = function(model) {
			var dataObj = {};
			for (var key in model) {
				eval('dataObj.'+ key + "=model[key]")
			}
			var obj = {
				dynamicFormId: dynamicForm.id,
				data: JSON.stringify(dataObj),
				userAccountId: $scope.user.userAccountId,
				tableName: tableInfo.tableName,
				tableId: tableInfo.tableId
			};
			if(record == 'player')
				obj.gamePlayerId = $scope.user.id;
			else
				obj.userId = $scope.user.id;

			$http.post('/dynamic-form-data/save',obj).then(function(response){
				console.log(response);
				close(response);
			});
		}

		init();

	}
}());
