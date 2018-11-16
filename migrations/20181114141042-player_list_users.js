'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('player_lists_users', {
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
      userId: {
          type: Sequelize.UUID,
          index: true,
          references: {
              model: 'users',
              key: 'id'
          }
      },
      playerListId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'player_lists',
              key: 'id'
          }
      }
    })
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('player_lists_users');
  }
};
