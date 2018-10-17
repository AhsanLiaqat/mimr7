(function () {
    'use strict';

    angular.module('app')
    .controller('editClassSummaryCtrl', ['$scope',
    'close',
    '$http',
    '$location',
    '$filter',
    'filterFilter',
    'accountSettings',
    'AccountService',
    'class',
    'Query',
    'ClassService',
    ctrlFunction]);

    function ctrlFunction($scope,
        close,
        $http,
        $location,
        $filter,
        filterFilter,
        accountSettings,
        AccountService,
        clas,
        Query,
        ClassService
    ) {
        if(clas){
            $scope.Toclass = clas;
        }
        
        function init(){
            $scope.user = Query.getCookie('user');

            $scope.froalaOptions = {
                toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"]
            }
            $scope.sizes = ['8', '10', '12', '14', '16'];
            $scope.family = ['arial', 'courier', 'Helvetica', ' Times New Roman', 'Garamond'];
            $scope.accSetting = accountSettings;
            console.log($scope.accSetting);
        }

        init();

        $scope.updateClass = function (cls) { // tick
                ClassService.update(cls).then(function(res){
                    $scope.close(cls);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            };
        $scope.close = function(params){
            (params)? close(params) : close();
        }

    }
}
());
