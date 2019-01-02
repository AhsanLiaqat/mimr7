'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('question_schedulings',
            {
                "id": {
                    "primaryKey": true,
                    "type": "UUID",
                    "defaultValue": Sequelize.UUIDv4
                },
                setOffTime: {
                    type: Sequelize.STRING
                },
                index: {
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
                status: {
                    type: Sequelize.STRING,
                    defaultValue: "incomplete"
                },
                statusAt: {
                    type: "TIMESTAMP WITH TIME ZONE"
                },
                isDeleted : {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                contentPlanTemplateId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'content_plan_templates',
                      key: 'id'
                    }
                },
                offset: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                },
                questionId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'questions',
                      key: 'id'
                    }
                },
                timeleft: {
                    type: Sequelize.INTEGER
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
            return queryInterface.dropTable('question_schedulings');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
