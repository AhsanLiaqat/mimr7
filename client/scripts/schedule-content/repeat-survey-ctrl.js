(function () {
    'use strict';

    angular.module('app')
    .controller('repeatSurveyCtrl', ['$rootScope', '$scope', '$filter', '$http', '$timeout', '$location', '$routeParams', 'ModalService', 'filterFilter','close','survey', repeatSurveyCtrl]);

    function repeatSurveyCtrl($rootScope, $scope, $filter, $http, $timeout, $location, $routeParams, ModalService, filterFilter,close,survey) {

        $scope.save = () => {
            $scope.data.type = true;
            $http.post('/surveys/update/' + survey.id,{data : $scope.data})
                .then(function(res){
                $scope.data = res.data;
                close();

            });
        };

        $scope.close = function() {
            close();
        }
        
    }

})();
