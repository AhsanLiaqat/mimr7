(function () {
    'use strict';

    angular.module('app')
    .controller('browserCtrl', ['$scope','filterFilter', '$location', '$routeParams', '$http', 'AuthService','ModalService','$filter','$sce','Query','LibraryService','MessageService','IncidentService', ctrlFunction]);
    function ctrlFunction($scope,filterFilter, $location, $routeParams, $http, AuthService, ModalService, $filter,$sce,Query, LibraryService, MessageService, IncidentService) {

        function init() {
            // var cookiesLinks = Query.getCookie('mediaLink');
            // console.log(cookiesLinks)
            // if(cookiesLinks != {}){
            //     $scope.liblink = $sce.trustAsResourceUrl(cookiesLinks);
            //     $scope.link = $sce.trustAsResourceUrl(cookiesLinks);
            // }else{
            //     $scope.link = '' ;
            //     $scope.liblink ='';
            // }
            if($routeParams.id){
                LibraryService.get($routeParams.id).then(function(res){
                    $scope.libReferences = res.data;
                    $scope.liblink = $sce.trustAsResourceUrl($scope.libReferences.links);
                    $scope.link = $sce.trustAsResourceUrl($scope.libReferences.links);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = '/settings/libraries/get?id=' + $routeParams.id;
                // $http.get(path).then(function(res) {
                    

                // });
            }
            $scope.messages = {};
            $scope.user = Query.getCookie('user');
            IncidentService.all($scope.user.userAccountId).then(function(response){
                $scope.incidents = response.data;
                $scope.sortByCreated = _.sortBy($scope.incidents, function(o) { return new Date(o.updatedAt); });
                $scope.incidents = $scope.sortByCreated.reverse();

                if (Query.getCookie('incidentSelected') == undefined && $scope.incidents.length > 0) {
                    $scope.incident = $scope.incidents[0]
                    Query.setCookie('incidentSelected', JSON.stringify($scope.incident));
                    $scope.selectIncident = false;
                }

                if (Query.getCookie('incidentSelected')  !== undefined) {
                    var incident = Query.getCookie('incidentSelected');
                    var selectedIncident = filterFilter($scope.incidents, {'id': incident.id});
                    $scope.incident = selectedIncident[0];
                    Query.setCookie('incidentSelected', JSON.stringify($scope.incident));
                    $scope.sortByCreate = _.sortBy($scope.messages, function(o) { return new Date(o.createdAt); });
                    $scope.messages = $scope.sortByCreate.reverse();
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/api/incidents/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            // });

        }

        $scope.refreshframe = function(){
            $scope.link = $sce.trustAsResourceUrl($scope.liblink);
            Query.setCookie('mediaLink', $scope.link);
        };

        $scope.changeIncident = function (incident) {
            $scope.incident = incident;
            if ($scope.incident.id !== undefined) {
                $scope.selectIncident = false;
                Query.setCookie('incidentSelected', JSON.stringify($scope.incident));
            }
            init();
        };
        $scope.RefreshPage = function(){
            $scope.link = $scope.liblink;
        };

        var postMessage = function (data) {
            if (data.message != '' && data.message != undefined){
                $scope.message = '';
                data.userId = $scope.user.id;
                MessageService.save(data).then(function(res){
                    $scope.messages.push(res.data);
                    $scope.noMessage = false;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/messages/save", { data: data }).then(function (res) {
                    
                // });
            }
        };

        $scope.clearBrowser = function() {
            $scope.liblink = '';
            $scope.link = ' ';
            Query.delCookie('mediaLink');
        }

        $scope.sendMessage = function (msg) {
            var data = {};
            data.message = msg;
            data.incidentId = $scope.incident.id;
            postMessage(data);
        };

        init();

    }
}());
