'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('ID_games', 'activated')
    queryInterface.removeColumn('ID_games', 'played_At')

    queryInterface.removeColumn('ID_messages', 'activated')
    queryInterface.removeColumn('ID_messages', 'activated_At')

   queryInterface.createTable('id_schedule_games', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          ID_gameId: {
              type: Sequelize.INTEGER
          },
          IDGameId: {
              type: Sequelize.INTEGER
          },
          incidentId: {
              type: Sequelize.UUID
          },
          time: {
              type: Sequelize.INTEGER
          },
          scheduled_date: {
              type: Sequelize.DATE
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

   queryInterface.createTable('id_schedule_messages', {
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
          offset: {
              type: Sequelize.INTEGER
          },
          userId: {
              type: Sequelize.INTEGER
          },
          setOffTime: {
              type: Sequelize.DATE
          },
          activated: {
              type: Sequelize.BOOLEAN
          },
          activated_At: {
              type: Sequelize.DATE
          },
          idScheduleGameId: {
              type: Sequelize.INTEGER
          },
          IDMessageId: {
              type: Sequelize.INTEGER
          },
          ID_messageId: {
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
    queryInterface.addColumn('ID_games', 'activated', {type: Sequelize.BOOLEAN}) 
    queryInterface.addColumn('ID_games', 'played_At', {type: Sequelize.DATE}) 
    queryInterface.addColumn('ID_messages', 'activated', {type: Sequelize.BOOLEAN}) 
    queryInterface.addColumn('ID_messages', 'activated_At', {type: Sequelize.DATE}) 

    queryInterface.dropTable('id_schedule_games')
    queryInterface.dropTable('id_schedule_messages')
  }
};
