angular.module('app').factory('PlanActivityService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var PlanActivityService = {
        getActivities : function (actionPlanId) {
            return Query.request('GET',$apiRootCM+'plan-activities/get-activities?actionPlanId=' + actionPlanId,{});
        },
        updateIndex : function (data) {
            return Query.request('POST',$apiRootCM+'plan-activities/update-index',data);
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'plan-activities/update',data);
        },
        updateIndexSection : function (data) {
            return Query.request('POST',$apiRootCM+'plan-activities/update-index-section',data);
        },
        getDefaultStatus : function (id) {
            return Query.request('GET',$apiRootCM+'plan-activities/get-default-status',{});
        },
        removeActivity : function (data) {
            return Query.request('POST',$apiRootCM+'plan-activities/remove-activity',data);
        },
        updateDefault : function (data) {
            return Query.request('POST',$apiRootCM+'plan-activities/update-default',data);
        },
        addCopiedActivities : function (data) {
            return Query.request('POST',$apiRootCM+'plan-activities/add-copied-activities',data);
        },
    };
    return PlanActivityService;
}]);