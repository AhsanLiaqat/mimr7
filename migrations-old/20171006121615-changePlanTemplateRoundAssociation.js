'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_plan_template_rounds', 'messageIndex', {type: Sequelize.INTEGER})
    queryInterface.removeColumn('game_plan_template_rounds', 'templatePlanMessageId')
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_plan_template_rounds', 'templatePlanMessageId', {type: Sequelize.INTEGER})
    queryInterface.removeColumn('game_plan_template_rounds', 'messageIndex')
    
  }
};
