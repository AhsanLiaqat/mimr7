'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('surveys',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                offset: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                },
                repeatTime: {
                    type: Sequelize.INTEGER
                },
                type : {
                    type : Sequelize.BOOLEAN,
                    defaultValue : false
                },
                isDeleted : {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                dynamicFormId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'dynamic_forms',
                      key: 'id'
                    }
                },
                collectionId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'collections',
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
            return queryInterface.dropTable('surveys');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
