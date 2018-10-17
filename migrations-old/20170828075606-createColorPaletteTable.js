'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('color_palettes', {
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
          color: {
              type: Sequelize.STRING,
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
      queryInterface.dropTable('color_palettes')
  }
};
