'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('capacities',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "assets": {
                    "type": "VARCHAR(255)"
                },
                "description": {
                    "type": "VARCHAR(255)"
                },
                "max": {
                    "type": "INTEGER"
                },
                "availableOnRequest": {
                    "type": "VARCHAR(255)"
                },
                "available": {
                    "type": "BOOLEAN"
                },
                "additionalInfo": {
                    "type": "VARCHAR(255)"
                },
                "used": {
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
            return queryInterface.dropTable('capacities');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
