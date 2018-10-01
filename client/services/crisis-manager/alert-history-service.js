angular.module('app').factory('AlertHistoryService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var AlertHistoryService = {
        save : function (data) {
            return Query.request('POST',$apiRootCM+'alert-history/save',{data: data});
        },
    };
    return AlertHistoryService;
}]);