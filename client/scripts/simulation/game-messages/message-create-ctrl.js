(function () {
    'use strict';

    angular.module('app')
        .controller('messageCreateCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','articleId','ModalService','messageId', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter,articleId,ModalService,messageId) {

        //close modal
        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };
        $scope.articleId = articleId;
        $scope.msgId = messageId;
        //fetch and set initial data
        function init() {
            $scope.user = Query.getCookie('user');
            $http.get('/articles/all').then(function (resp) {
                $scope.selectoptions = resp.data;
            });

            if($scope.msgId){
                $http.get('/messages/get?id=' + $scope.msgId).then(function (response) {
                    $scope.message = response.data;
                    $scope.articleId = $scope.message.articleId;
                });
                
            }
        }
        $scope.get_libraries =  function(gameId){
             $http.get('/simulation/game-libraries/all-for-game/'+gameId).then(function (response) {
                var library = response.data;
                _.each(library, function (doc) {
                    if(doc.mimetype !== null){
                        $scope.documents.push(doc);
                    }
                });
            });
        }


        //compute roles list to show
        $scope.computeRoles = function(id){
            $scope.rolesToShow = [];
            angular.forEach($scope.roles, function(value) {
              if(value.gamePlanId == $scope.message.gamePlanId){
                $scope.rolesToShow.push(value);
              }
            });
        }
        init();

        //save new game message
        $scope.submit = function () {
            $scope.message.articleId = $scope.articleId;
            if($scope.msgId){
                $http.post("/messages/update" , { data: $scope.message }).then(function (res) {
                    close(res.data);

                });
            }else{
                $http.post("/messages/save" , { data: $scope.message }).then(function (res) {
                    close(res.data);
                });
            }
        };

        //validates message input
        function validateForm() {
            if (!$scope.message.name || $scope.message.name === '') {
                toastr.error('Please provide a valid message name.', 'Error!');
                return false;
            }
            return true;
        }
    }
}());
