angular.module('app').factory('TaskService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var TaskService = {
        get : function (id) {
            return Query.request('GET',$apiRootSettings+'tasks/get?id=' + id,{});
        },
        all : function (userAccountId) {
            return Query.request('GET',$apiRootSettings+'tasks/all?userAccountId=' + userAccountId,{});
        },
        unAssignedAll : function (accountId) {
            return Query.request('GET',$apiRootSettings+'tasks/un-assigned-all?accountId=' + accountId,{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'tasks/remove/'+id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'tasks/save/',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'tasks/update/',{data: data});
        },
        createWithTags : function (data) {
            return Query.request('POST',$apiRootSettings+'tasks/create-with-tags',{data: data});
        },
        updateWithTags : function (data) {
            return Query.request('POST',$apiRootSettings+'tasks/update-with-tags',{data: data});
        },
    };
    return TaskService;
}]);