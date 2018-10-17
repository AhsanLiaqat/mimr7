var SOCKET = io(location.origin);
var AppConstant = {
	ACTION_PLAN_TABLE_NAME : "Action Plan",
	INCIDENT_TABLE_NAME : "Incident",
	SIMULATION_TABLE_NAME : "Simulation",
    DELETE_ERROR_MSG : "Some data has dependancy on this, So it can't be DELETE",
    GENERAL_ERROR_MSG : "Whoops! Something went wrong.",
    DELETE_SUCCESS_MSG : "Deleted successfully!"
}
var LOAD_COUNTER = 0



// $provide.value("$apiRootSettings","/settings/");
// $provide.value("$apiRootCM","/");
// $provide.value("$apiRootSM","/simulation/");
