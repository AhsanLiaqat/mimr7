(function () {
    'use strict';
    angular.module('app')
    .controller('editCategoryCtrl', ['$scope', 'close', '$http', 'ModalService','data', 'incident_id', 'Query','ClassService','MessageHistoryService', ctrlFunction]);
    function ctrlFunction($scope, close, $http, ModalService, data, incident_id,Query, ClassService, MessageHistoryService) {
        function init() {
            $scope.user = Query.getCookie('user');
            $scope.data = data;
            $scope.froalaOptionsForMessage = {
                key: 'NikyA4H1qaA-21fE-13dplxI2C-21r==',
                toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"]
            }
        }
        init();

        $scope.close = function() {
            close();
        };

        $scope.timeFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        $scope.updateClass = function (cls) {
            ClassService.update(cls).then(function(res){
                toastr.success("Category updated successfully");
                cls.modal_edit = false;
                cls.ex = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/class/update', { data: cls }).then(function (res) {

            // });
        };

        $scope.editClass = function (item, evt) {
            item._title = item.title;
            item.modal_edit = true;
        };

        $scope.cancelEditClass = function (item, evt) {
            item.title = item._title;
            item.modal_edit = false;
        };

        $scope.createSubCategory = function (classID) {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/information-dashboard/sub-category-template.html",
                controller: "subClassCtrl",
                inputs: {
                    incidentID: incident_id,
                    classId: classID
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.deleteCategory = function (cls) {
            ClassService.delete(cls).then(function(res){
                toastr.success("Category removed successfully");
                close('deleted');
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/class/remove', { data: cls }).then(function (res) {

            // });
        };

        $scope.updateMessage = function (item, cls) {
            MessageHistoryService.update(item).then(function(res){
                toastr.success('Message successfully updated');
                item.modal_edit = false;
                cls.messages = _.sortBy(cls.messages, function (msg) { return msg.index });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/message-history/update', { data: item }).then(function (res) {

            // });
        };

        $scope.editItem = function (item, evt) {
            item.modal_edit = true;
            item._content = item.content;
        };

        $scope.cancelEditItem = function (item, evt) {
            item.content = item._content;
            item.modal_edit = false;
        };

        $scope.deleteMessage = function (item, cls) {
            MessageHistoryService.delete(item.id,cls.id).then(function(res){
                toastr.success("Message deleted successfully");
                var idx = cls.messages.indexOf(item);
                cls.messages.splice(idx, 1);
                cls.messages.find(function (msg) {
                    if (msg && msg.index >= item.index){
                        msg.index = msg.index-1;
                        $scope.updateMessage(msg, cls);
                    }
                });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/message-history/remove', { id: item.id }).then(function (res) {

            // });
        };
    }
}());
