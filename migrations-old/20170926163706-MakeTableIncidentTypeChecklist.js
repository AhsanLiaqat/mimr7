'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('incident_types_checklists', {
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
          categoryId: {
              type: Sequelize.INTEGER,
              model: 'categories',
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
      queryInterface.dropTable('incident_types_checklists')
  }
};
