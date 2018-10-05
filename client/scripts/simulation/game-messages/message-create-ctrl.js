(function () {
    'use strict';

    angular.module('app')
        .controller('messageCreateCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','articleId','ModalService', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter,articleId,ModalService) {

        //close modal
        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };
        //fetch and set initial data
        function init() {
            $scope.user = Query.getCookie('user');
        }
        $scope.get_libraries =  function(gameId){
             $http.get('/simulation/game-libraries/all-for-game/'+gameId).then(function (response) {
                var library = response.data;
                _.each(library, function (doc) {
                    if(doc.mimetype !== null){
                        $scope.documents.push(doc);
                    }
                });
            });
        }


        //compute roles list to show
        $scope.computeRoles = function(id){
            $scope.rolesToShow = [];
            angular.forEach($scope.roles, function(value) {
              if(value.gamePlanId == $scope.message.gamePlanId){
                $scope.rolesToShow.push(value);
              }
            });
        }
        init();

        $scope.addnewdocument = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/game-libraries/form.html",
                controller: "newGameLibraryCtrl",
                inputs: {
                    gamePlanId: gamePlanId
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                     $('.modal-backdrop').remove();
                     $('body').removeClass('modal-open');
					 console.log('message lib',result);

					 if(result && result !== ''){
						 $scope.documents.push(result)
                     }
                });
            });
        };

        //save new game message
        $scope.submit = function () {
            $scope.message.articleId = articleId;
            $http.post("/message/messages/save" , { data: $scope.message }).then(function (res) {
                toastr.success("Game Library updated successfully.")
                close(res.data);

            });
        };

        //validates message input
        function validateForm() {
            if (!$scope.message.name || $scope.message.name === '') {
                toastr.error('Please provide a valid message name.', 'Error!');
                return false;
            }
            return true;
        }
    }
}());