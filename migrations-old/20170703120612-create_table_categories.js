'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('all_categories', {
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
          name: {
              type: Sequelize.STRING
          },
          description: {
              type: Sequelize.STRING
          },
          type: {
            type: Sequelize.STRING
          },
          userAccountId: {
              type: Sequelize.INTEGER,
              index: true
          }
      })
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('all_categories')
  }
};
