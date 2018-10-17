'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('incident_checkLists', {
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
          checkListId: {
              type: Sequelize.INTEGER,
              model: 'checkList',
              key: 'id',
              index: true
          },
          incidentId: {
              type: Sequelize.UUID,
              model: 'incidents',
              key: 'id',
              index: true
          }
      })
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('incident_checkLists')
  }
};
