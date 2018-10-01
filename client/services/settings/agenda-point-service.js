angular.module('app').factory('AgendaPointService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var AgendaPointService = {
        list : function (accountId) {
            return Query.request('GET',$apiRootSettings+'agenda-points/list?accountId=' + accountId,{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'agenda-points/delete/'+id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'agenda-points/save',{data: data});
        },
        saveActivityList : function (data) {
            return Query.request('POST',$apiRootSettings+'agenda-points/save-activity-list',data);
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'agenda-points/update',{data: data});
        },
    };
    return AgendaPointService;
}]);