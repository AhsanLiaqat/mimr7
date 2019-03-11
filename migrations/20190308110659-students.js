'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('students',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                name : {
                    type : Sequelize.STRING
                },
                email: {
                    type: Sequelize.STRING
                },
                mobilePhone: {
                    type: Sequelize.STRING
                },
                isDeleted : {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                organizationId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'organizations',
                      key: 'id'
                    }
                },
                createdAt: {
                    type: "TIMESTAMP WITH TIME ZONE",
                    allowNull: false
                },
                updatedAt: {
                    type: "TIMESTAMP WITH TIME ZONE",
                    allowNull: false
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
            return queryInterface.dropTable('students');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
