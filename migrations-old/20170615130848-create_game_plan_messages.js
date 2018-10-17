'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('game_plan_messages', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            },
            index: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            default: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            gamePlanId: {
                type: Sequelize.INTEGER,
                model: 'game_plan',
                key: 'id',
                index: true
            },
            assignedGameMessageId: {
                type: Sequelize.INTEGER,
                model: 'assigned_game_message',
                key: 'id',
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('game_plan_messages')
    }
};