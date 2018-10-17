'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('task_tags',
      {
        tagId: {
          type: Sequelize.INTEGER,
          model: 'tags',
          key: 'id'
        },
        taskId: {
          type: Sequelize.INTEGER,
          model: 'task_list',
          key: 'id'
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      })
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('task_tags')
  }
};
