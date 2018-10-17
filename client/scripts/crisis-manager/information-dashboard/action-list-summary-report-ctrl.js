(function () {
    'use strict';

    angular.module('app')
        .controller('summarReportActionListCtrl', ['$scope',
            '$rootScope',
            'close',
            '$routeParams',
            '$http',
            'AuthService',
            'ModalService',
            '$location',
            '$filter',
            'filterFilter',
            'Query',
            'action_list',
            'incident',
            'IncidentCheckListService',
            'ActionService',
            'ReportService',
            ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        $routeParams,
        $http,
        AuthService,
        ModalService,
        $location,
        $filter,
        filterFilter,
        Query,
        action_list,
        incident,
        IncidentCheckListService,
        ActionService,
        ReportService
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


        // $scope.loadCheckLists = function(){
        //     var path = '/incident-check-list/all-copies?id=' + $scope.incident.id;
        //     $http.get(path).then(function(response) {
        //         $scope.clist = response.data;
        //         $scope.checkedList = [];
        //         angular.forEach($scope.clist, function(obj, key1) {
        //             $scope.checkedList[key1] = angular.copy(obj.checkList);
        //             $scope.checkedList[key1].createdAt = setDateFormat($scope.checkedList[key1].createdAt);
        //             $scope.checkedList[key1].tasks = [];
        //             angular.forEach(obj.incident_checkList_copies, function(t, key2) {
        //                 var task = t.task_list;
        //                 task.status = t.status;
        //                 $scope.checkedList[key1].tasks.push(task);
        //             });
        //             $scope.checkedList[key1].tasks = $filter('orderBy')($scope.checkedList[key1].tasks, 'title');
        //         });
        //         $scope.checkedList = $filter('orderBy')($scope.checkedList, 'name');
        //     });
        // };

        // $scope.checklist_update = function(checkList){
        //     $scope.checkedList = checkList;
        //     $scope.loadCheckLists();
        // };

        function init() {
            $scope.summaryPage = true;
            $scope.action_list = action_list;
            $scope.user = Query.getCookie('user')
            $scope.incident = incident;
            $scope.actions = $scope.action_list.actions;
            angular.forEach($scope.action_list.actions, function(action, index){
                action.show = true;
            });

            // $scope.checklist_update(checkList);
        };
        init();

        // $scope.toggleInformationZoom = function () {
        //     return $scope.layout.zoomout ? 'col-zoom-out' : '';
        // }
        $scope.actionDueDateFormat = function (dat) {
            return moment(dat).utc().local().format('DD-MM-YYYY');
        };
        $scope.updateClass = function (action) { // tick
            ActionService.update(action).then(function(res){
                action.edit = false;
                action.ex = false;
                toastr.success("Category updated successfully");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/actions/update', { data: action }).then(function (res) {
                
            // });
        };
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
        $scope.summaryEditor = function(){ // tick
            $scope.summaryEditorPage = true;
            $scope.summaryPage = false;
            $scope.actions = Query.sort($scope.actions, 'user.firstName',false,false);
            $scope.status_report = '<h3>Incident Name: '  + $scope.incident.name + '</h3><h3>Report Issued Date: ' + $filter('date')(new Date(), "HH:mm dd-MM-yyyy") + '</h3>';
            $scope.status_report += '<h3>Sender Name: '  + $scope.user.firstName + ' ' + $scope.user.lastName + '</h3>';
            $scope.status_report += '<h4>Action List: '  + $scope.action_list.name+'</h4><br>';

            var grouped = _.groupBy($scope.actions, function(member) {
              return (member.user)?member.user.firstName : 'Others';
            });
            console.log(grouped,grouped.length);
            var keys = Object.keys(grouped);
            for (var i = 0; i < keys.length; i++) {
                $scope.status_report += '<h2>' + keys[i] + ': </h2>';
                angular.forEach(grouped[keys[i]], function(obj, indx) {
                    var inddx = indx + 1;
                    $scope.status_report += '<h3>'+ inddx + '.  ' + obj.name +'</h3>'
                    if(obj.dueDate)
                        $scope.status_report += '<h4>'+'Due Date: ' + $scope.actionDueDateFormat(obj.dueDate) +'</h4>'
                    else
                        $scope.status_report += '<h4>'+' No Due Date Selected</h4>'
                    $scope.status_report += '<br>';
                });
                // if($scope.actions[i].dueDate){
                //     $scope.status_report += '</h2> <p> Due Date: ' + $scope.actionDueDateFormat($scope.actions[i].dueDate) + '</p>';
                // }else{
                //     $scope.status_report += '</h2> <p> Due Date: ' + 'No Due Date Specified' + '</p>';
                // }
                // if ($scope.actions[i].user)
                //     $scope.status_report += '<h2>Action Assigned to: '+ $scope.actions[i].user.firstName +'</h2>'
                // $scope.status_report += '<br>';
            }
        };

        $scope.Printsummary = function (){ // tick
            var printContents = $scope.status_report;
            var popupWin = window.open('', '_blank', 'width=1000,height=800');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        }
        $scope.saveReport = function() { // tick
            var data = {};
            data.content = $scope.status_report;
            data.date = moment().utc().format();
            data.incidentName =  $scope.incident.name;
            data.incidentId =  $scope.incident.id;
            ReportService.save(data).then(function(response){
                toastr.success("Report saved successfully.");
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/status-report/reports.email.html",
                    controller: "summaryReportsMailCtrl",
                    inputs: {
                        incident: $scope.incident,
                        report: $scope.status_report,
                        report_id: response.data.id
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/reports/save', {data: data}).then(function(response) {
                
            // });
        }

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
