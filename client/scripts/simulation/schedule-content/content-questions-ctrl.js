(function () {
    'use strict';

    angular.module('app')
        .controller('contentQuestionsCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$timeout','Query', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$timeout,Query, AccountService) {

        // $scope.round={};
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        // fetch and get initial data
        function init() {
            $scope.page1 = true;
            $scope.page2 = false;
            $scope.page3 = false;
            $scope.newDate = new Date().toDateString();
            $scope.user = Query.getCookie('user');
            $http.get('/question-scheduling/get/' + $routeParams.scheduledQuestionId).then(function(res){
                $scope.data = res.data;
                var comngDate = new Date($scope.data.activatedAt)
                console.log('-=-=-=-=-=-=-=-=-=-=-=',$scope.data)
                console.log('-=-=-=-=-=-=+++++=++',comngDate)
                console.log('-=-=-=-=-=-=>><<<>><<<<',new Date($scope.data.content_plan_template.start_time),'{{{}}}}',new Date(comngDate.getTime() + $scope.data.total_time*1000));
                if(new Date() > new Date(comngDate.getTime() + $scope.data.total_time*1000)){
                    $scope.page1 = false;
                    $scope.page2 = true;
                    $scope.page3 = false;
                }
                $scope.time = new Date($scope.data.content_plan_template.start_time);
                console.log('LKLKLKLKL',$scope.time);

            });
        };
        init();

        $scope.submitAnswer = function () {
            console.log('----------',$scope.data.question.id)
            $http.get('/questions/one/' + $scope.data.question.id).then(function(res){
                $scope.result = res.data;
                if($scope.result.answer){
                    toastr.success("Your Response Already Submitted Successfully");
                }else{
                    $scope.answer = {
                        questionId : $scope.data.question.id,
                        text : $scope.data.ans,
                        userId : $routeParams.userId,
                        contentPlanTemplateId : $scope.data.content_plan_template.id
                    }
                    $http.post('/content-questions/save', $scope.answer)
                    .then(function(response){
                        $scope.Answer=response.data;
                        toastr.success("Answer Submitted Successfully");
                        $scope.page1 = false;
                        $scope.page2 = false;
                        $scope.page3 = true;
                    });
                }
            });

        };

    }
}());
