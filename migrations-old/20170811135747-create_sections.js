'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('sections', {
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
          name: {
              type: Sequelize.STRING,
          },
          actionPlanId: {
              type: Sequelize.INTEGER,
              model: 'action_plans',
              key: 'id',
              index: true
          }
      })
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('sections')
  }
};
