'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('game_players', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          firstName: {
              type: Sequelize.STRING
          },
          lastName: {
              type: Sequelize.STRING
          },
          email: {
              type: Sequelize.STRING
          },
          mobilePhone: {
              type: Sequelize.STRING
          },
          organizationName: {
              type: Sequelize.STRING
          },
          country: {
              type: Sequelize.STRING
          },
          active: {
              type: Sequelize.BOOLEAN
          },
          // gamePlanId: {
          //     type: Sequelize.INTEGER
          // },
          userId: {
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

      queryInterface.createTable('game_player_lists', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          name: {
              type: Sequelize.STRING
          },
          description: {
              type: Sequelize.STRING
          },
          // gamePlanId: {
          //     type: Sequelize.INTEGER
          // },
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

      queryInterface.createTable('game_player_list_players', {
          gamePlayerId: {
              type: Sequelize.INTEGER
          },
          gamePlayerListId: {
              type: Sequelize.INTEGER
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
      queryInterface.dropTable('game_players')
      queryInterface.dropTable('game_player_lists')
      queryInterface.dropTable('game_player_list_players')
  }
};
