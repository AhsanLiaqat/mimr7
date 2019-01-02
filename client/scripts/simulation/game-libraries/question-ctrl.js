(function () {
    'use strict';

    angular.module('app')
    .controller('newQuestionCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query','close','messageId','articleId', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query, close,messageId,articleId) {
        $scope.messageId = messageId;
        $scope.save = function () {
            $scope.data.messageId = messageId;
            $scope.data.articleId = articleId;
            $http.post('/questions/save',{data : $scope.data})
            .then(function(res){
                $scope.data = res.data;
                toastr.success('Content Added.', 'Success!');
                close(res.data);
            });
                
        };

        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };
    }
}());