(function () {
    'use strict';

    angular.module('app.page')
        .controller('invoiceCtrl', ['$scope','ModalService', '$window', invoiceCtrl])
        .controller('authCtrl', authCtrl);

    function invoiceCtrl($scope, $window) {
        var printContents, originalContents, popupWin;
        
        $scope.printInvoice = function() {
            printContents = document.getElementById('invoice').innerHTML;
            originalContents = document.body.innerHTML;        
            popupWin = window.open();
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
    }

    function authCtrl($scope,ModalService, $window, $location, AuthService, $rootScope) {
        	$scope.data = {};
         
        	$scope.login = function() {
                AuthService.login($scope.data)
                .then(function(response) {
                }, function(error){
                });
            };

            $scope.signup = function() {
                $location.url('/')
            };

            $scope.reset =  function() {
                $location.url('/')
            };

            $scope.unlock =  function() {
                $location.url('/')
            };

            $scope.RetirvePass = function () {
                ModalService.showModal({
                    templateUrl: "views/pages/forgotPassModal.html",
                    controller: "forgotPassCtrl"
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };
    }

})(); 



