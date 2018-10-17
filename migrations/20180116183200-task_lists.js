'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('task_lists',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "title": {
                    "type": "VARCHAR(255)"
                },
                "author": {
                    "type": "VARCHAR(255)"
                },
                "description": {
                    "type": "VARCHAR(255)"
                },
                "links": {
                    "type": "VARCHAR(255)"
                },
                "filename": {
                    "type": "VARCHAR(255)"
                },
                "type": {
                    "type": "VARCHAR(255)"
                },
                "categoryId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "all_categories",
                        "key": "id"
                    },
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE"
                },
                "dateOfUpload": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "for_template": {
                    "type": "BOOLEAN"
                },
                "createdAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": "TIMESTAMP WITH TIME ZONE",
                    "allowNull": false
                },
                "libId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "library_references",
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
                "departmentId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "departments",
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
            return queryInterface.dropTable('task_lists');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
