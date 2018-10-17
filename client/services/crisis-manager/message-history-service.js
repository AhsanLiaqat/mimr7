angular.module('app').factory('MessageHistoryService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var MessageHistoryService = {
        timeLine : function (incidentId,category) {
            return Query.request('GET',$apiRootCM+'message-history/timeline/' + incidentId + '?category=' + category,{});
        },
        all : function (incidentId) {
            return Query.request('GET',$apiRootCM+'message-history/all/' + incidentId,{});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'message-history/update',{data: data});
        },
		updateIndex : function (data) {
            return Query.request('POST',$apiRootCM+'message-history/update-index',{data: data});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'message-history/save',{data: data});
        },
        incomeToHistory : function (data) {
            return Query.request('POST',$apiRootCM+'message-history/income-to-history',{data: data});
        },
        delete : function (id,clsId) {
            return Query.request('DELETE',$apiRootCM+'message-history/remove/' + id + '/' + clsId,{});
        },
        bulkRemove : function (data) {
            return Query.request('POST',$apiRootCM+'message-history/bulk-remove',{data: data});
        },
        updateSubId : function (data) {
            return Query.request('POST',$apiRootCM+'message-history/bulk-remove',{data: data});
        },
    };
    return MessageHistoryService;
}]);
