'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('users',
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
                "countryCode": {
                    "type": "VARCHAR(255)"
                },
                "locationsId": {
                    "type": "INTEGER"
                },
                "userType": {
                    "type": "VARCHAR(255)"
                },
                "userCountry": {
                    "type": "VARCHAR(255)"
                },
                "latestAlert": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "LastEmailActivation": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "LastUpdatePassword": {
                    "type": "TIMESTAMP WITH TIME ZONE"
                },
                "enabled": {
                    "type": "BOOLEAN",
                    "defaultValue": true
                },
                "available": {
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
            return queryInterface.dropTable('users');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
