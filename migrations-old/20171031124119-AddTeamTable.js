'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('game_plan_teams', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          name: {
              type: Sequelize.STRING
          },
          gamePlanId: {
              type: Sequelize.INTEGER,
              model: 'game_plan',
              key: 'id',
              index: true
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
      queryInterface.addColumn('game_roles', 'gamePlanTeamId', {type: Sequelize.INTEGER}) 
      queryInterface.changeColumn('game_roles', 'description', {type: Sequelize.TEXT}) 
      
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('game_plan_teams')
      queryInterface.removeColumn('game_roles', 'gamePlanTeamId')
      queryInterface.changeColumn('game_roles', 'description', {type: Sequelize.STRING})
  }
};
