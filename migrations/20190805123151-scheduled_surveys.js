'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('scheduled_surveys',
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
                skip: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                status: {
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
                skipped_At: {
                    type: Sequelize.DATE
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
                },
                contentPlanTemplateId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'content_plan_templates',
                      key: 'id'
                    }
                },
                surveyId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'surveys',
                      key: 'id'
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
            return queryInterface.dropTable('scheduled_surveys');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
