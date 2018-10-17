'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('game_plan_templates', {
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
            plan_activated: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            selected: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            gameIncidentId: {
                type: Sequelize.UUID,
                model: 'game_incident',
                key: 'id',
                index: true
            },
            gamePlanId: {
                type: Sequelize.INTEGER,
                model: 'game_plan',
                key: 'id',
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('game_plan_templates')
    }
};