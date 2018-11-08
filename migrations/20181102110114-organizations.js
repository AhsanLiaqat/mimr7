'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('organizations',
            {
                id: {
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDv4
                },
                name: {
                    type: Sequelize.STRING
                },
                city: {
                    type: Sequelize.STRING
                },
                region: {
                    type: Sequelize.STRING
                },
                state: {
                    type: Sequelize.STRING
                },
                status: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: true
                },
                isDeleted : {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                createdAt: {
                    type: "TIMESTAMP WITH TIME ZONE",
                    allowNull: false
                },
                updatedAt: {
                    type: "TIMESTAMP WITH TIME ZONE",
                    allowNull: false
                },
                userAccountId: {
                    type: Sequelize.UUID,
                    allowNull: true,
                    references: {
                        model: "user_accounts",
                        key: "id"
                    }
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
            return queryInterface.dropTable('organizations');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
