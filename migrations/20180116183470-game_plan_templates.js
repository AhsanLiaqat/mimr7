'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('game_plan_templates',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "plan_activated": {
                    "type": "BOOLEAN",
                    "defaultValue": false
                },
                "selected": {
                    "type": "BOOLEAN",
                    "defaultValue": true
                },
                "scheduled_date": {
                    "type": "VARCHAR(255)"
                },
                "roles": {
                    "type": "JSON"
                },
                "accountId": {
                    "type": "INTEGER"
                },
                "status": {
                    "type": "VARCHAR(255)",
                    "defaultValue": "made"
                },
                "roundId": {
                    "type": "INTEGER",
                    "defaultValue": 0
                },
                "start_time": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "pause_date": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "resume_date": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "play_date": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "createdAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "gamePlanId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "game_plans",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "organizationId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "organizations",
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
            return queryInterface.dropTable('game_plan_templates');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
