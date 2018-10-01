angular.module('app').factory('MessageService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var MessageService = {
        timeLine : function (incidentId) {
            return Query.request('GET',$apiRootCM+'messages/timeline/' + incidentId,{});
        },
        all : function (userId,incidentId,type) {
            return Query.request('GET',$apiRootCM+'messages/all/'+ type + '/'  + userId + '/' + incidentId,{});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'messages/update',{data: data});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'messages/save',{data: data});
        },
        incoming : function (incidentId) {
            return Query.request('GET',$apiRootCM+'messages/incoming/' + incidentId,{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootCM+'messages/delete/' + id,{});
        },
    };
    return MessageService;
}]);