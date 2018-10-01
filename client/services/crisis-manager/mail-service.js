angular.module('app').factory('MailService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var MailService = {
        send : function (data) {
            return Query.request('POST',$apiRootCM+'mail/send',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'mail/update',{data: data});
        },
    };
    return MailService;
}]);