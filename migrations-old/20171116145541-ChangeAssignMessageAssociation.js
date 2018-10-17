'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    // queryInterface.addColumn('assigned_game_messages', 'gameMessageId', {type: Sequelize.INTEGER})
    queryInterface.addColumn('assigned_game_messages', 'templatePlanMessageId', {type: Sequelize.INTEGER})
    queryInterface.addColumn('template_plan_messages', 'gameMessageId', {type: Sequelize.INTEGER})
    queryInterface.removeColumn('template_plan_messages', 'gamePlanMessageId')
  },

  down: function (queryInterface, Sequelize) {
    // queryInterface.removeColumn('assigned_game_messages', 'gameMessageId')
    queryInterface.removeColumn('assigned_game_messages', 'templatePlanMessageId')
    queryInterface.removeColumn('template_plan_messages', 'gameMessageId')
    queryInterface.addColumn('template_plan_messages', 'gamePlanMessageId', {type: Sequelize.INTEGER})
    
  }
};
