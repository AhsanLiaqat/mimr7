'use strict'
var Sequelize =  require("sequelize");
//staging
// const db_to = new Sequelize(
//     'EU-Ireland-copy-Salman',
//     'crisiushub',
//     'eoW3Zo0eedoo1poh8Eachoong4yai6aeXieGhai9', {
//         host: 'crisishub.cacnaufvjocy.us-east-1.rds.amazonaws.com',
//         dialect: 'postgres',
//     }
// );
//local
// const db = new Sequelize(
//     'crisis-hub',
//     'ahsan',
//     'root', {
//         host: 'localhost',
//         dialect: 'postgres',
//     }
// );
//EU
// const db = new Sequelize(
//     'EU-Ireland-copy-Salman',
//     'crisiushub',
//     'eoW3Zo0eedoo1poh8Eachoong4yai6aeXieGhai9', {
//         host: 'ch-0303.caukb9pvvycq.eu-west-1.rds.amazonaws.com',
//         dialect: 'postgres',
//     }
// );
//dev1
const db = new Sequelize(
    'crisishubs',
    'crisiushub',
    'eoW3Zo0eedoo1poh8Eachoong4yai6aeXieGhai9', {
        host: 'crisishubv2.cacnaufvjocy.us-east-1.rds.amazonaws.com',
        dialect: 'postgres',
    }
);

db.query('SELECT id,content FROM "message_histories"').spread((response, metadata) => {
	if(response.length>0){
		response.forEach(function (item,indxx) {
			console.log('---------------',item);
			var query2 = "UPDATE message_histories SET content_new='"+item.content+"' WHERE id = '"+item.id+"'";
			db.query(query2).spread((response, metadata) => {
			});
		});
	}
});
