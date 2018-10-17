'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('assigned_game_message_roles', {
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            },
            assignedGameMessageId: {
                type: Sequelize.INTEGER,
                model: 'assigned_game_message',
                key: 'id',
                index: true
            },
            gameRoleId: {
                type: Sequelize.INTEGER,
                model: 'game_role',
                key: 'id',
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('assigned_game_message_roles')
    }
};
