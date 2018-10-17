'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   queryInterface.createTable('ID_games', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          name: {
              type: Sequelize.STRING
          },
          activated: {
              type: Sequelize.BOOLEAN
          },
          played_At: {
              type: Sequelize.DATE
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


   queryInterface.createTable('ID_messages', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          message: {
              type: Sequelize.STRING
          },
          order: {
              type: Sequelize.INTEGER
          },
          activated: {
              type: Sequelize.BOOLEAN
          },
          activated_At: {
              type: Sequelize.DATE
          },
          ID_gameId: {
              type: Sequelize.INTEGER
          },
          IDGameId: {
              type: Sequelize.INTEGER
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
    queryInterface.dropTable('ID_games')
    queryInterface.dropTable('ID_messages')
  }
};
