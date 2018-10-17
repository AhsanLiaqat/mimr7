(function () {
    'use strict';

    angular.module('app')
        .controller('mainHomeCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query','DashboardCategoryService','AccountService','CheckListService','IncidentTypeService','ActionPlanService','IncidentService', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query,DashboardCategoryService, AccountService, CheckListService, IncidentTypeService, ActionPlanService, IncidentService) {
        $scope.colours = ['#717984','#72C02C','#3498DB', '#F1C40F'];
        $scope.user = Query.getCookie('user');
        function init() {
            $scope.incidents = [];
            $scope.timelineValues = {index: 0};
            $scope.clicked = false;
            $scope.cards = [
                {name: 'Crisis Manager',route: 'home',click: false,list: ['Alert Teams','Create Incidents','Information Dashboards','Initiate & Manage Action Plans','Mapping Functions','Status Reports']},
                {name: 'Preparation Manager',route: 'settings/home',click: false,list: ['Manage Users','Manage Teams','Build Action Plans & Checklist', 'Customize Dashboards']},
                {name: 'Simulation Manager',route: 'simulation/home',click: false,list: ['Create Simulations / Exercises','Schedule Exercises','Play Games / Simulations']},
            ]
        }
        init();
        $scope.putData =  function(search,graph,inc){
            var type = Query.filter(graph.types,{'name': search},true);
            if(type){
                type.data.push(inc);
            }else{
                graph.types.push({name: search,data: []});
                var type = Query.filter(graph.types,{'name': search},true);
                type.data.push(inc);
            }
        }

        $scope.putInList =  function(listId,date,value){
            var type = filterFilter($scope.gamelist[listId].dates, {'name': date})[0];
            if(type){
                if(value.type == 0){
                    type.data1.push(value);
                }else if (value.type == 1){
                    type.data2.push(value);
                }
            }else{
                $scope.gamelist[listId].dates.push({name: date,data1: [],data2: []});
                var type = filterFilter($scope.gamelist[listId].dates, {'name': date})[0];
                if(value.type == 0){
                    type.data1.push(value);
                }else if (value.type == 1){
                    type.data2.push(value);
                }
            }
        }

        $scope.changeIncidentStatus = function(status){
            $scope.currentStatus = status;
        };

        $scope.managearray = function(){
            $scope.gamelist = [
                {name: 'Scheduled',dates: []},
                {name: 'Active',dates: []},
                {name: 'Closed',dates: []}
            ]
            $scope.scheduled = []
            $scope.active = []
            $scope.closed = []

            angular.forEach($scope.games, function(value) {
                value.type = 0;
                value.Gname = value.game_plan.name;
                var date = new Date(value.scheduled_date).format('mmmm, yyyy')

                if(value.plan_activated == false){
                    $scope.scheduled.push(value);
                    $scope.putInList(0,date,value);
                }
                else if(value.plan_activated == true && value.status != 'stop'){
                    $scope.active.push(value);
                    $scope.putInList(1,date,value)
                }
                else{
                  if(value.status == 'stop'){
                    $scope.closed.push(value);
                    $scope.putInList(2,date,value)
                  }
                }
            });
            angular.forEach($scope.id_schedule_games, function(value) {
                value.type = 1;
                value.Gname = value.id_game.name;
                var date = new Date(value.scheduled_date).format('mmmm, yyyy')

                if(value.activated == false){
                    $scope.scheduled.push(value);
                    $scope.putInList(0,date,value);
                }
                else if(value.activated == true ){
                    $scope.active.push(value);
                    $scope.putInList(1,date,value)
                }
                else{
                  // if(value.status == 'stop'){
                  //   $scope.gameToShow.push(value);
                  // }
                }
            });
        }

        $scope.showGraph = function(index,card){
            if(!card.click){
                angular.forEach($scope.cards, function (card) {
                    card.click = false;
                });
            }
            card.click = !card.click;
            $scope.card = card;
            $scope.card.index = index;
            $scope.options = {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                layout: {
                    padding: {
                      left: 10,
                      bottom: 5
                    }
                }
            }

            if(index == 0 && card.click == true){
                $scope.FirstGraphs = [
                    {name: 'Active Incidents', incidents: [],types: []},
                    {name: 'On Hold Incidents',incidents: [],types: []},
                    {name: 'Closed Incidents', incidents: [],types: []}
                ]
                IncidentService.unrestrictedList($scope.user.userAccountId).then(function(res){
                    $scope.incidents = Query.sort(res.data,'createdAt',true, true);
                    
                    angular.forEach($scope.incidents, function (inc) {
                        if(inc.active == 'Closed'){
                            $scope.FirstGraphs[2].incidents.push(inc);
                        }
                        else if(inc.active == 'Active'){
                            $scope.FirstGraphs[0].incidents.push(inc);
                        }
                        else{
                            $scope.FirstGraphs[1].incidents.push(inc);
                        }
                    });
                    angular.forEach($scope.FirstGraphs, function (graph) {
                        angular.forEach(graph.incidents, function (inc) {
                            if(inc.categoryId){
                                $scope.putData(inc.category.name,graph,inc);
                            }else{
                                $scope.putData('N/A',graph,inc);
                            }
                        });
                    });
                    angular.forEach($scope.FirstGraphs, function (graph) {
                        graph.labels = []
                        graph.data = []
                        angular.forEach(graph.types, function (type) {
                            graph.labels.push(type.name)
                            graph.data.push(type.data.length)
                        });
                    });
                    console.log($scope.incidents);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/api/incidents/unrestricted-list?userAccountId=" + $scope.user.userAccountId)
                // .then(function (res) {
                    
                // });
            }else if( index == 1 && card.click == true){
                AccountService.getCounts($scope.user.userAccountId).then(function(response){
                  $scope.count = response.data;
                    $scope.SecondGraphs = [
                        {name: 'Users & Teams',data: [],labels: [],series:[]},
                        {name: 'Action Plans',data: [],labels: []},
                        {name: 'Action Plans & Checklists', data: [],labels: [],series:[]}
                    ]
                    console.log($scope.SecondGraphs);

                    $scope.SecondGraphs[0].data.push($scope.count.team_count);
                    $scope.SecondGraphs[0].data.push($scope.count.user_count);
                    $scope.SecondGraphs[0].data.push($scope.count.role_count);
                    $scope.SecondGraphs[0].data.push($scope.count.organization_count);

                    $scope.SecondGraphs[0].labels.push('TEAMS');
                    $scope.SecondGraphs[0].labels.push('USERS');
                    $scope.SecondGraphs[0].labels.push('ROLES');
                    $scope.SecondGraphs[0].labels.push('ORGANIZATIONS');

                    $scope.SecondGraphs[2].labels.push('INCIDENT TYPES');
                    $scope.SecondGraphs[2].labels.push('DASHBOARD CATEGORIES');
                    $scope.SecondGraphs[2].labels.push('CHECKLISTS');
                    
                    IncidentTypeService.list().then(function(response){
                        $scope.incident_types = response.data;
                        $scope.SecondGraphs[2].data.push($scope.incident_types.length);
                        DashboardCategoryService.getAllCategories().then(function(res){
                            $scope.categories = res.data;
                            $scope.SecondGraphs[2].data.push($scope.categories.length);
                            CheckListService.list($scope.user.userAccountId).then(function(respo){
                                $scope.check_lists = respo.data;
                                $scope.SecondGraphs[2].data.push($scope.check_lists.length);
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // var path = "/settings/check-lists/list?accountId=" + $scope.user.userAccountId ;
                            // $http.get(path).then(function(respo) {
                                
                            // });
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.get('/settings/dashboard-categories/all-categories').then(function(res) {
                            
                        // });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get("/settings/incident-types/list").then(function(response){
                        
                    // });

                    ActionPlanService.all().then(function(response){
                        $scope.actions = response.data;
                        $scope.actions = filterFilter($scope.actions, { 'active': true });
                        $scope.types = [];
                        angular.forEach($scope.actions, function (plan) {
                            if(plan.type){
                                $scope.make(plan.type,plan.type);
                            }else{
                                $scope.make('N/A',plan.type);
                            }
                        });
                        console.log($scope.types);
                        angular.forEach($scope.types, function (type) {
                            $scope.SecondGraphs[1].labels.push(type.name)
                            $scope.SecondGraphs[1].data.push(type.data.length)
                        });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get('/settings/action-plans/all').then(function (response) {
                        

                    // });  
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/settings/accounts/get-counts?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                    
                // });
            }else if(index == 2 && card.click == true){
                $scope.ThirdGraphs = [
                    {name: 'Scheduled Games',data: [[],[]],labels: [],series:[]},
                    {name: 'Game Library',data: [],labels: []},
                    {name: 'Active & Closed Games', data: [[],[]],labels: [],series:[]}
                ]

                $scope.ThirdGraphs[1].labels.push('Simulation Games');
                $scope.ThirdGraphs[1].labels.push('ID - Games');


                $http.get('/simulation/games/all').then(function (response) {
                    $scope.gameTemplates = response.data;
                    angular.forEach($scope.gameTemplates, function(game) {
                        game.type = 0;
                    });
                    $scope.ThirdGraphs[1].data.push($scope.gameTemplates.length);
                    $http.get('/simulation/id-games/all').then(function (response) {
                        $scope.ID_games = response.data;
                        angular.forEach($scope.ID_games, function(game) {
                            game.type = 1;
                            $scope.gameTemplates.push(game);
                        });
                        $scope.ThirdGraphs[1].data.push($scope.ID_games.length);
                        $scope.gameTemplates = Query.sort($scope.gameTemplates, 'name', false, false);
                        // $scope.gameTemplates = $filter('orderBy')($scope.gameTemplates, 'name');

                        $http.get('/simulation/schedule-games/all')
                        .then(function (response) {
                            $scope.games = response.data;
                            $http.get('/simulation/id-schedule-games/all')
                            .then(function (resp) {
                                $scope.id_schedule_games = resp.data;
                                $scope.managearray();
                                var date = new Date();
                                var schedule_dates = [];
                                for(var i=0;i<6;i++){
                                    schedule_dates.push({index: i,date: angular.copy(date)})
                                    date.setMonth(date.getMonth() + 1);
                                }

                                angular.forEach(schedule_dates, function (datt) {
                                    $scope.ThirdGraphs[0].labels.push(datt.date.format('mmmm, yyyy'));
                                    var type = filterFilter($scope.gamelist[0].dates, {'name': datt.date.format('mmmm, yyyy')})[0];
                                    console.log(type)
                                    if(type){
                                        $scope.ThirdGraphs[0].data[0].push(type.data1.length);
                                        $scope.ThirdGraphs[0].data[1].push(type.data2.length);
                                    }
                                    else{
                                        $scope.ThirdGraphs[0].data[0].push(0);
                                        $scope.ThirdGraphs[0].data[1].push(0);
                                    }
                                });

                                var date1 = new Date();
                                var active_dates = [];
                                for(var i=0;i<6;i++){
                                    active_dates.push({index: 6-i,date: angular.copy(date1)})
                                    date1.setMonth(date1.getMonth() - 1);
                                }
                                active_dates = Query.sort(active_dates, 'index', false, false);
                                angular.forEach(active_dates, function (datt) {
                                    $scope.ThirdGraphs[2].labels.push(datt.date.format('mmmm, yyyy'));
                                    var type = filterFilter($scope.gamelist[1].dates, {'name': datt.date.format('mmmm, yyyy')})[0];
                                    if(type){
                                        $scope.ThirdGraphs[2].data[0].push(type.data1.length);
                                        $scope.ThirdGraphs[2].data[1].push(type.data2.length);
                                    }
                                    else{
                                        $scope.ThirdGraphs[2].data[0].push(0);
                                        $scope.ThirdGraphs[2].data[1].push(0);
                                    }
                                });


                            });
                        });
                    });
                });
            }
        }
        $scope.make = function(search,cat){
            var type = filterFilter($scope.types, {'name': search})[0];
            if(type){
                type.data.push(cat);
            }else{
                $scope.types.push({name: search,data: []});
                var type = filterFilter($scope.types, {'name': search})[0];
                type.data.push(cat);
            }
        }
        $scope.loadMap = function (incident) {
            if (incident) {
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/general/location-map.html",
                    controller: "locationMapCtrl",
                    inputs: {
                        incident: incident
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            } else {
                toastr.error('Please select an incident with location defined');
            }
        }

        $scope.dateFormat = function (dat) {
            return dat ? moment(dat).utc().local().format('HH:mm DD-MM-YYYY') : 'None';
        };



    }
}());
