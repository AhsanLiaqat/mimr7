'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('user_accounts',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "organizationName": {
                    "type": "VARCHAR(255)"
                },
                "avatar": {
                    "type": "VARCHAR(255)"
                },
                "type": {
                    "type": "VARCHAR(255)"
                },
                "category_header": {
                    "type": "VARCHAR(255)"
                },
                "messages_font_size": {
                    "type": "VARCHAR(255)"
                },
                "messages_font_family": {
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
            return queryInterface.dropTable('user_accounts');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
