angular.module('app').factory('ActionService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var ActionService = {
        get : function (id) {
            return Query.request('GET',$apiRootCM+'actions/get?id=' + id,{});
        },
        all : function () {
            return Query.request('GET',$apiRootCM+'actions/all',{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'actions/save',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'actions/update',{data: data});
        },
        resetActionList : function (actionListId) {
            return Query.request('DELETE',$apiRootCM+'actions/reset-action-list/' + actionListId,{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootCM+'actions/delete/' + id,{});
        },
        bulkSave : function (data) {
            return Query.request('POST',$apiRootCM+'actions/bulk-save',{data: data});
        },
    };
    return ActionService;
}]);