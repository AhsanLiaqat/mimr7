(function () {
    'use strict';

    angular.module('app')
    .controller('resetCtrl', ['$scope',
        '$rootScope',
        'close',
        '$routeParams',
        '$http',
        'AuthService',
        '$location',
        'ColorPaletteService',
        ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        $routeParams,
        $http,
        AuthService,
        $location,
        ColorPaletteService
        ) {

        function init() {
            $scope.answer = '';
            ColorPaletteService.list().then(function(res){
                $scope.colorPalettes = res.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

            });
            // $http.get("/settings/color-palettes/list").then(function(res){
              
            // });
            $scope.selectedColorsArr = [];
        };
        init();

        $scope.selectedColors = function(c){
            if (c.checked){
                $scope.selectedColorsArr.push(c.color);
            }else{
                angular.forEach($scope.selectedColorsArr, function(value,key) {
                    if(value == c.color){
                        $scope.selectedColorsArr.splice(key, 1);
                    }
                });
            }
        }
        
        $scope.submit = function(){
            $scope.noSelectedColorsArr = [];
            angular.forEach($scope.colorPalettes, function(value,key) {
                if ($scope.selectedColorsArr.indexOf(value.color) < 0) {
                    $scope.noSelectedColorsArr.push(value.color);
                }
            });
            var data = {};
            data.answer = $scope.answer;
            data.notSelected = $scope.noSelectedColorsArr;
            console.log(data);
            close(data);
        }
    }
} ());
