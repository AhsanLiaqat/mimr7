angular.module('app').factory('RoleService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var RoleService = {
        get : function () {
            return Query.request('GET',$apiRootSettings+'roles/get',{});
        },
        all : function () {
            return Query.request('GET',$apiRootSettings+'roles/all',{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'roles/remove/'+id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'roles/save',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'roles/update',{data: data});
        },
        updateUserRole : function (data) {
            return Query.request('POST',$apiRootSettings+'roles/update-user-role',{data: data});
        },
        saveUserRole : function (data) {
            return Query.request('POST',$apiRootSettings+'roles/save-user-role',{data: data});
        },
    };
    return RoleService;
}]);