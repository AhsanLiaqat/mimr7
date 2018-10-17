angular.module('app').factory('CapacityService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var CapacityService = {
        list : function () {
            return Query.request('GET',$apiRootSettings+'capacities/list',{});
        },
        saveDashBoardFields : function (data) {
            return Query.request('POST',$apiRootSettings+'capacities/save-dash-board-fields/',{data: data});
        },
        delete : function (id) {
            console.log(id);
            return Query.request('DELETE',$apiRootSettings+'capacities/remove/'+id,{});

        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'capacities/save/',{data: data});
        },
    };
    return CapacityService;
}]);