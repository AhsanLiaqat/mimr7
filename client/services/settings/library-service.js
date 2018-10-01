angular.module('app').factory('LibraryService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var LibraryService = {
        get : function (id) {
            return Query.request('GET',$apiRootSettings+'libraries/get?id=' + id,{});
        },
        all : function () {
            return Query.request('GET',$apiRootSettings+'libraries/all',{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'libraries/remove/'+id,{});
        },
        save : function (data) {
            return Query.request('UPLOAD',$apiRootSettings+'libraries/save',data);
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'libraries/update',{data: data});
        },
        userLib : function (accountId) {
            return Query.request('GET',$apiRootSettings+'libraries/user-lib?userAccountId=' + accountId,{});
        },
        getCustomLib : function (userAccountId) {
            return Query.request('GET',$apiRootSettings+'libraries/get-custom-lib/help?userAccountId=' + userAccountId,{});
        },
    };
    return LibraryService;
}]);