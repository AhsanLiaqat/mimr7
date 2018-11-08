'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('locations',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDv4
                },
                address1: {
                    type: Sequelize.STRING
                },
                address2: {
                    type: Sequelize.STRING
                },
                address3: {
                    type: Sequelize.STRING
                },
                city: {
                    type: Sequelize.STRING
                },
                state: {
                    type: Sequelize.STRING
                },
                country: {
                    type: Sequelize.STRING
                },
                mobilePhone: {
                    type: Sequelize.STRING
                },
                officePhone: {
                    type: Sequelize.STRING
                },
                type: {
                    type: Sequelize.STRING
                },
                location: {
                    type: Sequelize.JSON
                },
                createdAt: {
                    type: "TIMESTAMP WITH TIME ZONE",
                    allowNull: false
                },
                updatedAt: {
                    type: "TIMESTAMP WITH TIME ZONE",
                    allowNull: false
                },
                isDeleted : {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                userAccountId: {
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: "user_accounts",
                        key: "id"
                    },
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
