angular.module('app').factory('DepartmentService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var DepartmentService = {
        get : function () {
            return Query.request('GET',$apiRootSettings+'departments/get/',{});
        },
        getAll : function (userAccountId) {
            return Query.request('GET',$apiRootSettings+'departments/all?userAccountId=' + userAccountId,{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'departments/remove/'+id,{});
        },
        create : function (data) {
            return Query.request('POST',$apiRootSettings+'departments/save/',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'departments/update/',{data: data});
        }
    };
    return DepartmentService;
}]);