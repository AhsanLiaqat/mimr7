'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('locations',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "address1": {
                    "type": "VARCHAR(255)"
                },
                "address2": {
                    "type": "VARCHAR(255)"
                },
                "address3": {
                    "type": "VARCHAR(255)"
                },
                "city": {
                    "type": "VARCHAR(255)"
                },
                "state": {
                    "type": "VARCHAR(255)"
                },
                "country": {
                    "type": "VARCHAR(255)"
                },
                "mobilePhone": {
                    "type": "VARCHAR(255)"
                },
                "officePhone": {
                    "type": "VARCHAR(255)"
                },
                "type": {
                    "type": "VARCHAR(255)"
                },
                "location": {
                    "type": "JSON"
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
            return queryInterface.dropTable('locations');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
