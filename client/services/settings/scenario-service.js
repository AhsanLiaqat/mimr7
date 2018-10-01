angular.module('app').factory('ScenarioService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var ScenarioService = {
        list : function (routeId) {
            return Query.request('GET',$apiRootSettings+'scenarios/list?userAccountId=' + routeId,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'scenarios/save/',{data: data});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'scenarios/remove/' + id,{});
        },
    };
    return ScenarioService;
}]);