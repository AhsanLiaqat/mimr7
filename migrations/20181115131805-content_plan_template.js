'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
        .then(() => {
            return queryInterface.createTable('content_plan_templates',
            {
                "id": {
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDv4
                },
                content_activated: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                scheduled_date: {
                    type: "TIMESTAMP WITH TIME ZONE"
                },
                status: {
                    type: Sequelize.STRING,
                    defaultValue: "made"
                },
                start_time: {
                    type: "TIMESTAMP WITH TIME ZONE"
                },
                pause_date: {
                    type: "TIMESTAMP WITH TIME ZONE"
                },
                resume_date: {
                    type: "TIMESTAMP WITH TIME ZONE"
                },
                play_date: {
                    type: "TIMESTAMP WITH TIME ZONE"
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
                articleId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'articles',
                      key: 'id'
                    }
                },
                playerListId: {
                    type: Sequelize.UUID,
                    index: true,
                    references: {
                      model: 'player_lists',
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
            return queryInterface.dropTable('content_plan_templates');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
        });
    }
};
