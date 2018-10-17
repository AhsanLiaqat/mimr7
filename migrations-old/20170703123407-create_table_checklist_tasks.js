'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('check_list_tasks', {
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            },
            taskId: {
                type: Sequelize.INTEGER,
                model: 'task_list',
                key: 'id',
                index: true
            },
            checkListId: {
                type: Sequelize.INTEGER,
                model: 'checkList',
                key: 'id',
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('check_list_tasks')
    }
};
