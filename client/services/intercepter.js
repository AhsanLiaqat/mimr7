angular.module('app').service('Interceptor',['Query','$injector','$q','$rootScope','$location', function(Query,$injector,$q,$rootScope,$location) {
    var service = this;
    service.request = function(config) {
    	var authService = $injector.get('AuthService');
        var location = $injector.get('$location');
    	var token = Query.getCookie('Auth_token',false);
    	var canceler = $q.defer();
    	config.timeout = canceler.promise;

        config.headers['upper-url'] = location.$$path;
        if(token != undefined){
            config.headers.authorization = token;
            // console.log('---------------------------------',config.headers.authorization);
        }else{
    		// if(config.url != '/auth/logout'){
    		// 	authService.logout();
    		// }
    		// canceler.resolve();
    	}
        $(".my-loader-wrap").css("display", "block");
        LOAD_COUNTER ++;

    	return config;
    }; 

    service.responseError = function(response) {
    	var authService = $injector.get('AuthService');
        // var toastr = $injector.get('toastr');
        if (response.status == 380){
            var user = Query.getCookie('user');
            if(user){
                toastr.error(response.data,'warning');            
            }
            Query.delCookie('Auth_tkt.sig');
            Query.delCookie('auth-tkt');
            $rootScope.superAdmin = false;
            $rootScope.infoProvider = false;
            Query.delCookie('incidentSelected');
            Query.delCookie('user');
            Query.delCookie('Auth_token');
            
            delete localStorage['role'];
            $location.path("/pages/signin");
        }
        LOAD_COUNTER --;
        if(LOAD_COUNTER <= 0){
            $(".my-loader-wrap").css("display", "none");
            LOAD_COUNTER = 0
        }
        return $q.reject(response);
    };

    service.response = function (response) {
        var authService = $injector.get('AuthService');
        var exp = new Date(new Date().getTime() + 1000*60*60).toUTCString();
        Query.setCookie('Auth_token',Query.getCookie('Auth_token',false),{expires: exp});
        Query.setCookie('user',Query.getCookie('user',false),{expires: exp});
    	// console.log('------------------------------------------------',response);
        if (response.status == 401) {
        };
        LOAD_COUNTER --;
        if(LOAD_COUNTER <= 0){
            $(".my-loader-wrap").css("display", "none");
            LOAD_COUNTER = 0
        }
        return response || $q.when(response);
    }
}]);