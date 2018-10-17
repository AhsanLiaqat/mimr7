(function () {
    'use strict';

    angular.module('app')
    .controller('checkListCreateAttachCtrl', ['$scope', 'close', '$location', '$routeParams', 'ModalService', '$http', 'AuthService', 'checklist','$filter','incident','Query','CheckListService','IncidentCheckListService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, ModalService, $http, AuthService, checklist,$filter,incident,Query, CheckListService, IncidentCheckListService) {
        function init() {
            $scope.user = Query.getCookie('user');
            if(checklist !== null) {
                $scope.checkedList = checklist;
            }else{
                $scope.checkedList = {};
            }
            $scope.incident = incident;
            CheckListService.list($scope.user.userAccountId).then(function(response){
                $scope.check_lists = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "settings/check-lists/list?accountId=" + $scope.user.userAccountId;
            // $http.get(path).then(function (response) {
                
            // });
            $scope.load_checklist();

            $scope.heading = 'Create & Attach Checklist';
        }
        $scope.load_checklist = function(){
            CheckListService.list($scope.user.userAccountId).then(function(response){
                $scope.check_lists = response.data;
                angular.forEach($scope.check_lists, function(value){
                    if(value.all_category){
                        value.full_name = value.name + " ( " + value.all_category.name + " )";
                    }else{
                        value.full_name = value.name
                    }
                });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "settings/check-lists/list?accountId=" + $scope.user.userAccountId;
            // $http.get(path).then(function (response) {
                
            // });
        }
        $scope.createModal = function() {
            ModalService.showModal({
                templateUrl: "views/settings/check-lists/form.html",
                controller: "checkListCreateCtrl",
                inputs : {
                    checklist: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result && result !== ''){
                        console.log(result,"attach ctrl");
                        console.log('check_lists',$scope.check_lists);
                        console.log('result',result);
                        result.full_name = result.name;
                        if(result.all_category){
                            result.full_name+= " ( "+result.all_category.name+" )"                        
                        }
                        $scope.check_lists.push(result);
                        // close(result);
                        // $scope.load_checklist();
                    }
                });
            });
        };
        $scope.SelectCheckList = function () {
            var data = {};
            if ($scope.checkedList.length > 0) {
                if ($filter("filter")($scope.checkedList, { id: $scope.incident.checkList.id }).length > 0) {
                    toastr.error("Already Linked to current Incident!");
                }
                else {
                    data.incidentId = $scope.incident.id;
                    data.checkListId = $scope.incident.checkList.id;
                    IncidentCheckListService.save(data).then(function(response){
                        toastr.success("checkList Linked Successfully.");
                        $scope.close($scope.incident.checkList);
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/incident-check-list/save', { data: data }).then(function (response) {
                        

                    // });
                }
            } else {
                data.incidentId = $scope.incident.id;
                data.checkListId = $scope.incident.checkList.id;
                IncidentCheckListService.save(data).then(function(response){
                    toastr.success("checkList Linked Successfully.");
                    $scope.incident.checkList.tasks.forEach(function(elem){
                            elem.status = 'incomplete'
                    });
                    $scope.close($scope.incident.checkList);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/incident-check-list/save', { data: data }).then(function (response) {
                    
                // });
            }
        }
        $scope.close = function(obj) {
            close(obj);
        }
        init();
    }
}());
