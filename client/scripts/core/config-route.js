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
            'pages/lock-screen', 'pages/profile', 'pages/invoice', 'pages/signin', 'pages/signup','pages/studentLogin','pages/content-questions',
            'mail/compose', 'mail/inbox', 'mail/single',
            'app/tasks', 'app/calendar', 'incidents/edit', 'IdleProvider', 'KeepaliveProvider', 'pages/invite'
        ]
        IdleProvider.idle(3600); // in seconds
        IdleProvider.timeout(10); // in seconds
        setRoutes = function (route) {
            var config, url;
            if(route == 'pages/content-questions'){
                url = '/' + 'pages/content-questions/:userId/:scheduledQuestionId';
            }else{
                url = '/' + route;
            }
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
        .when('/detail-content/:contentId', {
            controller: "detailContentCtrl",
            resolve: CountriesService.resolve,
            templateUrl: "views/content/view-content.html",
        })
        .when('/settings/users', { templateUrl: 'views/settings/users/list.html' })
        .when('/settings/users/add', { templateUrl: 'views/settings/users/add.html' })
        .when('/settings/users/edit', { templateUrl: 'views/settings/users/edit.html' })

        .when('/mainHome', { templateUrl: 'views/home.html' })
		.when('/home', { templateUrl: 'views/mainHome.html' })
        .when('/article-libraries/:gamePlanId?', { templateUrl: 'views/content-libraries/list.html' })
        .when('/message-libraries/:gamePlanId?', { templateUrl: 'views/content-messages/list.html' })
        .when('/content/question-libraries/:articleId?', { templateUrl: 'views/content-libraries/question-libraries.html' })
        .when('/content/content-libraries', { templateUrl: 'views/content-libraries/content-library.html' })
        .when('/content/content-builder', { templateUrl: 'views/content/content-builder.html' })
        .when('/settings/users', { templateUrl: 'views/settings/users/list.html' })
        .when('/settings/users/add', { templateUrl: 'views/settings/users/add.html' })
        .when('/settings/users/edit', { templateUrl: 'views/settings/users/edit.html' })
        .when('/settings/organizations', { templateUrl: 'views/settings/organizations/list.html' }) 
        .when('/settings/organizations/edit/:id?', { templateUrl: 'views/settings/organizations/form.html' })
        .when('/settings/organizations/details/:id', { templateUrl: 'views/settings/organizations/details.html' })
        .when('/organizations/students/details/:OrgId?', { templateUrl: 'views/settings/organizations/students-details.html' })
        .when('/settings/organizations/:OrgId/users/:id?', { templateUrl: 'views/settings/organizations/user.html' })
        .when('/settings/player-lists', { templateUrl: 'views/settings/player-lists/list.html' })
        .when('/active-contents/:gameId', { templateUrl: 'views/active-contents/details.html' })
        .when('/question-responses/:gameId', { templateUrl: 'views/active-contents/question-responses.html' })
        .when('/closed-contents', { templateUrl: 'views/schedule-content/list.html' })
        .when('/view-message/:messageId?', { templateUrl: 'views/content-messages/view-message.html' })
        .when('/view-scheduled-question/:contentId?', { templateUrl: 'views/schedule-content/view-scheduled-question.html' })
        .when('/simple-scheduled-question/:contentId?', { templateUrl: 'views/schedule-content/simple-scheduled-question.html' })
        .when('/view-contents/:articleId?', {
            controller : "viewContentCtrl",
            resolve: CountriesService.resolve,
            templateUrl: 'views/content/view-content.html', 
        })

        .when('/dynamic-form', { templateUrl: 'views/dynamic-form/list.html' }) //done
        

        // .when('/content-questions/:userId/:scheduled_questionId?', { templateUrl: 'views/simulation/schedule-content/content-questions.html' })


        // .when('/simulation/player-page', { templateUrl: 'views/simulation/active-games/list.html' })
		// .when('/simulation/players', { templateUrl: 'views/simulation/players/list.html' })
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
.run(function ($rootScope, Idle, Keepalive, $uibModal, $http, $location, AuthService, editableOptions, editableThemes,Query) {
    

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
            if (Object.keys(uu).length == 0) {
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
                else if (next.templateUrl == "views/pages/studentLogin.html") {
                    $location.path("/pages/studentLogin");
                }
                else if (next.templateUrl == "views/pages/content-questions.html") {
                    var str = '/pages/content-questions/';
                    if(next.params && next.params.userId && next.params.scheduledQuestionId){
                        str += next.params.userId + '/' + next.params.scheduledQuestionId;
                        $location.path(str);
                    }
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
                    $rootScope.breadcrumb_0Link = 'home'
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
                        case '/message-libraries/:gamePlanId?':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Messages';
                            break;
                        case '/content/content-builder':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Content Builder';
                            break;
                        case '/mainHome':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Content Builder';
                            break;
                        case '/content/question-libraries/:articleId?':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Questions';
                            break;
                        case '/content/content-libraries':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Contents';
                            break;
                        case '/active-contents/:gameId':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Active Contents';
                            break;
                        case '/dynamic-form':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Dynamic Forms';
                            break;
                        case '/question-responses/:gameId':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Question Responses';
                            break;
                        case '/view-scheduled-question/:contentId?':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Scheduled Questions';
                            break;
                        case '/simple-scheduled-question/:contentId?':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Simple Scheduled Messages';
                            break;
                        case '/view-contents/:articleId?':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'View Contents';
                            break;
                        case '/detail-content/:contentId':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Detail Content';
                            break;
                        case '/closed-contents':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Closed Contents';
                            break;
                        case '/article-libraries/:gamePlanId?':
                            $rootScope.breadcrumb_2 = false;
                            $rootScope.breadcrumb_1Heading = 'Articles';
                            break;
                        case '/settings/account':
                            $rootScope.breadcrumb_1Heading = 'Settings';
                            $rootScope.breadcrumb_2Heading = 'Account';
                            break;
                        case '/settings/users':
                            $rootScope.breadcrumb_1Heading = 'Settings';
                            $rootScope.breadcrumb_2Heading = 'Users';
                            break;
                        case '/settings/users/add':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Settings';
                            $rootScope.breadcrumb_2Heading = 'Users';
                            $rootScope.breadcrumb_2Link = 'settings/users';
                            $rootScope.breadcrumb_3Heading = 'New User';
                            break;
                        case '/view-message/:messageId?':
                            $rootScope.breadcrumb_2 = true;
                            $rootScope.breadcrumb_1Heading = 'Messages';
                            $rootScope.breadcrumb_1Link = '/message-libraries';
                            $rootScope.breadcrumb_2Heading = 'View Message';
                            break;
                        case '/settings/users/edit':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Preparation Manager';
                            $rootScope.breadcrumb_1Link = 'settings/home'
                            $rootScope.breadcrumb_2Heading = 'Users';
                            $rootScope.breadcrumb_2Link = 'settings/users';
                            $rootScope.breadcrumb_3Heading = 'Edit User';
                            break;
                        case '/settings/organizations':
                            $rootScope.breadcrumb_2 = true;
                            $rootScope.breadcrumb_1Heading = 'Settings';
                            $rootScope.breadcrumb_2Heading = 'External Organizations';
                            break;
                        case '/settings/player-lists':
                            $rootScope.breadcrumb_2 = true;
                            $rootScope.breadcrumb_1Heading = 'Settings';
                            $rootScope.breadcrumb_2Heading = 'Player List';
                            break;
                        case '/settings/organizations/edit/:id?':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Settings';
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
                            $rootScope.breadcrumb_1Heading = 'Settings';
                            $rootScope.breadcrumb_2Heading = 'External Organizations';
                            $rootScope.breadcrumb_2Link = 'settings/organizations';
                            $rootScope.breadcrumb_3Heading = 'Users';
                            break;
                        case '/organizations/students/details/:OrgId?':
                            $rootScope.breadcrumb_3 = true;
                            $rootScope.breadcrumb_1Heading = 'Settings';
                            $rootScope.breadcrumb_2Heading = 'External Organizations';
                            $rootScope.breadcrumb_2Link = 'settings/organizations';
                            $rootScope.breadcrumb_3Heading = 'Students';
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
                        default:
                        console.log(next.originalPath)
                    }
                }
                if (next.templateUrl == "views/pages/signin.html") {
                    $location.path("/");
                } else if ( next.originalPath == "/pages/studentLogin" || next.originalPath == '/pages/content-questions/:userId/:scheduledQuestionId' || next.originalPath == "/reference-library/:userAccountId" || next.originalPath == "/message/:id" || next.originalPath == '/messages' || next.originalPath == '/myTasks/:incidentId' || next.originalPath == '/taskDetail/:taskId' || next.originalPath == '/active-games' || next.originalPath == '/my-messages/:templateGameId/:userId') {
                    $rootScope.fixedHeader = false;
                    console.log('-----');
                }
                else if ($rootScope.infoProvider === true || localStorage['role'] === 'IP') {
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
