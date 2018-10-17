'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('template_plan_messages', {
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
            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            setOffTime: {
                type: Sequelize.STRING
            },
            index: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            default: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            copy: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            activated: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            activatedAt: {
                type: Sequelize.DATE
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'incomplete'
            },
            statusAt: {
                type: Sequelize.DATE
            },
            responseActorId: {
                type: Sequelize.INTEGER,
                model: 'users',
                index: true
            },
            gameMessageId: {
                type: Sequelize.INTEGER,
                model: 'game_message',
                key: 'id',
                index: true
            },
            assignedGameMessageId: {
                type: Sequelize.INTEGER,
                model: 'assigned_game_message',
                key: 'id',
                index: true
            },
            gamePlanMessageId: {
                type: Sequelize.INTEGER,
                model: 'game_plan_message',
                key: 'id',
                index: true
            },
            gamePlanId: {
                type: Sequelize.INTEGER,
                model: 'game_plan',
                key: 'id',
                index: true
            },
            gameIncidentId: {
                type: Sequelize.UUID,
                model: 'game_incident',
                key: 'id',
                index: true
            },
            gamePlanTemplateId: {
                type: Sequelize.INTEGER,
                model: 'game_plan_template',
                key: 'id',
                index: true
            },
            userAccountId: {
                type: Sequelize.INTEGER,
                model: 'user_accounts',
                key: 'id',
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('template_plan_messages')
    }
};