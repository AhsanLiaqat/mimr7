(function () {
    'use strict';

    angular.module('app')
    .controller('capacityCreateCtrl', ['$scope', 'close', '$routeParams', '$http', 'capacity','CapacityService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, capacity, CapacityService) {

        function init() {
            if($routeParams.id !== undefined) {
                $scope.classId = $routeParams.id;
            }
            $scope.tinymceOptions = {
                theme: "modern",
                plugins: [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                    "searchreplace wordcount visualblocks visualchars code fullscreen",
                    "insertdatetime media nonbreaking save table contextmenu directionality",
                    "emoticons template paste textcolor"
                ],
                toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                toolbar2: "print preview media | forecolor backcolor emoticons",
                image_advtab: true,
                statusbar: false
            };

            if(capacity){
                $scope.data = capacity;
            }else{
                $scope.data = {};
            }

        }

        $scope.submit = function(){
            CapacityService.save($scope.data).then(function(res){
                toastr.success("Capacity saved successfully!");
                close(res.data);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

            });
            // $http.post("/settings/capacities/save", {data: $scope.data}).then(function(res){
                
            // });
        }
        $scope.close = function() {
            close();
        }
        init();
    }
}());
