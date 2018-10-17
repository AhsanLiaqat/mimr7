(function () {
    'use strict';

    angular.module('app')
    .controller('checkListCreateCtrl', ['$scope', 'close', '$location', '$routeParams', 'ModalService', '$http', 'AuthService', 'checklist', 'Query','AllCategoryService','RoleService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, ModalService, $http, AuthService, checklist,Query, AllCategoryService, RoleService) {

        $scope.categories = [];
        function init() {
            $scope.user = Query.getCookie('user');
            RoleService.all().then(function(response){
                $scope.roles = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            
            // $http.get("/settings/roles/all").then(function (response) {
                
            // });
            AllCategoryService.list($scope.user.userAccountId).then(function(response){
                $scope.categories = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/all-categories/list?accountId=" + $scope.user.userAccountId).then(function(response) {
                
            // });
            if(checklist !== null) {
                $scope.checklist = checklist;
                $scope.heading = 'Edit Checklist';
            }else{
                $scope.checklist = {};
                $scope.heading = 'Create New Checklist';
            }
        }

        $scope.linkTaskModal = function() {
            if(($scope.checklist.name == undefined || $scope.checklist.name === "")){
                toastr.error("please fill required fields to continue");
            }else{
                ModalService.showModal({
                    templateUrl: "views/settings/check-lists/task-link-modal.html",
                    controller: "taskLinkModalCtrl",
                    inputs : {
                        checklist: $scope.checklist,
                        incident: null
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        if (result && result !== ''){
                            $scope.categories.forEach(function(category){
                                if(category.id == $scope.checklist.allCategoryId){
                                    result.all_category = category;
                                }
                            });
                            close(result);
                        }
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            }
        };

        $scope.createCategoryModal = function() {
            ModalService.showModal({
                templateUrl: "views/settings/all-categories/form.html",
                controller: "categoryCreateCtrl",
                inputs : {
                    category: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.categories.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        }

        $scope.validate = function(){
            if(($scope.checklist.name == undefined || $scope.checklist.name === "") ){
                return false;
            }else{
                if( $scope.checklist.tasks === "" || $scope.checklist.tasks == undefined){
                    return false;
                }else{
                    return true;
                }
            }
        }
        $scope.close = function() {
            close();
        }
        init();
    }
}());
