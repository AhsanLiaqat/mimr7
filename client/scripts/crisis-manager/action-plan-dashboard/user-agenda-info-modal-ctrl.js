(function () {
    'use strict';

    angular.module('app')
    .controller('userAgendaInfoModalCtrl', ['$scope',
    '$rootScope',
    'close',
    '$routeParams',
    '$http',
    'AuthService',
    'activity',
    'filterFilter',
    'IncidentTeamService',
    'RoleService',
    'IncidentActivityService',
    'activityType',
    ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        $routeParams,
        $http,
        AuthService,
        activity,
        filterFilter,
        IncidentTeamService,
        RoleService,
        IncidentActivityService,
        activityType
    ) {

        function init() {
            $scope.activity = activity;
            $scope.filters = [
                { name: 'Filter By Role', value: 'role' },
                { name: 'All Users', value: 'all' },
                { name: 'Filter By Team', value: 'team' },
                { name: 'Filter By Role & Team', value: 'roleteam' }
            ]
            $scope.currentFilter = 'role';
        };
        init();

        $scope.displayActorName = function (actor) {
            return actor.firstName + ' ' + actor.lastName;
        }

        $scope.actorSelection = function () {
            $scope.selectUser = true;
            if ($scope.activity.response_actor){
                $scope.selectedActor = $scope.activity.response_actor.id;
            }

            if (!$scope.roles) {
                RoleService.all().then(function(response){
                    $scope.roles = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/settings/roles/all").then(function
                //     (response) {
                        
                //     });
                }

                if (!$scope.teams) {
                    IncidentTeamService.all().then(function(response){
                        $scope.teams = response.data;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get("/settings/incident-teams/all").then(function (response) {
                        
                    // });
                }

                if (!$scope.users) {
                    $http.get("/users/list").then(function (res) {
                        $scope.filteredActors = $scope.users = res.data;
                    });
                }
            };

            $scope.filterActors = function (filter) {
                if (filter === 'all' && $scope.currentFilter === 'all') {
                    $scope.filteredActors = $scope.users;
                } else if (filter === 'team' && $scope.currentFilter === 'team') {
                    var team = filterFilter($scope.teams, { 'id': $scope.selectedTeam })[0];
                    $scope.filteredActors = [];
                    angular.forEach($scope.users, function (user) {
                        if (team.emailList.indexOf(user.email) !== -1) {
                            $scope.filteredActors.push(user);
                        }
                    })
                } else if (filter === 'role' && $scope.currentFilter === 'role') {
                    var role = filterFilter($scope.roles, { 'id': $scope.selectedRole })[0];
                    $scope.filteredActors = [];
                    angular.forEach($scope.users, function (user) {
                        var u = filterFilter(user.roles, { 'name': role.name })[0];
                        if (u) {
                            $scope.filteredActors.push(user);
                        }
                    })
                } else if (filter === 'roleteam' && $scope.currentFilter === 'roleteam') {
                    if($scope.selectedTeam){
                        $scope.filteredActorsCopy = angular.copy($scope.filteredActors);
                    }else{
                        $scope.filteredActorsCopy = $scope.users;
                    }

                    $scope.filteredActors = [];
                    var role = filterFilter($scope.roles, { 'id': $scope.selectedRole })[0];
                    angular.forEach($scope.filteredActorsCopy, function (user) {
                        var u = filterFilter(user.roles, { 'name': role.name })[0];
                        if (u) {
                            $scope.filteredActors.push(user);
                        }
                    })
                }
            };

            $scope.save = function () {
                if ($scope.activity.response_actor && $scope.selectedActor === $scope.activity.response_actor.id){
                    toastr.error('Select different actor','Error!');
                }else if (!$scope.selectedActor || $scope.selectedActor === '' || typeof($scope.selectedActor) === 'undefined'){
                    toastr.error('Please select an actor','Error!');
                } else {
                    $scope.activity.response_actor = filterFilter($scope.users, {'id': $scope.selectedActor})[0];
                    if(activityType == 'incident-agenda'){
                        $http.put('/incident-agenda-activities/update-actor/' + $scope.activity.id,
                        {responseActorId: $scope.activity.response_actor.id} )
                        .then(function(result){
                            toastr.success('Actor Assigned', 'Success!');
                            $scope.selectUser = false;
                        }, function(error){
                            toastr.error('Could not assign new actor','Error!');
                        })
                    }else{
                        $http.put('/settings/agenda-activities/update-actor/' + $scope.activity.id,
                        {responseActorId: $scope.activity.response_actor.id} )
                        .then(function(result){
                            toastr.success('Actor Assigned', 'Success!');
                            $scope.selectUser = false;
                        }, function(error){
                            toastr.error('Could not assign new actor','Error!');
                        })
                    }
                    
                }
            };

            $scope.close = function () {
                close();
            };
        }
    }());
