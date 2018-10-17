'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('game_libraries', {
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
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        author: {
            type: Sequelize.STRING
        },
        link: {
            type: Sequelize.STRING
        },
        filename: {
            type: Sequelize.STRING
        },
        fileUrl: {
            type: Sequelize.STRING
        },
        fileType: {
            type: Sequelize.STRING
        },
        mimetype: {
            type: Sequelize.STRING
        },
        userAccountId: {
            type: Sequelize.INTEGER,
            index: true
        }
    })
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('simulation_library')
  }
};
