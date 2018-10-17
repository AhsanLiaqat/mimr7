(function () {
    'use strict';

    angular.module('app')
    .controller('dynamicFormCreateCtrl', ['$scope', 'close', '$location', '$routeParams', '$http', 'AuthService', 'dynamicForm', '$timeout', 'Query','DynamicFormService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http, AuthService, dynamicForm, $timeout, Query, DynamicFormService) {
        $scope.TEXT_FIELD = "TEXT_FIELD";
        $scope.TEXT_AREA = "TEXT_AREA";
        $scope.CHECK_BOX = "CHECK_BOX";
        $scope.SELECT_BOX = "SELECT_BOX";
        $scope.RADIO_BUTTON = "RADIO_BUTTON";
		$scope.position = 0;
        function getOptionObject(){
            return {label: "",value: ""};
        }
        function getFieldObject(){
            var fieldObj = {
                label: "",
                type: $scope.TEXT_FIELD,
				model: makeModel(),
				position: $scope.position++,
                options:[],
                description: ""
            }
            fieldObj.options.push(getOptionObject())
            return fieldObj;
        }
        function init() {
    //         var formObj = {
    //             name: "",
				// heading: "",
    //             formType: "",
    //             fields: []
    //         }
            $scope.user = Query.getCookie('user');
            $http.get("/form-types/list").then(function(response){
                $scope.formTypes = response.data;
            })
			$scope.form = dynamicForm;
            // formObj.fields.push(getFieldObject());
            if(dynamicForm !== {}) {
                $scope.CompleteForm = dynamicForm;
            }else {
                $scope.form = formObj
            }
        }
		function makeModel() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

			for (var i = 0; i < 10; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
		}


        $scope.fieldTypes = [
            {name: 'Text Field', val: $scope.TEXT_FIELD},
            {name: 'Text Area', val: $scope.TEXT_AREA},
            {name: 'Check Box', val: $scope.CHECK_BOX},
            {name: 'Select Box', val: $scope.SELECT_BOX},
            {name: 'Radio Button', val: $scope.RADIO_BUTTON}
        ]
        $scope.addField = function(){
            $scope.form.fields.push(getFieldObject());
        }
        $scope.removeField = function(index){
            $scope.form.fields.splice(index,1);;
        }
        $scope.addOptions = function(index){
            console.log($scope.form.fields,'=====================',index);
            $scope.form.fields[index].options.push(getOptionObject())
        }
        $scope.removeOptions = function(field,option){
            console.log("field",field,'option',option);
            $scope.form.fields[field].options.splice(option,1);
            // $scope.form.fields[index].push($scope.optionObj)
        }
        $scope.checkFieldType = function(type){
            console.log(type);
        }
        $scope.submit = function(form) {
            if(form && form.id){
                form.userAccountId = $scope.user.userAccountId;
                DynamicFormService.update(form).then(function(response){
                    console.log('-asdas-d-as-d--------------',response);
                    if(response.data.success == false){
                        toastr.warning("This Form Type doesnt allow multiple form making!");
                    }else{
                        toastr.success("Form updated successfully!");
                        close(form);
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/dynamic-form/update', {data: dynamicForm}).then(function(response) {
                    
                // });

            }else{
                form.userAccountId = $scope.user.userAccountId;
                DynamicFormService.save(form).then(function(response){
                    if(response.data.success == false){
                        toastr.warning("This Form Type doesnt allow multiple form making!");
                    }else{
                        toastr.success("dynamicForm saved successfully!");
                        close(response.data);
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/dynamic-form/save', {data: data}).then(function(response) {
                    
                // });
                
                
            }
            
        }

        $scope.close = function() {
   //          if($scope.CompleteForm){
			// $scope.CompleteForm.obj = JSON.stringify($scope.CompleteForm.obj)                
   //          }
            close();
        }
        init();
    }
}());
