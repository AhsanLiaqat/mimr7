(function () {
    'use strict';
    angular.module('app')
    .controller('colorPalettesCtrl', ['$scope', '$location', '$routeParams', '$http', 'AuthService','ModalService','$filter','ColorPaletteService', ctrlFunction]);
    function ctrlFunction($scope, $location, $routeParams, $http, AuthService, ModalService, $filter, ColorPaletteService) {

        function init() {
            ColorPaletteService.list().then(function(res){
                $scope.categories = res.data;
                $scope.sortByCreate = _.sortBy($scope.categories, function (o) { return new Date(o.createdAt); });
                $scope.categories = $scope.sortByCreate.reverse();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/color-palettes/list").then(function(res){
                
            // });
        }
        $scope.editColor = function (color, index) {
            ModalService.showModal({
                templateUrl: "views/settings/color-palettes/form.html",
                controller: "colorPaletteCreateCtrl",
                inputs: {
                    color: color
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    init();
                });
            });
        };

        $scope.CreatePalette = function () {
            ModalService.showModal({
                templateUrl: "views/settings/color-palettes/form.html",
                controller: "colorPaletteCreateCtrl",
                inputs: {
                    color: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    init();
                });
            });
        };
        $scope.deleteColor = function (cat_Id, index) {
            var data = {};
            data.id = cat_Id;
            ColorPaletteService.delete(data.id).then(function(res){
                $scope.categories.splice(index, 1);
                toastr.success("Color deleted successfully");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/color-palettes/remove',{data: data}).then(function(res) {
                
            // });
        };
        init();
    }
}());
