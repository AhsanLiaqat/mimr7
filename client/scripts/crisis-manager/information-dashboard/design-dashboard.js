(function () {
    'use strict';

    angular.module('app')
    .controller('designDashboardCtrl', ['$scope',
    '$rootScope',
    'close',
    '$routeParams',
    '$http',
    'AuthService',
    '$location',
    '$filter',
    'filterFilter',
    'accountSettings',
    'AccountService',
    'Query',
    ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        $routeParams,
        $http,
        AuthService,
        $location,
        $filter,
        filterFilter,
        accountSettings,
        AccountService,
        Query
    ) {

        function init(){
            $scope.sizes = ['8', '10', '12', '14', '16'];
            $scope.family = ['arial', 'courier', 'Helvetica', ' Times New Roman', 'Garamond'];
            $scope.accSetting = accountSettings;
            console.log($scope.accSetting);
            if(Query.getCookie('notification_toggle') != undefined){
                var notification_toggle = Query.getCookie('notification_toggle')
            }else{
                var notification_toggle = true;
            }
            $scope.layout = {notification: notification_toggle};
        }

        init();
        $scope.toggleNotification = function () { // tick
            $scope.layout.notification = $scope.layout.notification ? false : true;
            Query.setCookie('notification_toggle', $scope.layout.notification);
            if($scope.layout.notification == true){
                toastr.info("Notifications On");
            }else{
                toastr.info("Notifications Off");

            }

        };
        $scope.save = function(){
            AccountService.update($scope.accSetting).then(function(){
                close($scope.accSetting);
            },function(err){
                if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/accounts/update", {data: $scope.accSetting}).then(function(){
                
            // });
        }

        $scope.reset = function(){
            $scope.accSetting.category_header = '';
            $scope.accSetting.messages_font_size = '';
            $scope.accSetting.messages_font_family = '';
            AccountService.update($scope.accSetting).then(function(){
                close($scope.accSetting);
            },function(err){
                if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/accounts/update", {data: $scope.accSetting}).then(function(){
            //     close($scope.accSetting);
            // });

        }

        $scope.close = function(){
            close();
        }




    }
}
());
