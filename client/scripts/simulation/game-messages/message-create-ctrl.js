(function () {
    'use strict';

    angular.module('app')
        .controller('messageCreateCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter', 'message','gamePlanId','ModalService', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter, message,gamePlanId,ModalService) {

        //close modal
        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };
        //fetch and set initial data
        function init() {
            $scope.message = message;
            if(message){
                $scope.message = message;
            }else{
                $scope.message = {};
            }

            $scope.documents = [];
            $scope.rolesToShow = [];
            $scope.orderSequence = [];
			$scope.gameTemplates = []
            for(var i = 0 ; i < 100 ; i++){
                $scope.orderSequence.push({id: i, value: i});
            }
            $http.get('/simulation/games/all').then(function (response) {
                $scope.gameTemplates = response.data;
            });
            
            $http.get('/simulation/game-roles/all').then(function (resp) {
                $scope.roles = resp.data;
                 angular.forEach($scope.roles, function(role) {
                    if(role.game_plan_team){
                        role.toshow = role.name+" - "+role.game_plan_team.name;
                    }else{
                        role.toshow = role.name;
                    }
                 });
                $scope.message = {};
                if(message === undefined){
                    $scope.heading = 'New Simulation Message';
                    $scope.message.type = 'Message';
                    if(gamePlanId){
                        $scope.found = true;
                        $scope.message.gamePlanId = gamePlanId;
                        $scope.computeRoles($scope.message.gamePlanId)
                        $scope.get_libraries(gamePlanId);
                    }
                }else{
                    $scope.message = message;
                    $scope.heading = 'Edit Simulation Message';
                    $scope.messageRoles = [];
                    console.log('roles',message.assigned_game_message);
                    if(message.assigned_game_message && message.assigned_game_message.roles){
                        angular.forEach(message.assigned_game_message.roles, function(value) {
                          $scope.messageRoles.push(value.id);
                        });
                    }
                    $scope.computeRoles(message.gamePlanId);
                    $scope.get_libraries($scope.message.gamePlanId);
                }
            });
            $scope.user = Query.getCookie('user');
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

        //create new game template
        $scope.addGameTemplate = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/game-template/add-game-template-name.html",
                controller: "createGameTemplateNameCtrl",
                inputs: {
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
					console.log(result);
                    if(result && result !== ''){
						$scope.gameTemplates.push(result)
                    }
                });
            });
        };

        //add new library media
        $scope.addnewdocument = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/game-libraries/form.html",
                controller: "newGameLibraryCtrl",
                inputs: {
                    gamePlanId: gamePlanId
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                     $('.modal-backdrop').remove();
                     $('body').removeClass('modal-open');
					 console.log('message lib',result);

					 if(result && result !== ''){
						 $scope.documents.push(result)
                     }
                });
            });
        };

        //save new game message
        $scope.submit = function () {
            if (validateForm()) {
                $scope.message.userAccountId = $scope.user.userAccountId;
                if($scope.message.id === undefined){
                    $http.post('/simulation/game-messages/save', { data: $scope.message })
                        .then(function (response) {
                            toastr.success("Message created.", "Success!");
                            var dat ={gameMessageId: response.data.id, userAccountId: $scope.user.userAccountId};
                            var data = {assignedMessage: dat, roles: $scope.messageRoles};
                            $http.post('/simulation/game-assign-messages/create', { data: data }).then(function (response) {
                                close($scope.message);
                            });
                        });
                } else {
                    $http.post('/simulation/game-messages/update', {data: $scope.message})
                        .then(function(response){
                            toastr.success("Message updated.", "Success!");
                            console.log('--------------',$scope.message);
                            if($scope.message.assigned_game_message){
                                var dat = {id: $scope.message.assigned_game_message.id ,gameMessageId: $scope.message.id, userAccountId: $scope.user.userAccountId};
                                var data = {assignedMessage: dat, roles: $scope.messageRoles};
                                $http.post('/simulation/game-assign-messages/update', { data: data }).then(function (response) {
                                });
                            }
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
