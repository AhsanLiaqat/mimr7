angular.module('app').factory('CheckListService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var CheckListService = {
        list : function (accountId) {
            return Query.request('GET',$apiRootSettings+'check-lists/list?accountId=' + accountId,{});
        },
        saveIncidentCheckList : function (data) {
            return Query.request('POST',$apiRootSettings+'check-lists/save-incident-check-list',{data: data});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'check-lists/delete/'+id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'check-lists/save/',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'check-lists/update',{data: data});
        },
    };
    return CheckListService;
}]);