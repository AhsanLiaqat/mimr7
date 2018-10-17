(function () {
    'use strict';

    angular.module('app')
        .controller('editGameTemplateModalCtrl', ['$scope', 'close', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'gameId', 'filterFilter','Query','RoleService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, $filter, AuthService, $location, ModalService, gameId, filterFilter,Query, RoleService) {

        var sortList = function () {
            $scope.data.assigned_game_messages = _.sortBy($scope.data.assigned_game_messages, function (assignedMessage) { return assignedMessage.game_plan_message.index; });
        };

        // fetch and set initial data
        function init() {
            $scope.page1 = true;        
            $scope.action = [];
            $scope.expand = false;
            $scope.activityExpand = false;
            $scope.user = Query.getCookie('user');
            $http.get('/simulation/games/get/' + gameId)
            .then(function (response) {
                $scope.data = response.data;
                $scope.data.planDate = $filter('date')($scope.data.planDate ,"dd/MM/yyyy");
                sortList();
            });
            $http.get("/simulation/game-categories/all").then(function (res) {
                $scope.categories = res.data;
            });
            RoleService.all().then(function(response){
                $scope.roles = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/roles/all").then(function (response) {
                
            // });
        };
        init();

        //opens modal to create game type
        $scope.addGameCategory = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/categories/form.html",
                controller: "newGameCategoryCtrl",
                inputs:{
                    category: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result && result !== ''){
                        $scope.categories.push(result);
                    }
                });
            });
        };

        //opens modal to create asigned message
        $scope.addGameMessages = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/game-template/add-game-messages-modal.html",
                controller: "addGameMessagesModalCtrl",
                inputs: {
                    userAccountId: $scope.user.userAccountId,
                    gamePlanId: $scope.data.id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result !== '' && typeof result !== 'undefined') {
                        angular.forEach(result, function (assignedMessages) {
                            $scope.data.assigned_game_messages.push(assignedMessages);
                        });
                        sortList();
                    }
                });
            });
        };
        
        //update game template
        $scope.update = function () {
            if($scope.data.name !== null && $scope.data.planDate !== null) {
                $scope.data.planDate = moment.utc($scope.data.planDate, 'DD/MM/YYYY', true).format();
                
                var data = {
                    id: $scope.data.id,
                    name: $scope.data.name,
                    description: $scope.data.description,
                    gameCategoryId: $scope.data.gameCategoryId,
                    planDate: $scope.data.planDate
                }

                $http.post('/simulation/games/update/'+$scope.data.id, { data: data })
                .then(function (response) {
                    $scope.page1 = false;
                    $scope.page2 = true;
                });
            } else {
                toastr.error("Please Fill Required Fields");
            }
        };

        $scope.closePicker = function(date){
            $('.datepicker').hide();
        };

        var updateActivityIndex = function () {
            angular.forEach($scope.data.assigned_game_messages, function (assignedMessage, index) {
                assignedMessage.game_plan_message.index = index;
                var data = { assignedGameMessageId: assignedMessage.id,
                             gamePlanId: $scope.data.id,
                             index: index };
                $http.post("/simulation/game-plan-messages/update-index", {data: data}).then(function (response) {
                });
            });
        }

        //delete game message
        $scope.deleteGameMessage = function (assignedMessage, index) {
            $http.delete("/simulation/game-plan-messages/remove/" + assignedMessage.game_plan_message.id)
                .then(function (response) {
                    $scope.data.assigned_game_messages.splice(index, 1);
                    toastr.success('Message removed', 'Success');
                    updateActivityIndex();
                });
        };

        $scope.saveExit = function (){
            close($scope.data);
        };

        //structure for drag option
        $scope.DragOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) { return true; },
            orderChanged: function (event) {
                updateActivityIndex();
                sortList();
            },
            itemMoved: function (event) {
            },
            dragStart: function (event) {  },
            dragEnd: function (event) {  }
        };
    }
}());