(function () {
    'use strict';

    angular.module('app')
        .controller('studentLoginCtrl', ['$scope', '$filter','$routeParams', '$http', 'AuthService', '$location','$uibModal','ModalService','$sce','$timeout','Query',ctrlFunction]);

        function ctrlFunction($scope ,$filter,$routeParams, $http, AuthService, $location,$uibModal,ModalService,$sce,$timeout,Query) {
            
            
            $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
            $scope.pageItems = 10;

            $scope.verify = function(){
                $http.post('users/verifyEmail',{data:$scope.data}).then(function(res) {
                    $scope.user = res.data;
                    var user = res.data.token;
                    var exp = new Date(new Date().getTime() + 1000*60*60).toUTCString();
                    Query.setCookie('Auth_token',user,{expires: exp});
                    if($scope.user.id){
                        $scope.state = 'first';
                        localStorage["loginStudentUser"] = JSON.stringify($scope.user);
                        localStorage["loginStudentState"] = $scope.state;
                        $scope.activeContentTable($scope.tableState);
                        toastr.success('Here is your active content');

                    }else{
                        toastr.error('Record Not found! Please provide correct information');
                    }
               });
            }

            $scope.show_messages = function(contentId){
                $scope.state = 'second';
                localStorage["loginStudentState"] = $scope.state;
                localStorage["loginStudentContentId"] = contentId;
                $http.get('/question-scheduling/my-messages/' + contentId)
                .then(function (response) {
                    if(response.status == 380){
                            toastr.warning('Content not Found');
                    }else{
                        $scope.myMessages = response.data;
                    }
                });
            }

            function init() {
                $scope.data = {};
                $scope.state = 'login';

                if(localStorage["loginStudentUser"]){
                    $scope.user = JSON.parse(localStorage["loginStudentUser"]);
                    $scope.data.email = $scope.user.email;
                    if(localStorage["loginStudentState"]){
                        $scope.state = localStorage["loginStudentState"];
                        if($scope.state == 'first'){
                            $scope.verify();
                        }else if ($scope.state == 'second'){
                            $scope.show_messages(localStorage["loginStudentContentId"],$scope.user.id);
                        }
                    }
                }
            }

            init();


            $scope.logout = function(){
                $scope.state = 'login';
                delete localStorage["loginStudentUser"];
                delete localStorage["loginStudentState"];
                delete localStorage["loginStudentContentId"]
                Query.delCookie('Auth_tk.sig');
                Query.delCookie('user');
                Query.delCookie('Auth_token');
            }

            $scope.activeContentTable = function (tableState) {
                $scope.tableState = tableState;
                if($scope.state != 'login'){
                    $scope.isLoading = true;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;
                    var number = pagination.number || 10;
                    $http.get('users/student-details/' + $scope.user.id)
                    .then(function (response) {
                        $scope.activeContent = response.data;
                        $scope.a = [];
                        angular.forEach($scope.activeContent, function(msg, key) {
                            if(msg.content_activated == true && msg.status != 'stop'){
                                $scope.a.push(msg);
                            }
                        });
                        $scope.total = response.data.length;
                        var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                        if (tableState.sort.predicate) {
                            filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                        }
                        var result = filtered.slice(start, start + number);
                        $scope.activeContent = result;

                        tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                        $scope.isLoading = false;

                    });
                }
            };

            $scope.dateTimeFormat = function (dat) {
                return moment(dat).utc().local().format('DD-MM-YYYY');
            };

            $scope.trustedHtml = function (value) {
                return $sce.trustAsHtml(value);
            };
        }
}());