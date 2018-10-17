'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('game_roles', {
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
              type: Sequelize.STRING
          },
          description: {
              type: Sequelize.STRING
          },
          userAccountId: {
              type: Sequelize.INTEGER,
              model: 'user_accounts',
              key: 'id',
              index: true
          }
      })
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('game_roles')
  }
};
