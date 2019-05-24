(function () {
	'use strict';

	angular.module('app')
	.controller('dynamicFormDataViewCtrl', ['$scope', 'close', 'Query','$http','form_data','form','game_player','detailed', ctrlFunction]);

	function ctrlFunction($scope, close, Query, $http, form_data, form, game_player, detailed) {
		$scope.TEXT_FIELD = "TEXT_FIELD";
		$scope.TEXT_AREA = "TEXT_AREA";
		$scope.CHECK_BOX = "CHECK_BOX";
		$scope.SELECT_BOX = "SELECT_BOX";
		$scope.RADIO_BUTTON = "RADIO_BUTTON";
		$scope.detailed = detailed;
		function init() {
			$scope.model = {};
			$scope.model.data = [];
			$scope.model.data = JSON.parse(form_data.data);
		
			if(form !== undefined) {
				$scope.form = form;
			}else {
				close();
			}
			$scope.game_player = game_player;
			if($scope.form.formType && $scope.form.formType.name == "Incident Questionnaire"){
				angular.forEach($scope.form.fields, function(field) {
					$scope.model.data[field.model] = 'no'
				});
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
				close(response);
			});
		}

		init();

	}
}());
