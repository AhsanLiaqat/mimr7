(function () {
    'use strict';

    angular.module('app')
        .controller('forgotPassCtrl', ['$scope', 'close', '$filter','$routeParams', '$http', 'AuthService', '$location','MailService', ctrlFunction]);

        function ctrlFunction($scope, close ,$filter,$routeParams, $http, AuthService, $location,MailService) {

             function init() {
                $scope.data = {};
                $scope.page1 = true;
             }

             init();

             $scope.close = function() {
 	            close();
             };
             $scope.getNumber = function (){
                $scope.page1 = false;
                $scope.Number = true;
             };
             $scope.FindUser = function(){
               $http.post('users/One',{data:$scope.data}).then(function(res) { 
                   $scope.user = res.data;
                   console.log($scope.user);
                   if($scope.user.id){
                    $scope.found = true;

                }else{
                    $scope.page3 =true;
                    $scope.page1 = false;
                }   
            });
           };
             $scope.retrivePassword = function(){
                 $http.post('users/findOne',{data:$scope.data}).then(function(res) { 
                 $scope.user = res.data;
                 if($scope.user.id){
                    $scope.page2 = true;
                    $scope.Number = false;
                    var data = {};
                    data.to = $scope.user.mobilePhone;
                    data.message = 'Your new CrisisHub password is: ' + $scope.user.password;
                    // console.log(data);
                    var mailOptions = {
                        from: 'noreply@crisishub.co',
                        to: $scope.user.email,
                        subject:  'Temporary password',
                        html: "<strong>Your new CrisisHub password:"+$scope.user.password+"</strong>"
                    };
                    MailService.send(mailOptions);
                    // $http.post('/mail/send', { data: mailOptions });
                    $http.post('api/Sms/smsPass', { data: data });

                    

                 }else{
                    $scope.page3 = true;
                    $scope.Number = false;

                 }   
                 });
            };

        }
        angular
        .module('app').directive("limitTo", [function() {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var limit = parseInt(attrs.limitTo);
                angular.element(elem).on("keypress", function(e) {
                    if (this.value.length == limit) e.preventDefault();
                });
            }
        }
}]);
}());
