(function () {
    'use strict';

    var CountriesService = function ($scope, countries) {
    }

    CountriesService.resolve = {
        user: function ($q, $http) {
            var deferred = $q.defer();
            $http.get('/users/me')
            .success(function (data) {
                deferred.resolve(data)
            })
            .error(function (data) {
                deferred.resolve("error value");
            });

            return deferred.promise;
        }
    }
    angular.module('app')

    .factory('focus', function ($timeout, $window) {
        return function (id) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element)
                element.focus();
            });
        };
    })
    .directive('eventFocus', function (focus) {
        return function (scope, elem, attr) {
            elem.on(attr.eventFocus, function () {
                focus(attr.eventFocusId);
            });

            // Removes bound events in the element itself
            // when the scope is destroyed
            scope.$on('$destroy', function () {
                elem.off(attr.eventFocus);
            });
        };
    })
    .filter('nl2br', function ($sce) {
        return function (msg, is_xhtml) {
            var is_xhtml = is_xhtml || true;
            var breakTag = (is_xhtml) ? '<br />' : '<br>';
            var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            return $sce.trustAsHtml(msg);
        }
    })
    .filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    })
    .config(['$provide',function($provide){
        $provide.value("$apiRootSettings","/settings/");
        $provide.value("$apiRootCM","/");
        $provide.value("$apiRootSM","/simulation/");
    }])
    .config(['$routeProvider', '$httpProvider', 'IdleProvider', 'KeepaliveProvider','ChartJsProvider', function ($routeProvider, $httpProvider, IdleProvider, KeepaliveProvider,ChartJsProvider) {
        ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DC0CDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        $httpProvider.interceptors.push('Interceptor');

        var routes, setRoutes;
        routes = [
            'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components',
            'ui/boxes', 'ui/timeline', 'ui/nested-lists', 'ui/pricing-tables', 'ui/maps',
            'tables/static', 'tables/dynamic', 'pricing-tabless/responsive',
            'forms/elements', 'forms/layouts', 'forms/validation', 'forms/wizard',
            'charts/charts', 'charts/flot',
            'pages/404', 'pages/500', 'pages/blank', 'pages/forgot-password', 'pages/invoice',
            'pages/lock-screen', 'pages/profile', 'pages/invoice', 'pages/signin', 'pages/signup', 'pages/simulationLogin',
            'mail/compose', 'mail/inbox', 'mail/single', 
            'app/tasks', 'app/calendar', 'incidents/edit', 'IdleProvider', 'KeepaliveProvider', 'pages/invite'
        ]
        IdleProvider.idle(3600); // in seconds
        IdleProvider.timeout(10); // in seconds
        setRoutes = function (route) {
            var config, url;
            url = '/' + route;
            config = {
                templateUrl: 'views/' + route + '.html'
            };

            $routeProvider.when(url, config);
            return $routeProvider;
        };
        routes.forEach(function (route) {
            return setRoutes(route);
        });
        $routeProvider.when("/categories/edit/:cat_id?", {
            templateUrl: 'views/categories/edit.html'
        });

        $routeProvider

//=======================================================================================================================//

        /////////////////Preparation manager routes Start/////////////////////
        .when('/settings/account', {
            controller: "accountCtrl",
            resolve: CountriesService.resolve,
            templateUrl: "views/settings/account.html",
        })
        .when('/settings/users', { templateUrl: 'views/settings/users/list.html' })
        .when('/settings/users/add', { templateUrl: 'views/settings/users/add.html' })
        .when('/settings/users/edit', { templateUrl: 'views/settings/users/edit.html' })
        ///////////////////////////Preparation manager routes End/////////////////////
        //==========================================================================//
        ///////////////////////////Crisis manager routes Start////////////////////////
        .when('/reports/view/:incidentId', { templateUrl: 'views/reports/reports.view.html' })
        .when('/reports/edit/:id', { templateUrl: 'views/reports/report.html' })
        .when('/myTasks/:incidentId', { templateUrl: 'views/userTasks/user.task.html' })
        .when('/taskDetail/:taskId', { templateUrl: 'views/userTasks/task.detail.html' })
        .when('/browser', { templateUrl: 'views/crisis-manager/web-links/media-list.html' }) //done
        .when('/browser/:id?', { templateUrl: 'views/crisis-manager/web-links/browse.html' }) //done
        .when('/incidents/view', { templateUrl: "views/crisis-manager/incidents/view.html"})

        /////////////////Crisis manager routes End/////////////////////
        //=======================================================================================================================//


        /////////////////Simulation routes Start/////////////////////

		.when('/home', { templateUrl: 'views/home.html' })
		.when('/simulation/players', { templateUrl: 'views/simulation/players/list.html' })
		.when('/simulation/player-page', { templateUrl: 'views/simulation/active-games/list.html' })
        .when('/article/article-libraries/:gamePlanId?', { templateUrl: 'views/simulation/game-libraries/list.html' })
        .when('/message/message-libraries/:gamePlanId?', { templateUrl: 'views/simulation/game-messages/list.html' })


        /////////////////Simulation manager routes End/////////////////////

        //=======================================================================================================================//

        //=======================================================================================================================//

        /////////////////Default routes Start/////////////////////
        .when('/', { redirectTo: function () { return '/home' } })
        .when('/404', { templateUrl: 'views/pages/404.html' })

        /////////////////Default routes End/////////////////////

        /////////////////SuperAdmin routes Start/////////////////////
        .when('/superadmin', { templateUrl: 'views/admin.html' })
        .when('/superadmin/create/:id', { templateUrl: 'views/admin.create.html' })
        .when('/superadmin/create', { templateUrl: 'views/admin.create.html' })
        .when('/superadmin/copy-accounts', { templateUrl: 'views/copyAccounts/copy-messages.html' })
        /////////////////SuperAdmin routes End/////////////////////

        //=======================================================================================================================//

        /////////////////Others routes Start/////////////////////
        .when('/incident/edit/:id', { templateUrl: 'views/incidents/edit.html' })
        .when('/archive/statusReport/:id', { templateUrl: 'views/incidents/archive-report.html' })
        .when('/student',{templateUrl:'views/students/student.html'})
        .when('/studentAll',{templateUrl:'views/students/studentview.html'})
        .when('/d3', {
            templateUrl: "views/plansTimeline/d3.timeline.html",
        })
        .when('/d31', {
            templateUrl: "views/plansTimeline/plans.timeline.html",
        })
        .when('/actions', {
            templateUrl: "views/actions.html",
        })
        .when('/actions/create/:id?', {
            templateUrl: "views/actions.create.html",
        })
        .when('/decisions', {
            templateUrl: "views/decisions.html",
        })
        .when('/decisions/create/:id?', {
            templateUrl: "views/decisions.create.html",
        })
        .when('/viewMap/:incidentId', {
            templateUrl: "views/crisis-manager/general/location-map-page.html"
        })
        .when('/actionDetail', {
            templateUrl: "views/dashboard/action-plan-detail-page.html"
        })
        .otherwise({ redirectTo: '/404' });
        /////////////////Others routes Start/////////////////////
        //=======================================================================================================================//


    }]
)
.run(function ($rootScope, Idle, Keepalive, $uibModal, $http, $location, AuthService, editableOptions, editableThemes,Query,IncidentTeamService, IncidentTypeService, ReportService,IncidentService) {
    

    // $http.defaults.headers.common['Authorization'] = Query.getCookie('Auth_token',false);
    // $http.defaults.headers.common['Accept'] = 'application/json;odata=verbose';

    $rootScope.out = function () {
        Idle.unwatch();
        closeModals();
        $location.path("/");


    }
    function closeModals() {
        if ($rootScope.warning) {
            $rootScope.warning.close();
            $rootScope.warning = null;
        }

        if ($rootScope.timedout) {
            $rootScope.timedout.close();
            $rootScope.timedout = null;
        }
    }

    $rootScope.$on('IdleStart', function () {
        closeModals();

        $rootScope.warning = $uibModal.open({
            templateUrl: 'warning-dialog.html',
            windowClass: 'modal-idle'
        });
    });

    $rootScope.$on('IdleEnd', function () {
        closeModals();
    });

    $rootScope.$on('IdleTimeout', function () {
        closeModals();
        $http.get('/auth/logout').then(function (res) {
            Query.delCookie('Auth_tk.sig');
            $rootScope.superAdmin = false;
            $rootScope.infoProvider = false;
            Query.delCookie('incidentSelected');
            Query.delCookie('user');
            Idle.unwatch();
            Query.delCookie('Auth_token');
            delete localStorage['role'];
        });

        $rootScope.timedout = $uibModal.open({
            templateUrl: 'timedout-dialog.html',
            windowClass: 'modal-danger',
            backdrop: 'static',
            keyboard: false
        });
    });

    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {

        $http.get('/auth/confirm-login').then(function (res) {
            var uu = res.data;
            if (uu == {}) {
                // no logged user, we should be going to #login
                if (next.templateUrl == "views/pages/signin.html") {
                    $rootScope.superAdmin = false;
                    $rootScope.infoProvider = false;

                    Query.delCookie('Auth_token');
                    delete localStorage['role'];
                    // already going to #login, no redirect needed
                }
                else if (next.templateUrl == "views/pages/invite.html") {
                    $location.path("/pages/invite");
                }
                else if (next.templateUrl == "views/pages/simulationLogin.html") {
                    $location.path("/pages/simulationLogin");
                }
                else {
                    // not going to #login, we should redirect now
                    $rootScope.superAdmin = false;
                    $rootScope.infoProvider = false;

                    Query.delCookie('Auth_token');
                    delete localStorage['role'];
                    $location.path("/pages/signin");
                }
            } else {
                var token = res.data.token;
                var exp = new Date(new Date().getTime() + 1000*60*60).toUTCString();
                Query.setCookie('Auth_token',token,{expires: exp});
                Idle.watch();
                if (next !== undefined) {
                    $rootScope.breadcrumb_0Link = 'mainHome'
                    $rootScope.breadcrumb_0 = true;
                    $rootScope.breadcrumb_1 = true;
                    $rootScope.breadcrumb_2 = true;
                    $rootScope.breadcrumb_3 = false;
                    $rootScope.breadcrumb_4 = false;
                    $rootScope.breadcrumb_1Link = 'home'

                    console.log(next.originalPath);
                    switch (next.originalPath) {
                        case '/home':
                            $rootScope.breadcrumb_1 = false;
                            $rootScope.breadcrumb_2 = false;
                            break;
                        case '/pages/profile':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Profile';
                            break;
                        case '/archive/statusReport/:id':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Crisis Manager';
                            $rootScope.breadcrumb_2Heading = 'Archive';
                            $rootScope.breadcrumb_2Link = 'archive/view'
                            $rootScope.breadcrumb_3Heading = 'Status Report';
                            break;
                        case '/incidents/view':
                            $rootScope.breadcrumb_1Heading = 'Crisis Manager';
                            $rootScope.breadcrumb_2Heading = 'Incidents';
                            break;
                        case '/incidents/edit':
                            $rootScope.breadcrumb_1Heading = 'Incidents';
                            $rootScope.breadcrumb_1Link = 'incidents/view'
                            $rootScope.breadcrumb_2Heading = 'New Incident';
                            break;
                        case '/incident/edit/:id':
                            $rootScope.breadcrumb_1Heading = 'Incidents';
                            $rootScope.breadcrumb_1Link = 'incidents/view'
                            IncidentService.get(next.params.id).then(function(res){
                                $rootScope.breadcrumb_2Heading = res.data.name;
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // var path = "/api/incidents/get?id=" + next.params.id;
                            // $http.get(path).then(function (res) {
                                
                            // });
                            break;
                        case '/archive/view':
                            $rootScope.breadcrumb_1Heading = 'Crisis Manager';
                            $rootScope.breadcrumb_2Heading = 'Archive';
                            break;
                        case '/timeline':
                            $rootScope.breadcrumb_1Heading = 'Crisis Manager';
                            $rootScope.breadcrumb_2Heading = 'Timeline';
                            break;
                        case '/reports':
                            $rootScope.breadcrumb_1Heading = 'Crisis Manager';
                            $rootScope.breadcrumb_2Heading = 'Status Reports';
                            break;
                        case '/reports/view/:incidentId':
                            $rootScope.breadcrumb_1Heading = 'Reports';
                            $rootScope.breadcrumb_1Link = 'reports'
                            $rootScope.breadcrumb_2Heading = 'New Report';
                            break;
                        case '/reports/edit/:id':
                            $rootScope.breadcrumb_1Heading = 'Reports';
                            $rootScope.breadcrumb_1Link = 'reports'
                            ReportService.get(next.params.id).then(function(res){
                                $rootScope.breadcrumb_2Heading = res.data.incidentName;
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // var path = '/reports/get?id=' + next.params.id;
                            // $http.get(path).then(function (res) {
                                
                            // });
                            break;
                        case '/User-status':
                            $rootScope.breadcrumb_1Heading = 'Crisis Manager';
                            $rootScope.breadcrumb_2Heading = 'User Status';
                            break;
                        case '/browser':
                            $rootScope.breadcrumb_1Heading = 'Crisis Manager';
                            $rootScope.breadcrumb_2Heading = 'Web Links';
                            break;
                        case '/team-activation':
                            $rootScope.breadcrumb_1Heading = 'Crisis Manager';
                            $rootScope.breadcrumb_2Heading = 'Email/Alert history';
                            break;
                        case '/capacity-dashboard':
                            $rootScope.breadcrumb_1Heading = 'Crisis Manager';
                            $rootScope.breadcrumb_2Heading = 'Capacity Dashboard';
                            break;
                        case '/settings/incident-types':
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Incident Types';
                            break;
                        case '/settings/incident-types/edit/:cat_id?':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Incident Types';
                            $rootScope.breadcrumb_2Link = 'settings/incident-types';
                            if(next.params.cat_id){
                                IncidentTypeService.item(next.params.cat_id).then(function(res){
                                    $rootScope.breadcrumb_3Heading = res.data.name;
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                // var path = '/settings/incident-types/item?id=' + next.params.cat_id;
                                // $http.get(path).then(function (res) {
                                    
                                // });  
                            }else{
                                $rootScope.breadcrumb_3Heading = 'New Type';
                            }
                            break;
                        case '/settings/capacities':
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Capacity';
                            break;
                        case '/settings/all-categories':
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Categories';
                            break;
                        case '/settings/account':
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Account';
                            break;
                        case '/settings/users':
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Users';
                            break;
                        case '/settings/users/add':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Users';
                            $rootScope.breadcrumb_2Link = 'settings/users';
                            $rootScope.breadcrumb_3Heading = 'New User';
                            break;
                        case '/settings/users/edit':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Users';
                            $rootScope.breadcrumb_2Link = 'settings/users';
                            $rootScope.breadcrumb_3Heading = 'Edit User';
                            break;
                        case '/settings/roles':
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Roles';
                            break;
                        case '/settings/departments':
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Departments';
                            break;
                        case '/settings/organizations':
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'External Organizations';
                            break;
                        case '/settings/organizations/edit/:id?':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'External Organizations';
                            $rootScope.breadcrumb_2Link = 'settings/organizations';
                            if (next.params.id) {
                                $rootScope.breadcrumb_3Heading = 'Edit';
                            } else {
                                $rootScope.breadcrumb_3Heading = 'New';
                            }
                            break;
                        case '/settings/organizations/details/:id':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'External Organizations';
                            $rootScope.breadcrumb_2Link = 'settings/organizations';
                            $rootScope.breadcrumb_3Heading = 'Users';
                            break;
                        case '/settings/incident-teams':
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Teams';
                            break;
                        case '/settings/incident-teams/add':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Settings';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Teams';
                            $rootScope.breadcrumb_2Link = 'settings/incident-teams';
                            $rootScope.breadcrumb_3Heading = 'New Team';
                            break;
                        case '/settings/incident-teams/edit/:id':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Settings';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Teams';
                            $rootScope.breadcrumb_2Link = 'settings/incident-teams';
                            IncidentTeamService.get(next.params.id).then(function(res){
                                $rootScope.breadcrumb_3Heading = res.data.name;
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

                            });
                            // var path = '/settings/incident-teams/get?id=' + next.params.id;
                            // $http.get(path).then(function (res) {
                                
                            // });
                            break;
                        case '/simulation/home':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            break;
                        case '/simulation/players':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Players';
                            break;
                        case '/simulation/player-lists':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Player Lists';
                            break;
                        case '/simulation/id-messages/:gameId?':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'ID Messages';
                            break;
                        case '/simulation/categories':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Simulation Categories';
                            break;
                        case '/simulation/game-roles/:gamePlanId?':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Simulation Roles';
                            break;
                        case '/simulation/game-libraries/:gamePlanId?':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Simulation Documents & Media';
                            break;
                        case '/simulation/game-messages/:gamePlanId?':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Simulation Messages';
                            break;
                        case '/simulation/game-template':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Game Template';
                            break;
                        case '/simulation/player-page':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Player Page';
                            break;
                        case '/simulation/active-games/:gameId':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Active Games';
                            break;
                        case '/simulation/scheduled-games/:typeId?':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Scheduled Games';
                            break;
                        case '/simulation/assign-messages':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Assign Messages';
                            break;
                        case '/simulation/game-details/:gameId':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Game Details';
                            break;
                        case '/simulation/my-messages/:templateGameId/:userId':
                            $rootScope.breadcrumb_1Heading = 'Simulation Manager';
                            $rootScope.breadcrumb_1Link = 'simulation/home'
                            $rootScope.breadcrumb_2Heading = 'Player Page';
                            break;



                        case '/superadmin':
                            $rootScope.breadcrumb_1 = false;
                            $rootScope.breadcrumb_2 = false;
                            break;
                        case '/superadmin/create/:id':
                        case '/superadmin/create':
                            $rootScope.breadcrumb_0Link = 'superadmin'
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Account Management';
                            break;
                        case '/superadmin/copy-accounts':
                            $rootScope.breadcrumb_0Link = 'superadmin'
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Copy Accounts';
                            break;

                        case '/dynamic-form':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Assessment Tools';
                            break;

                        default:
                        console.log(next.originalPath)
                    }
                }

                if (next.templateUrl == "views/pages/signin.html") {
                    $location.path("/");
                } else if (next.originalPath == "/reference-library/:userAccountId" || next.originalPath == "/message/:id" || next.originalPath == '/messages' || next.originalPath == '/myTasks/:incidentId' || next.originalPath == '/taskDetail/:taskId' || next.originalPath == '/active-games' || next.originalPath == '/my-messages/:templateGameId/:userId') {
                    $rootScope.fixedHeader = false;
                }
                if ($rootScope.infoProvider === true || localStorage['role'] === 'IP') {
                    console.log('--->>>>>>>>>>>>',next.originalPath);
                    if (next.originalPath == "/reference-library/:userAccountId" || next.originalPath == "/message/:id" || next.originalPath == '/messages' || next.originalPath == '/myTasks/:incidentId' || next.originalPath == '/taskDetail/:taskId' || next.originalPath == '/active-games' || next.originalPath == '/my-messages/:templateGameId/:userId') {
                        $rootScope.fixedHeader = false;
                    }
                    else {
                        $rootScope.fixedHeader = true;
                    }
                }
                else if ($rootScope.superAdmin === true || localStorage['role'] === 'superadmin') {
                    if (next.templateUrl == "views/admin.html" || next.templateUrl == 'views/admin.create.html' || next.templateUrl == 'views/copyAccounts/copy-messages.html' || next.templateUrl == 'views/copyAccounts/copy-categories.html') {
                        $rootScope.fixedHeader = true;
                    }
                    else {
                        $location.path("/superAdmin");
                        $rootScope.fixedHeader = true;
                    }

                }
                else {
                    if (next.originalPath == "/reference-library/:userAccountId" || next.originalPath == "/message/:id" || next.originalPath == '/messages' || next.originalPath == '/myTasks/:incidentId' || next.originalPath == '/taskDetail/:taskId' || next.originalPath == '/active-games' || next.originalPath == '/my-messages/:templateGameId/:userId') {
                        $rootScope.fixedHeader = false;
                    } else {
                        $rootScope.fixedHeader = true;
                    }
                }


            }
        });
    });
})
})();
