'use strict'
var Sequelize =  require("sequelize");
var models = require('./server/models/');
var fs =  require("fs");
var async = require("async");
delete models.default;

const db_from = new Sequelize(
    'crisishubs',
    'crisiushub',
    'eoW3Zo0eedoo1poh8Eachoong4yai6aeXieGhai9', {
        host: 'crisishubv2.cacnaufvjocy.us-east-1.rds.amazonaws.com',
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
// const db_to = new Sequelize(
//     'crisis_recursion',
//     'saaad',
//     'root', {
//         host: 'localhost',
//         dialect: 'postgres',
//     }
// );

function getUUID(id){
	return id;
	// return "23bc77ed-ba2f-4f38-0000-"+("000000000000" + id.toString(16)).slice(-12)
}
function genQuery(table, obj, fankar){
	var keys = Object.keys(obj)
	var str = 'INSERT INTO "'+table+'" ( ';
	var values = "VALUES ( ";
	var str_keys = "";
	var str_vals = "";
	keys.forEach(function (key,ind) {
		if(obj[key] && (table.third == false || (table.third == true && obj[key] != 'id'))){
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
	return str+str_keys+values+str_vals ;
}
var tables = [
	{  third: false,	from: 'user_accounts'							, to: 'user_accounts'						, ids : ['id'] },
	
	{  third: false,	from: 'categories'								, to: 'categories'							, ids : ['id','userAccountId'] },

	// {  third: false,	from: 'scenarios'								, to: 'scenarios'							, ids : ['id','userAccountId','categoryId'] },
	{  third: false,	from: 'organizations'							, to: 'organizations'						, ids : ['id','userAccountId'] },
	{  third: false,	from: 'departments'								, to: 'departments'							, ids : ['id','userAccountId'] },

	{  third: false,	from: 'users'									, to: 'users'								, ids : ['id','userAccountId','departmentId','organizationId'] },

	{  third: false,	from: 'library_references'						, to: 'library_references'					, ids : ['id','userAccountId','userId'] },
	{  third: false,	from: 'all_categories'							, to: 'all_categories'						, ids : ['id','userAccountId'] },

	{  third: false,	from: 'task_lists'								, to: 'task_lists'							, ids : ['id','userAccountId','departmentId','libId','categoryId'] },
	{  third: false,	from: 'roles'									, to: 'roles'								, ids : ['id','userAccountId'] },
	{  third: false,	from: 'game_categories'							, to: 'game_categories'						, ids : ['id','userAccountId'] },

	{  third: false,	from: 'game_plans'								, to: 'game_plans'							, ids : ['id','userAccountId','gameCategoryId'] },
	
	{  third: false,	from: 'game_libraries'							, to: 'game_libraries'						, ids : ['id','userAccountId','gamePlanId'] },

	{  third: false,	from: 'game_messages'							, to: 'game_messages'						, ids : ['id','userAccountId','gamePlanId','libId'] },
	{  third: false,	from: 'incidents_teams'							, to: 'incidents_teams'						, ids : ['id','userAccountId'] },
	{  third: false,	from: 'incidents'								, to: 'incidents'							, ids : ['id','userAccountId','categoryId','incidentsTeamId','reporterId'] },
	{  third: false,	from: 'status_reports'							, to: 'status_reports'						, ids : ['id','userAccountId','incidentId','userId'] },
	{  third: false,	from: 'game_plan_templates'						, to: 'game_plan_templates'					, ids : ['id','userAccountId','gamePlanId','organizationId'] },
	{  third: false,	from: 'action_plans'							, to: 'action_plans'						, ids : ['id','userAccountId','scenarioId','categoryId'] },
	{  third: false,	from: 'sections'								, to: 'sections'							, ids : ['id','userAccountId','actionPlanId'] },
	{  third: false,	from: 'activities'								, to: 'activities'							, ids : ['id','userAccountId','departmentId','roleId','organizationId','responseActorId','backupActorId','accountableActorId','taskListId'] },
	{  third: false,	from: 'plan_activities'							, to: 'plan_activities'						, ids : ['id','userAccountId','actionPlanId','activityId','sectionId'] },
	{  third: false,	from: 'incident_plans'							, to: 'incident_plans'						, ids : ['id','userAccountId','actionPlanId','incidentId'] },
	{  third: false,	from: 'checkLists'								, to: 'checkLists'							, ids : ['id','userAccountId','allCategoryId'] },
	{  third: false,	from: 'incident_checkLists'						, to: 'incident_checkLists'					, ids : ['id','userAccountId','incidentId','checkListId'] },
	{  third: false,	from: 'classes'									, to: 'classes'								, ids : ['id','userAccountId','incidentId'] },
	{  third: false,	from: 'sub_classes'								, to: 'sub_classes'							, ids : ['id','userAccountId','classId'] },
	{  third: false,	from: 'messages'								, to: 'messages'							, ids : ['id','userAccountId','userId','incidentId'] },
	{  third: false,	from: 'actions'									, to: 'actions'								, ids : ['id','userAccountId','actionPlanId','taskListId','responseActorId','departmentId'] },
	{  third: false,	from: 'alert_histories'							, to: 'alert_histories'						, ids : ['id','userAccountId','userId'] },
	{  third: false,	from: 'assigned_game_messages'					, to: 'assigned_game_messages'				, ids : ['id','userAccountId','responseActorId','gameMessageId'] },
	{  third: false,	from: 'capacities'								, to: 'capacities'							, ids : ['id','userAccountId'] },
	{  third: false,	from: 'color_palettes'							, to: 'color_palettes'						, ids : ['id','userAccountId'] },
	{  third: false,	from: 'custom_messages'							, to: 'custom_messages'						, ids : ['id','userAccountId'] },
	{  third: false,	from: 'decisions'								, to: 'decisions'							, ids : ['id','userAccountId','actionPlanId','incidentsTeamId','responseActorId','backupActorId','accountableActorId'] },
	{  third: false,	from: 'default_categories'						, to: 'default_categories'					, ids : ['id','userAccountId','categoryId'] },
	{  third: false,	from: 'devices'									, to: 'devices'								, ids : ['id','userAccountId','userId'] },
	// {  third: false,	from: 'dynamic_forms'							, to: 'dynamic_forms'						, ids : ['id','userAccountId'] },
	{  third: false,	from: 'email_trackings'							, to: 'email_trackings'						, ids : ['id','userAccountId','userId','statusReportId'] },
	{  third: false,	from: 'external_users'							, to: 'external_users'						, ids : ['id','userAccountId','organizationId'] },
	{  third: false,	from: 'game_plan_teams'							, to: 'game_plan_teams'						, ids : ['id','userAccountId','gamePlanId'] },
	{  third: false,	from: 'game_plan_template_rounds'				, to: 'game_plan_template_rounds'			, ids : ['id','userAccountId','gamePlanTemplateId'] },
	{  third: false,	from: 'game_player_lists'						, to: 'game_player_lists'					, ids : ['id','userAccountId'] },
	{  third: false,	from: 'game_players'							, to: 'game_players'						, ids : ['id','userAccountId','userId'] },
	{  third: false,	from: 'game_roles'								, to: 'game_roles'							, ids : ['id','userAccountId','gamePlanId','gamePlanTeamId'] },
	{  third: false,	from: 'game_template_roles'						, to: 'game_template_roles'					, ids : ['id','userAccountId','gameRoleId','userId','gamePlanTemplateId'] },
	// {  third: false,	from: 'ID_games'								, to: 'id_games'							, ids : ['id','userAccountId'] },
	
	{  third: false,	from: 'incident_activities'						, to: 'incident_activities'					, ids : ['id','userAccountId','action_plan_id','activity_id','departmentId','roleId','organizationId','responseActorId','backupActorId','accountableActorId','taskListId','incident_plan_id','incident_id','planActivityId','sectionId'] },
	{  third: false,	from: 'incident_checkList_copies'				, to: 'incident_checkList_copies'			, ids : ['id','userAccountId','taskId','incident_checkListId'] },
	{  third: false,	from: 'incident_outcomes'						, to: 'incident_outcomes'					, ids : ['id','userAccountId','decision_activity_id','outcome_activity_id'] },
	{  third: false,	from: 'incident_shapes'							, to: 'incident_shapes'						, ids : ['id','userAccountId','incidentId'] },
	{  third: false,	from: 'locations'								, to: 'locations'							, ids : ['id','userAccountId'] },
	{  third: false,	from: 'map_images'								, to: 'map_images'							, ids : ['id','userAccountId','incidentId'] },
	{  third: false,	from: 'message_histories'						, to: 'message_histories'					, ids : ['id','userAccountId','editorId','classId','messageId','incidentId','userId','subClassId'] },
	{  third: false,	from: 'outcomes'								, to: 'outcomes'							, ids : ['id','userAccountId','decision_activity_id','outcome_activity_id'] },
	{  third: false,	from: 'places'									, to: 'places'								, ids : ['id','userAccountId'] },
	{  third: false,	from: 'tags'									, to: 'tags'								, ids : ['id','userAccountId'] },
	{  third: false,	from: 'template_plan_messages'					, to: 'template_plan_messages'				, ids : ['id','userAccountId','gamePlanTemplateId','gameMessageId','assignedGameMessageId'] },

	{  third: true,		from: 'activity_tasks'							, to: 'activity_tasks'						, ids : ['userAccountId','activityId','taskListId'] },
	{  third: true,		from: 'assigned_game_message_roles'				, to: 'assigned_game_message_roles'			, ids : ['userAccountId','assignedGameMessageId','gameRoleId'] },
	{  third: true,		from: 'check_list_tasks'						, to: 'check_list_tasks'					, ids : ['userAccountId','taskId','checkListId'] },
	{  third: true,		from: 'game_player_list_players'				, to: 'game_player_list_players'			, ids : ['userAccountId','gamePlayerId','gamePlayerListId'] },
	{  third: true,		from: 'incident_locations'						, to: 'incident_locations'					, ids : ['userAccountId','incidentId','placeId'] },
	{  third: true,		from: 'incident_types_checklists'				, to: 'incident_types_checklists'			, ids : ['userAccountId','categoryId','checkListId'] },
	{  third: true,		from: 'incident_types_default_categories'		, to: 'incident_types_default_categories'	, ids : ['userAccountId','categoryId','defaultCategoryId'] },
	{  third: true,		from: 'task_tags'								, to: 'task_tags'							, ids : ['userAccountId','taskId','tagId'] },
	{  third: true,		from: 'user_colors'								, to: 'user_colors'							, ids : ['userAccountId','userId','colorPaletteId'] },
	{  third: true,		from: 'user_logs'								, to: 'user_logs'							, ids : ['userAccountId','userId'] },
	{  third: true,		from: 'user_roles'								, to: 'user_roles'							, ids : ['userAccountId','roleId','userId'] },
	{  third: true,		from: 'user_teams'								, to: 'user_teams'							, ids : ['userAccountId','incidentsTeamId','userId'] }

]

function oneTable(id){
	console.log('----------------------------------------',id);
	if(id < tables.length){
		var table = tables[id];
		var where_clause = (id == 0)? 'id' : 'userAccountId';
	 	db_from.query('SELECT * from "'+table.from+'"').spread((response, metadata) => {
	 		if(response.length > 0){
	 			var stream = fs.createWriteStream("./Query_Scripts/"+id+"-"+table.to+".txt");
				stream.once('open', function(fd) {
		 			var count = 0;
			        response.forEach(function (item,indxx) {
			        	if(item[where_clause] == 'd5370137-455e-4915-99ab-c98953b469cd'){
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
			        	}else{
			        		if(indxx == response.length - 1){
				    			oneTable(id + 1);
				    		}else{
				    			count++;
				    			console.log('_>_>__>_>_>_>',table.from,'_<_<_ _', count);
				    		}
			        	}

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


// SELECT setval(pg_get_serial_sequence('activity_tasks', 'id'), MAX(id)) FROM activity_tasks;
// SELECT setval(pg_get_serial_sequence('assigned_game_message_roles', 'id'), MAX(id)) FROM assigned_game_message_roles;
// SELECT setval(pg_get_serial_sequence('check_list_tasks', 'id'), MAX(id)) FROM check_list_tasks;
// SELECT setval(pg_get_serial_sequence('game_player_list_players', 'id'), MAX(id)) FROM game_player_list_players;
// SELECT setval(pg_get_serial_sequence('incident_locations', 'id'), MAX(id)) FROM incident_locations;
// SELECT setval(pg_get_serial_sequence('incident_types_checklists', 'id'), MAX(id)) FROM incident_types_checklists;
// SELECT setval(pg_get_serial_sequence('incident_types_default_categories', 'id'), MAX(id)) FROM incident_types_default_categories;
// SELECT setval(pg_get_serial_sequence('task_tags', 'id'), MAX(id)) FROM task_tags;
// SELECT setval(pg_get_serial_sequence('user_colors', 'id'), MAX(id)) FROM user_colors;
// SELECT setval(pg_get_serial_sequence('user_logs', 'id'), MAX(id)) FROM user_logs;
// SELECT setval(pg_get_serial_sequence('user_roles', 'id'), MAX(id)) FROM user_roles;
// SELECT setval(pg_get_serial_sequence('user_teams', 'id'), MAX(id)) FROM user_teams;



