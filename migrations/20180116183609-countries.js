'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('countries',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                "name": {
                    "type": "VARCHAR(255)"
                },
                "iso": {
                    "type": "VARCHAR(255)"
                },
                "iso3": {
                    "type": "VARCHAR(255)"
                },
                "nicename": {
                    "type": "VARCHAR(255)"
                },
                "numcode": {
                    "type": "INTEGER"
                },
                "phonecode": {
                    "type": "INTEGER"
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
            return queryInterface.dropTable('countries');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
