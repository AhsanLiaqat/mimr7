'use strict'
var Sequelize =  require("sequelize");
var models = require('./server/models/');
var fs =  require("fs");
var async = require("async");
delete models.default;

// const db_from = new Sequelize(
//     'crisishubs',
//     'crisiushub',
//     'eoW3Zo0eedoo1poh8Eachoong4yai6aeXieGhai9', {
//         host: 'crisishub-eu-ireland-copied.cacnaufvjocy.us-east-1.rds.amazonaws.com',
//         dialect: 'postgres',
//     }
// );
// const db_to = new Sequelize(
//     'EU-Ireland-copy',
//     'crisiushub',
//     'eoW3Zo0eedoo1poh8Eachoong4yai6aeXieGhai9', {
//         host: 'crisishub.cacnaufvjocy.us-east-1.rds.amazonaws.com',
//         dialect: 'postgres',
//     }
// );
const db_from = new Sequelize(
    'crisishubs',
    'crisiushub',
    'eoW3Zo0eedoo1poh8Eachoong4yai6aeXieGhai9', {
        host: 'crisishub-eu-1-3-2018-migrated-salman.cacnaufvjocy.us-east-1.rds.amazonaws.com',
        dialect: 'postgres',
    }
);
const db_to = new Sequelize(
    'EU-Ireland-copy-Salman',
    'crisiushub',
    'eoW3Zo0eedoo1poh8Eachoong4yai6aeXieGhai9', {
        host: 'crisishub.cacnaufvjocy.us-east-1.rds.amazonaws.com',
        dialect: 'postgres',
    }
);

function getUUID(id){
	return "23bc77ed-ba2f-4f38-8581-"+("000000000000" + id.toString(16)).slice(-12)
}
function genQuery(table, obj, fankar){
	var keys = Object.keys(obj)
	var str = 'INSERT INTO "'+table+'" ( ';
	var values = "VALUES ( ";
	var str_keys = "";
	var str_vals = "";
	keys.forEach(function (key,ind) {
		if(obj[key]){
			if(str_keys != ""){
				str_keys += ", ";
				str_vals += ", ";
			}
			str_keys += '"' + key + '"';
			if(-1 != fankar.indexOf(key) ){
				str_vals += "'" + getUUID(obj[key]) + "'";
			}else{
				str_vals += "'";
				if(obj[key].constructor.name == 'Date'){
					str_vals += obj[key].toISOString();
				}else if (obj[key].constructor.name == 'Array' || obj[key].constructor.name == 'Object'){
					str_vals += JSON.stringify(obj[key]);
				}else{
					if( obj[key].constructor.name == "String" && obj[key].indexOf("'") >= 0){
						obj[key] = obj[key].replace(/'/g,"''");
					}
					str_vals += obj[key];
				}
				str_vals += "'";
			}
		}
	});
	str_keys += " ) "
	str_vals += " ) "
	return str+str_keys+values+str_vals;
}
var tables = [
	{  from: 'user_accounts'							, to: 'user_accounts'						, ids : ['id'] },
	{  from: 'categories'								, to: 'categories'							, ids : ['id','userAccountId'] },
	// {  from: 'scenarios'								, to: 'scenarios'							, ids : ['id','userAccountId','categoryId'] },
	{  from: 'organizations'							, to: 'organizations'						, ids : ['id','userAccountId'] },
	{  from: 'departments'								, to: 'departments'							, ids : ['id','userAccountId'] },
	{  from: 'users'									, to: 'users'								, ids : ['id','userAccountId','departmentId','organizationId'] },
	{  from: 'library_references'						, to: 'library_references'					, ids : ['id','userAccountId','userId'] },
	{  from: 'all_categories'							, to: 'all_categories'						, ids : ['id','userAccountId'] },
	{  from: 'task_lists'								, to: 'task_lists'							, ids : ['id','userAccountId','departmentId','libId','categoryId'] },
	{  from: 'roles'									, to: 'roles'								, ids : ['id','userAccountId'] },
	{  from: 'game_categories'							, to: 'game_categories'						, ids : ['id','userAccountId'] },
	{  from: 'game_plans'								, to: 'game_plans'							, ids : ['id','userAccountId','gameCategoryId'] },
	{  from: 'game_libraries'							, to: 'game_libraries'						, ids : ['id','userAccountId','gamePlanId'] },
	{  from: 'game_messages'							, to: 'game_messages'						, ids : ['id','userAccountId','gamePlanId','libId'] },
	{  from: 'incidents_teams'							, to: 'incidents_teams'						, ids : ['id','userAccountId'] },
	{  from: 'incidents'								, to: 'incidents'							, ids : ['id','userAccountId','categoryId','incidentsTeamId','reporterId'] },
	{  from: 'status_reports'							, to: 'status_reports'						, ids : ['id','userAccountId','incidentId','userId'] },
	{  from: 'game_plan_templates'						, to: 'game_plan_templates'					, ids : ['id','userAccountId','gamePlanId','organizationId'] },
	{  from: 'action_plans'								, to: 'action_plans'						, ids : ['id','userAccountId','scenarioId','categoryId'] },
	{  from: 'sections'									, to: 'sections'							, ids : ['id','userAccountId','actionPlanId'] },
	{  from: 'activities'								, to: 'activities'							, ids : ['id','userAccountId','departmentId','roleId','organizationId','responseActorId','backupActorId','accountableActorId','taskListId'] },
	{  from: 'plan_activities'							, to: 'plan_activities'						, ids : ['id','userAccountId','actionPlanId','activityId','sectionId'] },
	{  from: 'incident_plans'							, to: 'incident_plans'						, ids : ['id','userAccountId','actionPlanId','incidentId'] },
	{  from: 'checkLists'								, to: 'checkLists'							, ids : ['id','userAccountId','allCategoryId'] },
	{  from: 'incident_checkLists'						, to: 'incident_checkLists'					, ids : ['id','userAccountId','incidentId','checkListId'] },
	{  from: 'classes'									, to: 'classes'								, ids : ['id','userAccountId','incidentId'] },
	{  from: 'sub_classes'								, to: 'sub_classes'							, ids : ['id','userAccountId','classId'] },
	{  from: 'messages'									, to: 'messages'							, ids : ['id','userAccountId','userId','incidentId'] },
	{  from: 'actions'									, to: 'actions'								, ids : ['id','userAccountId','actionPlanId','taskListId','responseActorId','departmentId'] },
	{  from: 'alert_histories'							, to: 'alert_histories'						, ids : ['id','userAccountId','userId'] },
	{  from: 'assigned_game_messages'					, to: 'assigned_game_messages'				, ids : ['id','userAccountId','responseActorId','gameMessageId'] },
	{  from: 'capacities'								, to: 'capacities'							, ids : ['id','userAccountId'] },
	{  from: 'color_palettes'							, to: 'color_palettes'						, ids : ['id','userAccountId'] },
	{  from: 'custom_messages'							, to: 'custom_messages'						, ids : ['id','userAccountId'] },
	{  from: 'decisions'								, to: 'decisions'							, ids : ['id','userAccountId','actionPlanId','incidentsTeamId','responseActorId','backupActorId','accountableActorId'] },
	{  from: 'default_categories'						, to: 'default_categories'					, ids : ['id','userAccountId','categoryId'] },
	{  from: 'devices'									, to: 'devices'								, ids : ['id','userAccountId','userId'] },
	// {  from: 'dynamic_forms'							, to: 'dynamic_forms'						, ids : ['id','userAccountId'] },
	{  from: 'email_trackings'							, to: 'email_trackings'						, ids : ['id','userAccountId','userId','statusReportId'] },
	{  from: 'external_users'							, to: 'external_users'						, ids : ['id','userAccountId','organizationId'] },
	{  from: 'game_plan_teams'							, to: 'game_plan_teams'						, ids : ['id','userAccountId','gamePlanId'] },
	{  from: 'game_plan_template_rounds'				, to: 'game_plan_template_rounds'			, ids : ['id','userAccountId','gamePlanTemplateId'] },
	{  from: 'game_player_lists'						, to: 'game_player_lists'					, ids : ['id','userAccountId'] },
	{  from: 'game_players'								, to: 'game_players'						, ids : ['id','userAccountId','userId'] },
	{  from: 'game_roles'								, to: 'game_roles'							, ids : ['id','userAccountId','gamePlanId','gamePlanTeamId'] },
	{  from: 'game_template_roles'						, to: 'game_template_roles'					, ids : ['id','userAccountId','gameRoleId','userId','gamePlanTemplateId'] },
	// {  from: 'ID_games'									, to: 'id_games'							, ids : ['id','userAccountId'] },
	{  from: 'incident_activities'						, to: 'incident_activities'					, ids : ['id','userAccountId','action_plan_id','activity_id','departmentId','roleId','organizationId','responseActorId','backupActorId','accountableActorId','taskListId','incident_plan_id','incident_id','planActivityId','sectionId'] },
	{  from: 'incident_checkList_copies'				, to: 'incident_checkList_copies'			, ids : ['id','userAccountId','taskId','incident_checkListId'] },
	{  from: 'incident_outcomes'						, to: 'incident_outcomes'					, ids : ['id','userAccountId','decision_activity_id','outcome_activity_id'] },
	{  from: 'incident_shapes'							, to: 'incident_shapes'						, ids : ['id','userAccountId','incidentId'] },
	{  from: 'locations'								, to: 'locations'							, ids : ['id','userAccountId'] },
	{  from: 'map_images'								, to: 'map_images'							, ids : ['id','userAccountId','incidentId'] },
	{  from: 'message_histories'						, to: 'message_histories'					, ids : ['id','userAccountId','editorId','classId','messageId','incidentId','userId','subClassId'] },
	{  from: 'outcomes'									, to: 'outcomes'							, ids : ['id','userAccountId','decision_activity_id','outcome_activity_id'] },
	{  from: 'places'									, to: 'places'								, ids : ['id','userAccountId'] },
	{  from: 'tags'										, to: 'tags'								, ids : ['id','userAccountId'] },
	{  from: 'template_plan_messages'					, to: 'template_plan_messages'				, ids : ['id','userAccountId','gamePlanTemplateId','gameMessageId','assignedGameMessageId'] },
	{  from: 'activity_tasks'							, to: 'activity_tasks'						, ids : ['userAccountId','activityId','taskListId'] },
	{  from: 'assigned_game_message_roles'				, to: 'assigned_game_message_roles'			, ids : ['userAccountId','assignedGameMessageId','gameRoleId'] },
	{  from: 'check_list_tasks'							, to: 'check_list_tasks'					, ids : ['userAccountId','taskId','checkListId'] },
	{  from: 'game_player_list_players'					, to: 'game_player_list_players'			, ids : ['userAccountId','gamePlayerId','gamePlayerListId'] },
	{  from: 'incident_locations'						, to: 'incident_locations'					, ids : ['userAccountId','incidentId','placeId'] },
	{  from: 'incident_types_checklists'				, to: 'incident_types_checklists'			, ids : ['userAccountId','categoryId','checkListId'] },
	{  from: 'incident_types_default_categories'		, to: 'incident_types_default_categories'	, ids : ['userAccountId','categoryId','defaultCategoryId'] },
	{  from: 'task_tags'								, to: 'task_tags'							, ids : ['userAccountId','taskId','tagId'] },
	{  from: 'user_colors'								, to: 'user_colors'							, ids : ['userAccountId','userId','colorPaletteId'] },
	{  from: 'user_logs'								, to: 'user_logs'							, ids : ['userAccountId','userId'] },
	{  from: 'user_roles'								, to: 'user_roles'							, ids : ['userAccountId','roleId','userId'] },
	{  from: 'user_teams'								, to: 'user_teams'							, ids : ['userAccountId','incidentsTeamId','userId'] }

]

function oneTable(id){
	console.log('----------------------------------------',id);
	if(id < tables.length){
		var table = tables[id];
	 	db_from.query('SELECT * from "'+table.from+'"').spread((response, metadata) => {
	 		if(response.length > 0){
	 			var stream = fs.createWriteStream("./Query_Scripts/"+id+"-"+table.to+".txt");
				stream.once('open', function(fd) {
		 			var count = 0;
			        response.forEach(function (item,indxx) {
			        	var querystring = genQuery(table.to, item,table.ids);
						stream.write(querystring+"\n");
						console.log('->>>>>>>>>>>>>>>>>>>>>>',table.from,' index ',indxx,' data length ',response.length);
				    	db_to.query(querystring).spread((resp, metadata) => {
				    		console.log(resp,metadata);

						}).then(function(resp){
							if(indxx == response.length - 1){
								stream.end();
				    			oneTable(id + 1);
				    		}else{
				    			count++;
				    			console.log('_>_>__>_>_>_>',table.from,'_<_<_ _', count);
				    		}
							console.log('Success',resp);
						},function(err){
							if(indxx == response.length - 1){
								stream.end();
				    			oneTable(id + 1);
				    		}else{
				    			count++;
				    			console.log('_>_>__>_>_>_>',table.from,'_<_<_ _', count);
				    		}
							console.log('Error',err.message);
						})
				    });
				});

	 		}else{
				console.log('->>>>>----------->>>>>>>>>>No data for', table.from);
	 			oneTable(id + 1);
	 		}

		})
	}else{
		console.log('All table done',tables.length);
	}
}


		oneTable(0)
