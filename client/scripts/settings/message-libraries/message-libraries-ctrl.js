(function () {
    'use strict';

    angular.module('app')
        .controller('messageLibraryCtrl', ['$scope', 'ModalService', '$routeParams', '$http', 'AuthService', '$location', 'filterFilter','CustomMessageService', ctrlFunction]);

        function ctrlFunction($scope, ModalService, $routeParams, $http, AuthService, $location, filterFilter, CustomMessageService) {

            function init() {
                $scope.data = {};
                if($routeParams.id !== undefined){
                    CustomMessageService.get($routeParams.id).then(function(response){
                        $scope.data = response.data;
                        if($scope.data.msgTemplateType == 'Header' || $scope.data.msgTemplateType == 'Footer'){
                            $scope.data._content = $scope.data.content;
                        }
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get('/settings/custom-messages/get?id='+$routeParams.id).then(function(response) {
                        
                    // });
                }
                CustomMessageService.all().then(function(response){
                    $scope.customMessages = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/settings/custom-messages/all').then(function(response) {
                    
                // });
            }
            $scope.save = function(){
                if($scope.data.msgTemplateType == 'Header' || $scope.data.msgTemplateType == 'Footer'){
                    $scope.data.content = $scope.data._content;
                }
                CustomMessageService.save($scope.data).then(function(response){
                    $location.path("/settings/message-libraries");
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/custom-messages/save', {data: $scope.data}).then(function(response) {
                    
                // });
            };
            $scope.viewModal = function (msg) {
                ModalService.showModal({
                    templateUrl: "views/settings/message-libraries/view.html",
                    controller: "messageViewCtrl",
                    inputs: {
                        msg: msg
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            }

            $scope.destroy = function(id, index){
                CustomMessageService.delete(id).then(function(response){
                    $scope.customMessages.splice(index, 1);
                    toastr.success("Activity deleted successfully");
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.delete('/settings/custom-messages/remove?id='+id).then(function(response) {
                    
                // });
            }

            init();
        }
}());
