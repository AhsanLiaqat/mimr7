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
                setOffTime: {
                    type: Sequelize.STRING
                },
                offset: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                },
                activated: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                activatedAt: {
                    type: "TIMESTAMP WITH TIME ZONE"
                },
                expiryTime: {
                    type: Sequelize.INTEGER,
                    defaultValue : 0
                },
                lastSent: {
                    type: Sequelize.STRING
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
                articleId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'articles',
                      key: 'id'
                    }
                },
                userId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'users',
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
