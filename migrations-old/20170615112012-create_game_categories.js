'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('game_categories', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
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
            userAccountId: {
                type: Sequelize.INTEGER,
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('game_categories')
    }
};