(function () {
    'use strict';

    angular.module('app')
        .controller('createAssignMessageModalCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'filterFilter', 'roles','gameId','Query','Msgindex', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, AuthService, filterFilter, roles, gameId,Query,Msgindex) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        //fetch and set initial data
        function init() {
            $scope.documents = [];
            $scope.roles = roles || [];
            // angular.forEach($scope.roles, function(role,ind){
            //     role.nametoshow = 
            // })

            // if(gameId){
            //     $scope.message.gamePlanId = gameId;
            // }
            $http.get('/simulation/games/all').then(function (response) {
                $scope.gameTemplates = response.data;
            });
            $http.get('/simulation/game-libraries/all').then(function (response) {
                var library = response.data;
                _.each(library, function (doc) {
                    if(doc.mimetype !== null){
                        $scope.documents.push(doc);
                    }
                });
            });
            $scope.user = Query.getCookie('user');
        }

        init();
        
        // save and assign message to game or edit
        $scope.submit = function () {
            if (validateForm()) {
                $scope.message.userAccountId = $scope.user.userAccountId;
                if($scope.message.id === undefined){
                    $http.post('/simulation/game-messages/save', { data: $scope.message })
                    .then(function (response) {
                        var assignedMessage = {
                            gameMessageId: response.data.id,
                            userAccountId: $scope.user.userAccountId
                        }
                        
                        $http.post('/simulation/game-assign-messages/save', { data: assignedMessage, roles : $scope.messageRoles })
                        .then(function (re) {
                            var messag = {
                                setOffTime: new Date(),
                                copy: false,
                                activated: true,
                                index : Msgindex || 0,
                                activatedAt: new Date(),
                                status: 'incomplete',
                                assignedGameMessageId: re.data.id,
                                gamePlanTemplateId: gameId,
                                gameMessageId: response.data.id,
                                userAccountId: $scope.user.userAccountId
                            }
                            $http.post('/simulation/schedule-game-messages/save', { data: messag })
                            .then(function (response) {
                                toastr.success("Message created.", "Success!");
                                close(response.data);
                            });     
                        });
                    });
                } else {
                    $http.post('/simulation/game-messages/update', {data: $scope.message})
                        .then(function(response){
                            toastr.success("Message updated.", "Success!");
                            if ($scope.message.libId) {
                                $scope.message.game_library = {id: $scope.message.libId};
                                var docName = filterFilter($scope.documents, {"id": $scope.message.libId})[0];
                                $scope.message.game_library.title = docName.title;
                            }
                            close($scope.message);
                        });
                }
            }
        };

        function validateForm() {
            if (!$scope.message.name || $scope.message.name === '') {
                toastr.error('Please provide a valid message name.', 'Error!');
                return false;
            }
            return true;
        }
    }
}());