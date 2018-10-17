(function () {
    'use strict';

    angular.module('app')
    .controller('taskInfoModalCtrl', ['$scope',
    'close',
    '$http',
    'AuthService',
    'activity',
    'showEditButton',
    '$sce',
    'Query',
    'ModalService',
    'TaskService',
    'IncidentActivityService',
    ctrlFunction]);

    function ctrlFunction($scope,
        close,
        $http,
        AuthService,
        activity,
        showEditButton,
        $sce,
        Query,
        ModalService,
        TaskService,
        IncidentActivityService
    ) {

        function init() {
            $scope.user = Query.getCookie('user');
            $scope.activity = activity;
            $scope.showEditButton = showEditButton;
            IncidentActivityService.getTask($scope.activity.id).then(function(result){
                $scope.taskList = result.data.task_list;

                console.log(result);
                if ($scope.taskList && $scope.taskList.links && $scope.taskList.links.indexOf('https') !== -1){
                    $scope.taskList.links =  $scope.taskList.links.replace('https://','');
                }else if($scope.taskList && $scope.taskList.links && $scope.taskList.links.indexOf('http') !== -1){
                    $scope.taskList.links =  $scope.taskList.links.replace('http://','');
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/incident-activities/get-task/' + $scope.activity.id)
            // .then(function (result) {
                
            //     // console.log("==================");
            // }, function (error) {
            //     toastr.error(error, 'Error!');
            // });

        };
        init();

        // $scope.shortUrl = function (url) {
        //     console.log("url ===========>>>> ");
        //     if (url.indexOf('https') !== -1){
        //         return url.replace('https://','');
        //     }else if(url.indexOf('http') !== -1){
        //         return url.replace('http://','');
        //     }else{
        //         return url
        //     }
        // };
        $scope.editTask = function(task) {
            ModalService.showModal({
                templateUrl: "views/settings/task-libraries/form.html",
                controller: "editTaskWizardCtrl",
                inputs: {
                    Task : task
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    TaskService.get($scope.activity.id).then(function(response){
                        console.log('Edited task',response);
                        $scope.activity = response.data
                        $scope.closeStatus = true;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get('/settings/tasks/get?id=' + $scope.activity.id).then(function (response) {
                        
                    // });
                });
            });
        };
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }
        $scope.close = function () {
            close($scope.closeStatus);
        };
    }
}());
