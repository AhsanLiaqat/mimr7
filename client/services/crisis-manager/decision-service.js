angular.module('app').factory('DecisionService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var DecisionService = {
        get : function (id) {
            return Query.request('GET',$apiRootCM+'decisions/get?id=' + id,{});
        },
        all : function () {
            return Query.request('GET',$apiRootCM+'decisions/all',{});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'decisions/update',{data: data});
        },
        bulkSave : function (data) {
            return Query.request('POST',$apiRootCM+'decisions/bulk-save',{data: data});
        },
    };
    return DecisionService;
}]);