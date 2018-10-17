'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('incident_shapes', {
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
          incidentId: {
              type: Sequelize.UUID,
              model: 'incidents',
              key: 'id',
              index: true
          },
          userAccountId: {
              type: Sequelize.INTEGER,
              index: true
          },
          shapes: {
              type: Sequelize.JSON
          }
      })
    
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('incident_shapes')
    
  }
};
