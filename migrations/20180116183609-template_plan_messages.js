'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('template_plan_messages',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "setOffTime": {
                    "type": "VARCHAR(255)"
                },
                "index": {
                    "type": "INTEGER",
                    "defaultValue": 0
                },
                "copy": {
                    "type": "BOOLEAN",
                    "defaultValue": true
                },
                "activated": {
                    "type": "BOOLEAN",
                    "defaultValue": false
                },
                "activatedAt": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "status": {
                    "type": "VARCHAR(255)",
                    "defaultValue": "incomplete"
                },
                "statusAt": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "gamePlanTemplateId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "game_plan_templates",
                        "key": "id"
                    },
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE"
                },
                "offset": {
                    "type": "INTEGER",
                    "defaultValue": 0
                },
                "gameMessageId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "game_messages",
                        "key": "id"
                    },
                    "onDelete": "NO ACTION",
                    "onUpdate": "CASCADE"
                },
                "timeleft": {
                    "type": "INTEGER"
                },
                "createdAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "assignedGameMessageId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "assigned_game_messages",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "userAccountId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "user_accounts",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
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
            return queryInterface.dropTable('template_plan_messages');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
