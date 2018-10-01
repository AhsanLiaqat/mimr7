angular.module('app').factory('IncidentTypeService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var IncidentTypeService = {
        item : function (id) {
            return Query.request('GET',$apiRootSettings+'incident-types/item?id=' + id,{});
        },
        all : function () {
            return Query.request('GET',$apiRootSettings+'incident-types/all',{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'incident-types/delete/'+id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'incident-types/save',{data: data});
        },
        list : function () {
            return Query.request('GET',$apiRootSettings+'incident-types/list',{});
        },
    };
    return IncidentTypeService;
}]);