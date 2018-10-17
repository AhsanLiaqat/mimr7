'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('action_plan_agenda_lists', {
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
            actionPlanId: {
                type: "UUID",
                model: 'action_plan',
                key: 'id',
                index: true
            },
            agendaPointId: {
                type: "UUID",
                model: 'agendaPoint',
                key: 'id',
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('action_plan_agenda_lists')
    }
};
