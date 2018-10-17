'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('game_roles',
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
                "gamePlanId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "game_plans",
                        "key": "id"
                    },
                    "onDelete": "NO ACTION",
                    "onUpdate": "CASCADE"
                },
                "order": {
                    "type": "INTEGER"
                },
                "gamePlanTeamId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "game_plan_teams",
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
            return queryInterface.dropTable('game_roles');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
