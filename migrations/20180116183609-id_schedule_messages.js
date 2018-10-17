'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('id_schedule_messages',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "message": {
                    "type": "VARCHAR(255)"
                },
                "order": {
                    "type": "INTEGER"
                },
                "activated": {
                    "type": "BOOLEAN",
                    "defaultValue": false
                },
                "offset": {
                    "type": "INTEGER"
                },
                "setOffTime": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "activated_At": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "idScheduleGameId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "id_schedule_games",
                        "key": "id"
                    },
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE"
                },
                "idMessageId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "id_messages",
                        "key": "id"
                    },
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE"
                },
                "userId": {
                    "type": "INTEGER"
                },
                "userAccountId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "user_accounts",
                        "key": "id"
                    },
                    "onDelete": "NO ACTION",
                    "onUpdate": "CASCADE"
                },
                "createdAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                }
            })
        })

        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.dropTable('id_schedule_messages');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
