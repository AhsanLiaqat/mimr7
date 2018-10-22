(function () {
    'use strict';

    angular.module('app')
    .controller('simulationMessageCtrl', ['$scope', '$timeout', '$location', 'ModalService', '$filter', '$http', '$rootScope', '$route', 'AuthService','$routeParams','Query', taskFunc]);

    function taskFunc($scope, $timeout, $location, ModalService, $filter, $http, $rootScope, $route, AuthService,$routeParams,Query) {

        $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.selected = 0;

        var setSocketForMessages = function(){
            $timeout(function () {
                SOCKET.on('incoming_message:'+$routeParams.gamePlanId, function (response) {
                    var data = response.data;
                    if(response.action == "new"){
                        console.log("incoming_message new------",data);
                        $scope.messageToShow.push(data);
                        toastr.success("New message arrived in incomming messages.");
                    }else if(response.action == "update"){
                        console.log("incoming_message update",data);
                        for(var i = 0; i < $scope.messageToShow.length; i++){
                            if($scope.messageToShow[i].id == data.id){
                                $scope.messageToShow[i] = data;
                                toastr.success("Incoming message moved to class.");
                            }
                        }
                    }else if(response.action == "delete"){
                        console.log("incoming_message delete",data);
                        for(var i = 0; i < $scope.messageToShow.length; i++){
                            if($scope.messageToShow[i].id == data.id){
                                $scope.messageToShow.splice(i,1);
                                toastr.success("Incoming message moved to class.");
                            }
                        }
                    }else {
                        toastr.error("Something went wrong!");
                        console.log("incoming_message --> does not match any action incident_class socket.",response);
                    }
                    // $scope.messages = Query.sort($scope.messages,'createdAt',true);
                    $scope.$apply();
                });
            });
        };


        function init() {

            $scope.messagesTable = function (tableState) {
                $scope.selectoptions = [];
                $scope.messageToShow = []
                $scope.selectoptions.push({id: 0,title: 'All'});
                $scope.isLoading = true;
                $scope.tableState = tableState;

                $scope.user = Query.getCookie('user');
                $http.get('/messages/all?id=' + $routeParams.gamePlanId).then(function (respp) {
                    $http.get('/articles/all').then(function (resp) {
                        $scope.gameTemplates = resp.data;
                        angular.forEach($scope.gameTemplates, function(value) {
                          $scope.selectoptions.push(value);
                        });
                        $scope.messages = respp.data;
                        $scope.messages = _.sortBy($scope.messages, function (o) { return new Date(o.content); });
                        $scope.safeMessages = angular.copy($scope.messages);
                        $scope.isLoading = false;
                        if($routeParams.gamePlanId){
                            $scope.gameIdFound = true;
                            $scope.selected = $routeParams.gamePlanId;
                        }
                        $scope.messageToShow =  angular.copy($scope.messages);

                        // $scope.managearray($scope.selected);
                    });
                });
                
            };
            setSocketForMessages();
        }




        //do pagination
        // $scope.paginate = function(arr){
        //     $scope.a = _.sortBy(arr, function (o) { return new Date(o.name); });
        //     $scope.total = arr.length;
        //     var tableState = $scope.tableState;
        //     var pagination = tableState.pagination;
        //     var start = pagination.start || 0;
        //     var number = pagination.number || 10;
        //     var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
        //     if (tableState.sort.predicate) {
        //         filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
        //     }
        //     var result = filtered.slice(start, start + number);
        //     tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
        //     return result;
        // }

        //filter array to show on gamePlanId
        $scope.managearray = function(id){
            console.log('--=-=--=-=-=-=-=-',id)
            if(id == 0){
                $http.get('/messages/all').then(function (response) {
                    console.log('==================',response.data);
                    $scope.allMessages = response.data;
                    $scope.messageToShow =  angular.copy($scope.allMessages);
                });
            }else{
                $scope.messageToShow = [];
                $http.get('/messages/all?id=' + id).then(function (response) {
                    $scope.articleMessage = response.data;
                    angular.forEach($scope.articleMessage, function(value) {
                        if(value.articleId == id){
                            $scope.messageToShow.push(value);
                        }
                    });
                });
            }
            // $scope.messageToShow = $scope.paginate($scope.messageToShow);
        }


        // open details of message
        $scope.showMessageDetail = function(record) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/message-show-modal.html",
                controller: "messageShowDetailCtrl",
                inputs:{
                    message: record
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result && result !== ''){
                    }
                });
            });
        };

        // add message modal
        $scope.addModal = function() {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/form.html",
                controller: "messageCreateCtrl",
                inputs:{
                    messageId: null,
                    articleId: $routeParams.gamePlanId
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.addMedia = function(record) {
            var inputs = {
                id: null,
                articleId: null,
                contentType : 'message-library',
                messageId : record.id
            };
            ModalService.showModal({
                templateUrl: "views/simulation/game-libraries/form.html",
                controller: "newGameLibraryCtrl",
                inputs: inputs
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    // if(result){
                    //     $scope.media.push(result);
                    // }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.edit = function(message, index) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/form.html",
                controller: "messageCreateCtrl",
                inputs:{
                    messageId: message.id,
                    articleId : $routeParams.gamePlanId
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    // if(result){
                    //     $scope.messageToShow[index] = result;
                    // }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    // $scope.messagesTable($scope.tableState);
                });
            });
        };

        //deletes message
        $scope.deleteMessage = function (id, index) {
            $http.delete("/messages/remove/" + id)
                .then(function(res){
                   
                });
        };

        init();

    }


}());
