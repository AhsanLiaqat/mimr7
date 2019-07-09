angular.module('app')
.factory('AuthService', function ($http ,$location, $q, $rootScope,Query) {
    // var $http = $injector.get('$http');
        return {
            login: function (data) {
                console.log('()()()()',data)
                var deferred = $q.defer();

                // $.get( "http://ip-api.com/json", function( respp ) {
                    data.login_detail = '';
                    $http.post("/auth/login", data).then(function (res) {
                        $rootScope.userNam = res.data.name;
                        user = res.data.token;
                        var exp = new Date(new Date().getTime() + 1000*60*60).toUTCString();
                        Query.setCookie('Auth_token',user,{expires: exp});
                        if (res.data.token) {
                            $http.get('/users/me').then(function (response) {
                                Query.setCookie('user', JSON.stringify(response.data))
                                localStorage['role'] = res.data.role;
                                // localStorage["session"] = user;
                                if (res.data.role === 'IP') {
                                    $rootScope.superAdmin = false;
                                    $rootScope.infoProvider = true;
                                    $location.path("/messages");
                                }
                                else if (res.data.role === 'superadmin') {
                                    $rootScope.superAdmin = true;
                                    $rootScope.infoProvider = false;
                                    $location.path("/superadmin");
                                }
                                else {
                                    $rootScope.superAdmin = false;
                                    $rootScope.infoProvider = false;

                                    $location.path("/home");
                                }
                            });
                            deferred.resolve("success")
                        }
                    },
                    function (data) {
                        toastr.error("Invalid Credentials !");
                    });
                // });

                return deferred.promise;
            },
            setUser: function (aUser) {
                user = aUser;
            },
            isLoggedIn: function () {
                return (user) ? user : false;
            },
            logout: function () {
                user = null;
                $http.get('/auth/logout').then(function (res) {
                    Query.delCookie('Auth_tk.sig');
                    Query.delCookie('auth-tkt');
                    $rootScope.superAdmin = false;
                    $rootScope.infoProvider = false;
                    Query.delCookie('incidentSelected');
                    Query.delCookie('user');
                    Query.delCookie('Auth_token');
                    delete localStorage['role'];
                    $location.path("/");
                });

            },
            user: function () {
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
    })
