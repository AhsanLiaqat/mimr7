(function () {
    'use strict';

    angular.module('app')
        .controller('newGameRoleModalCtrl', ['$scope',
            'close',
            '$http',
            'AuthService',
            'role',
            'gamePlanId',
            'gamePlanTeamId',
            'sequence',
            'ModalService',
            ctrlFunction]);
    function ctrlFunction($scope,
                          close,
                          $http,
                          AuthService,
                          role,
                          gamePlanId,
                          gamePlanTeamId,
                            sequence,
                          ModalService
    ) {
        //fetch and set initial data
        function init() {
            $scope.orderSequence = [];
            for(var i = 0 ; i < 21 ; i++){
                $scope.orderSequence.push({id: i, value: i});
            }
            $scope.tinymceOptions = {
                statusbar: false,
                menubar: false,
                plugins: 'print',
                height:  '500px',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | print '
            };
            $scope.data = angular.copy(role) || {};
            if(sequence != null){
                $scope.sequence = sequence;
                $scope.data.order = 0;
            }

            if(gamePlanId != null){
                $scope.found = true;
                $scope.data.gamePlanId = gamePlanId;
                $http.get('/simulation/game-teams/get-teams-for-games/'+gamePlanId).then(function (response) {
                    $scope.teams = response.data;
                    if(gamePlanTeamId != null){
                        $scope.foundtoo = true;
                        $scope.data.gamePlanTeamId = gamePlanTeamId;
                    }
                });
            }else{
                if($scope.data.gamePlanId){
                    $http.get('/simulation/game-teams/get-teams-for-games/'+$scope.data.gamePlanId).then(function (response) {
                        $scope.teams = response.data;
                    });
                }
            }
            $http.get('/simulation/games/all').then(function (response) {
                $scope.gameTemplates = response.data;
            });
        };
        init();

        //open modal to add new game template
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
                    init();
                    $('body').removeClass('modal-open');
                    if(result && result !== ''){  
                    }
                });
            });
        };

        //opens modal to create new team 
        $scope.addTeam = function(){
            ModalService.showModal({
                templateUrl: "views/simulation/game-template/add-team-modal.html",
                controller: "addTeamModalCtrl",
                inputs: {
                    gamePlanId: $scope.data.gamePlanId
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $http.get('/simulation/game-teams/get-teams-for-games/'+$scope.data.gamePlanId).then(function (response) {
                        $scope.teams = response.data;
                    });
                    $('body').removeClass('modal-open');
                    if(result && result !== ''){  
                    }
                });
            });  
        }

        //get all teams of given game from server
        $scope.getTeams = function(id){
            $http.get('/simulation/game-teams/get-teams-for-games/'+id).then(function (response) {
                $scope.teams = response.data;
            });
        } 

        //save or edit simulation roles
        $scope.submit = function () {
            if (!$scope.data.name || $scope.data.name === ''){
                toastr.error('Enter valid name','Error!');
            } else{
                if (role){
                    $http.put('/simulation/game-roles/update/' + role.id, $scope.data)
                        .then(function (result) {
                            toastr.success('Role updated','Success!');
                            close($scope.data);
                        }, function (error) {
                            toastr.error(error, 'Error!');
                        })
                }else{
                    $scope.data.order = 0;
                    $http.post('/simulation/game-roles/save', $scope.data)
                        .then(function (result) {
                            toastr.success('Role created','Success!');
                            close(result.data);
                        }, function (error) {
                            toastr.error(error, 'Error!');
                        })
                }
            }
        };

        //close modal
        $scope.close = function () {
            close();
        };
    }
}());