'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('decisions',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "name": {
                    "type": "VARCHAR(255)"
                },
                "description": {
                    "type": "VARCHAR(255)"
                },
                "possible_outcomes": {
                    "type": "VARCHAR(255)"
                },
                "responsibility_level": {
                    "type": "VARCHAR(255)"
                },
                "content": {
                    "type": "JSON"
                },
                "userId": {
                    "type": "VARCHAR(255)"
                },
                "cIndex": {
                    "type": "INTEGER"
                },
                "responseType": {
                    "type": "VARCHAR(255)"
                },
                "externalUser": {
                    "type": "JSON"
                },
                "decision_type": {
                    "type": "VARCHAR(255)"
                },
                "response_time": {
                    "type": "VARCHAR(255)"
                },
                "completion_time": {
                    "type": "VARCHAR(255)"
                },
                "status": {
                    "type": "BOOLEAN",
                    "defaultValue": true
                },
                "createdAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "actionPlanId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "action_plans",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "incidentsTeamId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "incidents_teams",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "responseActorId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "backupActorId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "accountableActorId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "users",
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
            return queryInterface.dropTable('decisions');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
