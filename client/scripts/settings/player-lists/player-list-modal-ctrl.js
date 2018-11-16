(function () {
    'use strict';

    angular.module('app')
        .controller('playerListModalCtrl', ['$scope',
            'close',
            '$http',
            'AuthService',
            'list',
            
            'ModalService',
            'Query',
            'organizationId',
            ctrlFunction]);
    function ctrlFunction($scope,
                          close,
                          $http,
                          AuthService,
                          list,
                          
                          ModalService,
                          Query,
                          organizationId
    ) {
        
        
        // fetch and set initial data
        function init() {
            $scope.user = Query.getCookie('user');
            if(organizationId){
                $scope.organizationId = organizationId;
            }
            if(list){
                $http.get('/settings/player-lists/get/' + list.id).then(function (response) {
                    $scope.data = response.data;
                    $scope.organizationId = $scope.data.organizationId;
                });
            }
            $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                $scope.organizations = response.data;
            });
        };
        init();

        //add or edit player list
        $scope.submit = function () {
            if (!$scope.data.name || $scope.data.name === ''){
                toastr.error('Enter valid name','Error!');
            } else{
                if (list){
                    $scope.data.organizationId = $scope.organizationId;
                    $http.put('/settings/player-lists/update', {data: $scope.data})
                        .then(function (result) {
                            toastr.success('Player List updated','Success!');
                            close($scope.data);
                        }, function (error) {
                            toastr.error(error, 'Error!');
                        })
                }else{
                    $scope.data.organizationId = $scope.organizationId;
                    $http.post('/settings/player-lists/save', {data: $scope.data}).then(function (result) {
                        toastr.success('Player List created','Success!');
                        close(result.data);
                    }, function (error) {
                        toastr.error(error, 'Error!');
                    });
                }
            }
        };

        //close modal
        $scope.close = function () {
            close();
        };
    }
}());