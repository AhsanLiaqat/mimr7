'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('plan_activities',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "index": {
                    "type": "INTEGER",
                    "defaultValue": 0
                },
                "tindex": {
                    "type": "INTEGER",
                    "defaultValue": 0
                },
                "default": {
                    "type": "BOOLEAN",
                    "defaultValue": false
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
                    "references": {
                        "model": "action_plans",
                        "key": "id"
                    },
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "allowNull": true
                },
                "activityId": {
                    "type": "UUID",
                    "references": {
                        "model": "activities",
                        "key": "id"
                    },
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "allowNull": true
                },
                "sectionId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "sections",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE",
                    "unique": "plan_activities_sectionId_activityId_unique"
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
            return queryInterface.dropTable('plan_activities');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
