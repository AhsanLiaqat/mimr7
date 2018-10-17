(function () {
    'use strict';

    angular.module('app')
        .controller('dynamicFormTypeCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'filterFilter','ModalService','Query', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, filterFilter,ModalService,Query) {
        $scope.allFormType = function(){
            $http.get('form-types/list').then(function (response) {
                $scope.allFormTypes = response.data;
            });
        }
        $scope.allFormType();
        $scope.createAddFormType = function() {
            ModalService.showModal({
                templateUrl: "views/dynamic-form/add-form-type.html",
                controller: "dynamicAddFormTypeCtrl",
                inputs: {
                    list: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.allFormType();
                });
            });
        }
        $scope.editAddFormType = function(list,index) {
            ModalService.showModal({
                templateUrl: "views/dynamic-form/add-form-type.html",
                controller: "dynamicAddFormTypeCtrl",
                inputs: {
                    list: list
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.allFormType();
                });
            });
        }
        $scope.deleteAddFormType = function (formId, index) {
            console.log('+++++++++++++++++++++++++++',formId)
            $http.delete("form-types/remove/" + formId)
            .then(function(res){
                toastr.success('Player List deleted.', 'Success!');
                $scope.allFormType();
            });
        };
    }
}());