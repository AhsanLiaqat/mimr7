'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('dynamic_forms', {
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
          obj: {
              type: Sequelize.TEXT,
          },
          refrenceId: {
              type: Sequelize.INTEGER,
          },
          refrenceTable: {
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
      queryInterface.dropTable('dynamic_forms')
  }
};
