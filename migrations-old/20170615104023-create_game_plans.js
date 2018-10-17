'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('game_plans', {
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
          planDate: {
              type: Sequelize.DATE
          },
          gameCategoryId: {
              type: Sequelize.INTEGER,
              model: 'game_category',
              key: 'id',
              index: true
          },
          userAccountId: {
              type: Sequelize.INTEGER,
              index: true
          }
      })
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('game_plans')
  }
};
