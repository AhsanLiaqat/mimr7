angular.module('app').factory('CustomMessageService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var CustomMessageService = {
        get : function (id) {
            return Query.request('GET',$apiRootSettings+'custom-messages/get?id=' + id,{});
        },
        all : function () {
            return Query.request('GET',$apiRootSettings+'custom-messages/all',{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'custom-messages/remove/'+id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'custom-messages/save',{data: data});
        },
        getactivationMessage : function (type,template) {
            return Query.request('GET',$apiRootSettings+'custom-messages/activation-message?type=' + type + '&template=' + template,{});
        },
        defaultTemplates : function (userAccountId) {
            return Query.request('GET',$apiRootSettings+'custom-messages/default-templates?userAccountId=' + userAccountId,{});
        }
        // activationMessageSms : function () {
        //     return Query.request('GET',$apiRootSettings+'custom-messages/activation-message?type=Action Plan&template=SMS',{});
        // },
    };
    return CustomMessageService;
}]);