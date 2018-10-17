'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('message_histories',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "content": {
                    "type": Sequelize.TEXT
                },
                "status": {
                    "type": "BOOLEAN"
                },
                "modifiedAt": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "deletedAt": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "owner": {
                    "type": "INTEGER"
                },
                "index": {
                    "type": "INTEGER"
                },
               
                "editorId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "onDelete": "NO ACTION",
                    "onUpdate": "CASCADE"
                },
                "classId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "classes",
                        "key": "id"
                    },
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE"
                },
                "messageId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "messages",
                        "key": "id"
                    },
                    "onDelete": "NO ACTION",
                    "onUpdate": "CASCADE"
                },
                "incidentId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "incidents",
                        "key": "id"
                    },
                    "onDelete": "NO ACTION",
                    "onUpdate": "CASCADE"
                },
                "selectedColor": {
                    "type": "VARCHAR(255)"
                },
                "createdAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "userId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE"
                },
                "subClassId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "sub_classes",
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
            return queryInterface.dropTable('message_histories');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
