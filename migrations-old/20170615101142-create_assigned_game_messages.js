'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('assigned_game_messages', {
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
          setOffTime: {
              type: Sequelize.STRING
          },
          responseActorId: {
              type: Sequelize.INTEGER,
              index: true
          },
          gameMessageId: {
              type: Sequelize.INTEGER,
              model: 'game_message',
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
      queryInterface.dropTable('assigned_game_messages')
  }
};
