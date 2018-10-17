(function () {
    'use strict';

    angular.module('app')
        .controller('NewGameTemplateMakingCtrl', ['$scope', 'close', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'filterFilter','gameId','Query', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, $filter, AuthService, $location, ModalService, filterFilter,gameId,Query) {

        //fetch and set initial data
        function init() {
            $scope.searchKeywords = '';
            $scope.currentPage = 1;
            $scope.numPerPageOpt = [3, 5, 10, 20];
            $scope.row = '';
            $scope.numPerPage = $scope.numPerPageOpt[1];

            $scope.page1 = true;
            $scope.action = [];
            $scope.typeOptions = [];
            $scope.expand = false;
            $scope.activityExpand = false;
            $scope.user = Query.getCookie('user');
            $scope.types = [
                {id: 0, name: 'Simulation Games'},
                {id: 1, name: 'Information Manager Games'} 
            ]

            $http.get("/simulation/game-categories/all").then(function (res) {
                $scope.categories = res.data;
            });
            if(gameId != null){
                $http.get('/simulation/games/get/' + gameId)
                .then(function (response) {
                    $scope.data = response.data;
                    $scope.data.planDate = $filter('date')($scope.data.planDate ,"EEEE, dd, MMMM, yyyy");
                });
            }else{
                var date = $filter('date')(new Date(), 'EEEE, dd, MMMM, yyyy');
                $scope.data = {};
                $scope.data.planDate = date;
            }

            $http.get('/simulation/game-messages/all?userAccountId='+$scope.user.userAccountId)
            .then(function (response) {
                $scope.gameMessages = response.data;
            });

            $http.get('/simulation/game-roles/all').then(function (response) {
                $scope.roles = response.data;
            });

            $http.get('/simulation/game-assign-messages/all?userAccountId=' + $scope.user.userAccountId)
                .then(function (response) {
                    $scope.assignedMessages = response.data;
                    $scope.assignedMessages = $filter('orderBy')($scope.assignedMessages, 'game_message.name');

                    $scope.search();
                    $scope.select($scope.currentPage);
                });
        };
        init();

        // do pagination
        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            $scope.currentPageMessages = $scope.filteredAssignedMessages.slice(start, end);
        };

        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        $scope.onOrderChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.search = function() {
            $scope.filteredAssignedMessages = $filter('filter')($scope.assignedMessages, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredAssignedMessages = $filter('orderBy')($scope.assignedMessages, rowName);
            return $scope.onOrderChange();
        };

        //add new game type
        $scope.addGameCategory = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/categories/form.html",
                controller: "newGameCategoryCtrl",
                inputs:{
                    category: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result && result !== ''){
                        $scope.categories.push(result);
                    }
                });
            });
        };

        //create team 
        $scope.createTeam = function(){
            $scope.team.gamePlanId = $scope.data.id;
            $scope.team.userAccountId = $scope.user.userAccountId;
            $http.post('/simulation/game-teams/save', { data: $scope.team }).then(function (response) {
                $scope.team = response.data;
                $scope.team.game_roles = [];
                $scope.teams.push($scope.team);
                $scope.page4 = false;
                $scope.page3 = true;
            });
        }

        //create game team role
        $scope.CreateGameRole = function (index,teamId) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-roles/form.html",
                controller: "newGameRoleModalCtrl",
                inputs: {
                    role: null,
                    gamePlanId: $scope.data.id,
                    gamePlanTeamId: teamId,
                    sequence: false
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.teams[index].game_roles.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //edit role
        $scope.editRole = function (role, tindex,index) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-roles/form.html",
                controller: "newGameRoleModalCtrl",
                inputs: {
                    role: role,
                    gamePlanId: $scope.data.id,
                    gamePlanTeamId: $scope.teams[tindex].id,
                    sequence: false
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.teams[tindex].game_roles[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //delete role
        $scope.deleteRole = function (roleId,tindex, index) {
            $http.delete("/simulation/game-roles/remove/" + roleId)
                .then(function(res){
                    $scope.teams[tindex].game_roles.splice(index,1);
                    toastr.success('Role deleted.', 'Success!');
                });
        };

        //save game template
        $scope.save = function (data) {
            if ($scope.data.name != null && (data.planDate != null || data.type != 0) && data.type != null) {
                if (data.id === undefined) {
                    console.log('---------------',data);
                    // data.planDate = moment.utc(data.planDate, 'DD/MM/YYYY', true).format();
                    if(data.type == 0){
                        $http.post('/simulation/games/save', { data: data }).then(function (response) {
                            $scope.data = response.data;
                            $scope.page4 = true;
                            $scope.teams = [];
                        });
                    }else{
                        $http.post('/simulation/id-games/create', { data: data }).then(function (response) {
                            $scope.data = response.data;
                            close($scope.data);
                        });
                    }
                } else {
                    $http.post('/simulation/games/update/'+$scope.data.id, { data: data }).then(function (response) {
                        $http.get('/simulation/game-teams/get-teams-for-games/'+$scope.data.id).then(function (response) {
                            $scope.teams = response.data;
                            $scope.page3 = true;
                        });
                    });
                }
                $scope.page1 = false;
                
            } else {
                toastr.error("Please Fill Required Fields");
            }
        };

        // control flow
        $scope.newTeam = function(team){
            if(team.id){
                $scope.title = "Edit Team : "+team.name;

            }else{
                $scope.title = "New Team";                
            }
            $scope.team = team;
            $scope.page3 = false;
            $scope.page4 = true;
        }
        $scope.closePicker = function () {
            $('.datepicker').hide();
        };

        $scope.saveExit = function () {
            close($scope.data);
        };

        $scope.backToAssignedMessages = function () {
            $scope.page3 = true;
            $scope.page4 = false;
        };





    }
}());