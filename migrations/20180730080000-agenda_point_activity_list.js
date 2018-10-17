'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('agenda_activities', {
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
            activityId: {
                type: Sequelize.UUID,
                model: 'activity',
                key: 'id',
                index: true
            },
            agendaPointId: {
                type: Sequelize.UUID,
                model: 'agendaPoint',
                key: 'id',
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('agenda_activities')
    }
};
