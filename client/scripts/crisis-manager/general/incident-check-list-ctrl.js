(function () {
    'use strict';

    angular.module('app')
        .controller('incidentCheckListCtrl', ['$scope',
            '$rootScope',
            'close',
            'incident',
            'checkList',
            '$routeParams',
            '$http',
            'AuthService',
            'ModalService',
            '$location',
            '$filter',
            'filterFilter',
            'Query',
            'IncidentCheckListService',
            ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        incident,
        checkList,
        $routeParams,
        $http,
        AuthService,
        ModalService,
        $location,
        $filter,
        filterFilter,
        Query,
        IncidentCheckListService
    ) {
        $scope.getClass = function(status){
            if(status == 'na'){
                return "black_class";
            }else if(status == 'incomplete'){
                return "red_class";
            }
            else if(status == 'in progress'){
                return "yellow_class";
            }
            else if(status == 'completed'){
                return "green_class";
            }
            else if(status == 'overdue'){
                return "orange_class";
            }
        }
        $scope.statusOptions = [{ value: 'na', name: 'N/A' },
            { value: 'incomplete', name: 'No Information' },
            { value: 'in progress', name: 'In Progress' },
            { value: 'completed', name: 'Completed' },
            { value: 'overdue', name: 'Overdue' }];

        $scope.open_checklist_menu = function(){
            ModalService.showModal({
                templateUrl: "views/settings/check-lists/attach.html",
                controller: "checkListCreateAttachCtrl",
                inputs : {
                    checklist: $scope.checkedList,
                    incident: $scope.incident
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $scope.loadCheckLists();
                    if(result && result !== ''){
                        $scope.checklist_update($scope.checkedList);
                    }
                });
            });
        }
        $scope.linkTaskModal = function(list,event) {
            if((list.name == undefined || list.name === "")){
                toastr.error("please fill required fields to continue");
            }else{
                console.log(list)
                event.stopPropagation();
                event.preventDefault();
                ModalService.showModal({
                    templateUrl: "views/settings/check-lists/task-link-modal.html",
                    controller: "taskLinkModalCtrl",
                    inputs : {
                        checklist: list,
                        incident: $scope.incident
                    }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if (result && result !== ''){
                        close(result);
                    }
                });
            });
            }
        };
        $scope.taskInfo = function (activity) {
            ModalService.showModal({
                templateUrl: "views/actionPlanDashboard/task-info-modal.html",
                controller: "taskInfoModalCtrl",
                inputs: {
                    activity: activity,
                    showEditButton: false
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };


        $scope.loadCheckLists = function(){
            IncidentCheckListService.allCopies($scope.incident.id).then(function(response){
                $scope.clist = response.data;
                $scope.checkedList = [];
                angular.forEach($scope.clist, function(obj, key1) {
                    $scope.checkedList[key1] = angular.copy(obj.checkList);
                    $scope.checkedList[key1].createdAt = setDateFormat($scope.checkedList[key1].createdAt);
                    $scope.checkedList[key1].tasks = [];
                    angular.forEach(obj.incident_checkList_copies, function(t, key2) {
                        var task = t.task_list;
                        task.status = t.status;
                        $scope.checkedList[key1].tasks.push(task);
                    });
                    $scope.checkedList[key1].tasks = $filter('orderBy')($scope.checkedList[key1].tasks, 'title');
                });
                $scope.checkedList = $filter('orderBy')($scope.checkedList, 'name');
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = '/incident-check-list/all-copies?id=' + $scope.incident.id;
            // $http.get(path).then(function(response) {
                
            // });
        };

        $scope.checklist_update = function(checkList){
            $scope.checkedList = checkList;
            $scope.loadCheckLists();
        };

        function init() {
            $scope.incident = incident;
            $scope.user = Query.getCookie('user')
            $scope.checklist_update(checkList);
        };
        init();

        $scope.removeChecklist = function (item, index) {
            var data = {};
            data.incidentId = $scope.incident.id;
            data.checkListId = item.id;
            IncidentCheckListService.delete(data.checkListId,data.incidentId).then(function(response){
                toastr.success("checkList Unlinked!");
                $scope.checkedList.splice(index, 1);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/incident-check-list/remove', { data: data }).then(function (response) {
                
            // });
        };

        $scope.updateStatus =  function(list_id, task){
            var data = {};
            data.checkListId = list_id;
            data.taskId = task.id;
            data.taskStatus = task.status;
            data.incidentId = incident.id;
            IncidentCheckListService.updateTask(data).then(function(response){
                toastr.success("checkList Task Updated");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/incident-check-list/update-task', { data: data }).then(function (response) {
                
            // });
        };

        function setDateFormat(planDate) {
            return moment.utc(planDate).format('DD-MM-YYYY');
        }


        $scope.close = function () {
            close();
        };
    }
}());
