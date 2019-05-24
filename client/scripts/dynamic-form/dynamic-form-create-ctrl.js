(function () {
    'use strict';

    angular.module('app')
    .controller('dynamicFormCreateCtrl', ['$scope', 'close', '$location', '$routeParams', '$http', 'AuthService', 'dynamicForm', '$timeout', 'Query', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http, AuthService, dynamicForm, $timeout, Query) {
        $scope.TEXT_FIELD = "TEXT_FIELD";
        $scope.TEXT_AREA = "TEXT_AREA";
        $scope.CHECK_BOX = "CHECK_BOX";
        $scope.SELECT_BOX = "SELECT_BOX";
        $scope.RADIO_BUTTON = "RADIO_BUTTON";
		$scope.position = 0;
        function getOptionObject(){
            return {label: "",value: ""};
        }
  //       var modaltoValue = {
  //           "alert_teams" : {templateUrl:'views/home/alert-team-modal.html',controller:'alertTeamModalCtrl'},
  //           "sitrap": {templateUrl: "views/crisis-manager/information-dashboard/summary-report-template.html",controller: "dashboardCtrl"}
  //       }
        
  //       $scope.pagesHelp = {
  //           "dashboard": [{
  //               id: "Check_list",
  //               name: "Checklist",
  //               position: 'right',
  //               color: '#ffffff'
  //           },{
  //               id: "Design_Buttons",
  //               name: "Desgin Buttons",
  //               position: 'right',
  //               color: '#ffffff'
  //           },{
  //               id: "Function_Buttons",
  //               name: "Function Buttons",
  //               position: 'left',
  //               color: '#ffffff'
  //           },{
  //               id: "Incomming_Messages",
  //               name: "Incomming Messages",
  //               position: 'right',
  //               color: '#ffffff'
  //           },
  //           {
  //               id: "Toggle_Messages",
  //               name: "Toggle Messages",
  //               position: 'top',
  //               color: '#ffffff'
  //           }],
  //           "actionPlanDashboardV2": [{
  //               id: "Function_Buttons",
  //               name: "Function Buttons",
  //               position: 'left',
  //               color: '#ffffff'
  //           },{
  //               id: "Check_list",
  //               name: "Checklist",
  //               position: 'right',
  //               color: '#ffffff'
  //           }]
  //       }

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
            $scope.froalaOptionsForMessage = {
                toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"]
            }
    //         var formObj = {
    //             name: "",
				// heading: "",
    //             formType: "",
    //             fields: []
    //         }
            $scope.form = angular.copy(dynamicForm);
            $scope.user = Query.getCookie('user',true);
            // $http.get("/form-types/list").then(function(response){
                
            //     $scope.formTypes = response.data;
            //     $scope.form = angular.copy(dynamicForm);
            //     if($scope.form.id){
            //         $scope.saveType($scope.form.formTypeId);
            //     }
            // })
            // formObj.fields.push(getFieldObject());
            // if(dynamicForm !== {}) {
            //     $scope.CompleteForm = angular.copy(dynamicForm);
            // }else {
            //     $scope.form = angular.copy(formObj);
            // }
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
            $scope.form.fields.splice(index,1);
        }
  //       $scope.includeLink = function(field){
  //           if(field.link_present)field.link = { type : 'text' };
  //           $scope.checkLinkType(field.link);
  //       }
        $scope.addOptions = function(index){
            $scope.form.fields[index].options.push(getOptionObject())
        }
        $scope.removeOptions = function(field,option){
            $scope.form.fields[field].options.splice(option,1);
        }
  //       $scope.checkLinkType = function(link){
  //           link.address = (link.type == 'text')? "dashboard" : "{templateUrl: 'views/home/alert-team-modal.html',controller: 'alertTeamModalCtrl'}";
  //       }
  //       
  //       $scope.checkFieldType= function(field){
  //           field.helpType = Query.filter($scope.pagesHelp[$scope.form.page_link], { id: field.helpTypeId}, true);
  //       }
  //       $scope.saveType = function(typeId){
  //           $scope.selectedType = Query.filter($scope.formTypes, { id: typeId}, true);
  //       }
  //       $scope.saveTypeHelp = function(name){
  //           return ($scope.selectedType && name == $scope.selectedType.name )? true: false;
  //       }
        $scope.submit = function(form) {
            if(form && form.id){
                $http.post('/dynamic-form/update', {data: form}).then(function(response) {
                    toastr.success("dynamicForm saved successfully!");
                    close(form);
                });

            }else{
                $http.post('/dynamic-form/save', {data: form}).then(function(response) {
                    toastr.success("dynamicForm saved successfully!");
                    close(response.data);
                });
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
