'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('game_incident_locations', {
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            },
            gameIncidentId: {
                type: Sequelize.UUID,
                model: 'game_incident',
                key: 'id',
                index: true
            },
            placeId: {
                type: Sequelize.STRING,
                model: 'places',
                key: 'id',
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('game_incident_locations')
    }
};