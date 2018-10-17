'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('game_messages',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "name": {
                    "type": "VARCHAR(255)"
                },
                "author": {
                    "type": "VARCHAR(255)"
                },
                "links": {
                    "type": "VARCHAR(255)"
                },
                "context": {
                    "type": "TEXT"
                },
                "type": {
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
                        "model": "game_libraries",
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
            return queryInterface.dropTable('game_messages');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
