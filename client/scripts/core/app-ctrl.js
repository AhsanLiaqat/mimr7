(function () {
    'use strict';

    angular.module('app')
        .controller('appCtrl', ['$scope', '$rootScope', 'ModalService', '$route', '$document', 'AuthService', '$http','Query','$cookies', appCtrl]); // overall control

    function appCtrl($scope, $rootScope, ModalService, $route, $document, AuthService, $http,Query,$cookies) {

        $scope.getUser = function () {
            if (Query.getCookie('user')){
                $scope.user = Query.getCookie('user');
            }
        };

        $scope.checkAdmin = function () {
            $scope.getUser();
            if ($scope.user && ($scope.user.role === 'admin' || $scope.user.role === 'CA')) {
                return true;
            } else {
                return false;
            }
        };
    
        $('.main-container').click(function(event){
            if($(event.target).parents('.nav').length == 0 && $('#nav-container').offset().left == 0){
                $scope.clickMenu();
            }
        });

        
        $scope.checkSuperAdmin = function () {
            $scope.getUser();
            if ($scope.user && ($scope.user.role === 'superadmin')) {
                return true;
            }else{
                return false;
            }
        };

        var date = new Date();
        var year = date.getFullYear();

        $scope.main = {
            brand: 'CrisisHub',
            name: 'Max Power',
            year: year
        };

        $scope.clickMenu = function () {
            document.getElementById('new-menu').click();
        };

        $http.get('/users/me').then(function (response) {
            if (response.data !== '') {
  				// var socket = io('http://localhost:8888');
                $rootScope.userNam = response.data.firstName +' '+response.data.lastName;
            }
        });



        $scope.logout = function () {
            AuthService.logout();
            // delete $scope.user;
        };

        $scope.pageTransitionOpts = [
            {
                name: 'Fade up',
                "class": 'animate-fade-up'
            }, {
                name: 'Scale up',
                "class": 'ainmate-scale-up'
            }, {
                name: 'Slide in from right',
                "class": 'ainmate-slide-in-right'
            }, {
                name: 'Flip Y',
                "class": 'animate-flip-y'
            }
        ];

        $scope.admin = {
            layout: 'wide',                                 // 'boxed', 'wide'
            menu: 'vertical',                               // 'horizontal', 'vertical', 'collapsed'
            fixedHeader: true,                              // true, false
            fixedSidebar: true,                             // true, false
            pageTransition: $scope.pageTransitionOpts[1],   // unlimited
            skin: '12'                                      // 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
        };

        $scope.$watch('admin', function (newVal, oldVal) {
            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                    $scope.admin.fixedHeader = true;
                    $scope.admin.fixedSidebar = true;
                }
                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                    $scope.admin.fixedHeader = false;
                    $scope.admin.fixedSidebar = false;
                }
            }
            if (newVal.fixedSidebar === true) {
                $scope.admin.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
                $scope.admin.fixedSidebar = false;
            }
        }, true);

        $scope.color = {
            primary: '#7992BF',
            success: '#A9DC8E',
            info: '#6BD5C3',
            infoAlt: '#A085E4',
            warning: '#ECD48B',
            danger: '#ED848F',
            gray: '#DCDCDC'
        };

        $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
            $document.scrollTo(0, 0);
        });
    }

})();


String.prototype.toCamelCase = function() {
    return this.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
};
