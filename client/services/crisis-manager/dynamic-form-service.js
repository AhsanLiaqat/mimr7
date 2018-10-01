angular.module('app').factory('DynamicFormService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var DynamicFormService = {
        get : function (id) {
            return Query.request('GET',$apiRootCM+'dynamic-form/get?id=' + id,{});
        },
        all : function (userAccountId) {
            return Query.request('GET',$apiRootCM+'dynamic-form/all?userAccountId=' + userAccountId,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'dynamic-form/save',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'dynamic-form/update',{data: data});
        },
        sendForm : function (data) {
            return Query.request('POST',$apiRootCM+'dynamic-form/send-form',{data: data});
        },
        getFormForPlayer : function (gameId,playerId) {
            return Query.request('GET',$apiRootCM+'dynamic-form/get-form/'+gameId+'/'+playerId);
        },
        UpdateFormDetail : function (data) {
            return Query.request('POST',$apiRootCM+'dynamic-form/update-form-detail',{data: data});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootCM+'dynamic-form/remove/' + id,{});
        }
    };
    return DynamicFormService;
}]);