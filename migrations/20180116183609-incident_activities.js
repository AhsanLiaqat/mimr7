'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('incident_activities',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "type": {
                    "type": "VARCHAR(255)"
                },
                "name": {
                    "type": "VARCHAR(255)"
                },
                "description": {
                    "type": "VARCHAR(255)"
                },
                "responsibility_level": {
                    "type": "VARCHAR(255)"
                },
                "response_time": {
                    "type": Sequelize.INTEGER
                },
                "completion_time": {
                    "type": Sequelize.INTEGER
                },
                "default": {
                    "type": "BOOLEAN",
                    "defaultValue": false
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
                "statusAt": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "status": {
                    "type": "VARCHAR(255)",
                    "defaultValue": "incomplete"
                },
                "index": {
                    "type": "INTEGER",
                    "defaultValue": 0
                },
                "tindex": {
                    "type": "INTEGER",
                    "defaultValue": 0
                },
                "createdAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "action_plan_id": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "action_plans",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "activity_id": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "activities",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "departmentId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "departments",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "roleId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "roles",
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
                },
                "taskListId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "task_lists",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "incident_plan_id": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "incident_plans",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "incident_id": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "incidents",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "planActivityId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "plan_activities",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "sectionId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "sections",
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
            return queryInterface.dropTable('incident_activities');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
