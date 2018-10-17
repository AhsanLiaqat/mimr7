'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('external_users',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "email": {
                    "type": "VARCHAR(255)"
                },
                "avatar": {
                    "type": "VARCHAR(255)"
                },
                "firstName": {
                    "type": "VARCHAR(255)"
                },
                "middleName": {
                    "type": "VARCHAR(255)"
                },
                "lastName": {
                    "type": "VARCHAR(255)"
                },
                "password": {
                    "type": "VARCHAR(255)"
                },
                "role": {
                    "type": "VARCHAR(255)"
                },
                "lastLogin": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "title": {
                    "type": "VARCHAR(255)"
                },
                "officePhone": {
                    "type": "VARCHAR(255)"
                },
                "mobilePhone": {
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
                "organizationId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "organizations",
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
            return queryInterface.dropTable('external_users');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
