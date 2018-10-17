'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('tags',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
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
    queryInterface.dropTable('tags')
  }
};
