(function () {
    'use strict';

    angular.module('app')
        .controller('contentLibraryCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','gameId','$timeout','Query','AccountService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,gameId,$timeout,Query, AccountService) {

        $scope.round={};
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        // fetch and get initial data
        function init() {
            
            $scope.newDate = new Date().toDateString();
            $scope.user = Query.getCookie('user');
            $scope.page1 = true;
            $scope.playGame = {};
            $scope.playGame.articleId = gameId;
            $http.get('/articles/all').then(function(res){
                $scope.articles = res.data;
            });
            $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                $scope.organizationList = response.data;
            });
        };
        init();

        $scope.getPlayerList = function(){
            $http.get('settings/organizations/get/'+ $scope.playGame.organizationId).then(function(res){
                $scope.organization = res.data;
            });
        }

        $scope.scheduleContent = function () {
            $scope.playGame.scheduled_date = new Date().toDateString();
            $http.post('/content-plan-templates/create', $scope.playGame)
            .then(function(response){
                $scope.close();
                toastr.success("Plan template created Successfully");
            });

        };

        


        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());
