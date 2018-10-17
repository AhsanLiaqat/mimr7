'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('game_plan_template_rounds',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "name": {
                    "type": "VARCHAR(255)"
                },
                "timeSpan": {
                    "type": "INTEGER"
                },
                "messageIndex": {
                    "type": "INTEGER"
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
                "status": {
                    "type": "BOOLEAN",
                    "defaultValue": false
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
            return queryInterface.dropTable('game_plan_template_rounds');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
