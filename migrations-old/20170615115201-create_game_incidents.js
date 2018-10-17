'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('game_incidents', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
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
            active: {
                type: Sequelize.STRING,
                defaultValue: 'Active'
            },
            gameCategoryId: {
                type: Sequelize.INTEGER,
                model: 'game_category',
                key: 'id',
                index: true
            },
            reporterId: {
                type: Sequelize.INTEGER,
                model: 'users',
                key: 'id',
                index: true
            },
            userAccountId: {
                type: Sequelize.INTEGER,
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('game_incidents')
    }
};