'use strict'
var Sequelize =  require("sequelize");

// const db_to = new Sequelize(
//     'EU-Ireland-copy-Salman',
//     'crisiushub',
//     'eoW3Zo0eedoo1poh8Eachoong4yai6aeXieGhai9', {
//         host: 'crisishub.cacnaufvjocy.us-east-1.rds.amazonaws.com',
//         dialect: 'postgres',
//     }
// );
// const db = new Sequelize(
//     'crisis-hub',
//     'ahsan',
//     'root', {
//         host: 'localhost',
//         dialect: 'postgres',
//     }
// );
const db = new Sequelize(
    'EU-Ireland-copy-Salman',
    'crisiushub',
    'eoW3Zo0eedoo1poh8Eachoong4yai6aeXieGhai9', {
        host: 'ch-0303.caukb9pvvycq.eu-west-1.rds.amazonaws.com',
        dialect: 'postgres',
    }
);

db.query('SELECT * from "user_accounts"').spread((response, metadata) => {
	if(response.length>0){
		response.forEach(function (item,indxx) {
			var id1 = '23bc77ed-ba2f-4f38-0000-' + item.id.substr(item.id.length - 6) + '684925'
			var id2 = '23bc77ed-ba2f-4f38-0000-' + '684925' + item.id.substr(item.id.length - 6) 
			var query1 = 'INSERT INTO "custom_messages" ("id", "subject", "content", "msgType", "msgTemplateType", "createdAt", "updatedAt", "userAccountId" , "isDeleted") '+"VALUES ('"+id1+"', 'Attentie!', '', 'Summary Report','Header','2018-04-16 16:20:46.331+05','2018-04-16 16:20:46.331+05', '"+item.id+"', false);";
			var query2 = 'INSERT INTO "custom_messages" ("id", "subject", "content", "msgType", "msgTemplateType", "createdAt", "updatedAt", "userAccountId" , "isDeleted") '+"VALUES ('"+id2+"', 'Attentie!', '', 'Summary Report','Footer','2018-04-16 16:20:46.331+05','2018-04-16 16:20:46.331+05', '"+item.id+"', false);";
			
			db.query(query1).spread((response, metadata) => {
			});
			db.query(query2).spread((response, metadata) => {
			});
		});
	}
});
