'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('agenda_point_list_tasks', {
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
            taskListId: {
                type: "UUID",
                model: 'task_list',
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
        queryInterface.dropTable('agenda_point_list_tasks')
    }
};
