'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('game_players',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "firstName": {
                    "type": "VARCHAR(255)"
                },
                "lastName": {
                    "type": "VARCHAR(255)"
                },
                "organizationName": {
                    "type": "VARCHAR(255)"
                },
                "email": {
                    "type": "VARCHAR(255)"
                },
                "mobilePhone": {
                    "type": "VARCHAR(255)"
                },
                "country": {
                    "type": "VARCHAR(255)"
                },
                "active": {
                    "type": "BOOLEAN"
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
                "userAccountId": {
                    "type": "UUID",
                    "allowNull": true,
                    "references": {
                        "model": "user_accounts",
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
            return queryInterface.dropTable('game_players');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
