(function () {
    'use strict';

    angular.module('app')
    .controller('teamActivateCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location','MailService', teamFunction]);

    function teamFunction($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, MailService) {

        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.usersTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            $http.get("/users/list").then(function(response){
                $scope.users = response.data;
                $scope.a = _.sortBy($scope.users, function (o) { return new Date(o.firstName); });
                _.each($scope.users, function (user) {
                    user.name = user.firstName +'  '+ user.lastName;
                });
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }

                var result = filtered.slice(start, start + number);

                $scope.users = result;

                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            });
        };
        $scope.getBaseUrl = function(){
            return $location.protocol() + "://" + location.host + "/#/pages/invite";
        }
        $scope.sendActivation = function(user){
            console.log(user);
            var sendto =user.email;
            var mailOptions = {
                from: 'noreply@crisishub.co',
                to: sendto.toString(),
                subject:  'Activation Email',
                html: 'Welcome to crisishub! you are now a registered member.<br>Please update your password using the information below<br><p>Your Email: '+user.email+'</p><br><p>Temporary password: '+user.password+'</p>' + "<br>" + $scope.getBaseUrl()
            };

            MailService.send(mailOptions).then(function(response){
                $http.post('/users/updateActivationEmail', {data: user}).then(function(response){
                    toastr.success('Email sent successfully.', 'Success!');
                });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/mail/send', { data: mailOptions }).then(function (response) {
                
            // });
        };
        $scope.close = function(){
            close();
        };
    }
}());
