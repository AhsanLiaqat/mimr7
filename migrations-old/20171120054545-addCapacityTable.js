'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('capacities', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          assets: {
              type: Sequelize.STRING
          },
          description: {
              type: Sequelize.STRING
          },
          max: {
              type: Sequelize.INTEGER
          },
          availableOnRequest: {
              type: Sequelize.STRING
          },
          available: {
              type: Sequelize.BOOLEAN
          },
          additionalInfo: {
              type: Sequelize.STRING
          },
          userAccountId: {
            type: Sequelize.INTEGER,
            index: true
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
      queryInterface.dropTable('capacity')
  }
};
