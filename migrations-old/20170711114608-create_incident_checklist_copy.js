'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('incident_checkList_copies', {
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
          incident_checkListId: {
              type: Sequelize.INTEGER,
              model: 'incident_checkList',
              key: 'id',
              index: true
          },
          taskId: {
              type: Sequelize.INTEGER,
              model: 'task_list',
              key: 'id',
              index: true
          },
          status:{
            type: Sequelize.BOOLEAN
          }
      })
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('incident_checkList_copies')
  }
};
