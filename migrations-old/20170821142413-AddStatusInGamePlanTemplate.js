'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    
    queryInterface.addColumn('game_plan_templates', 'status', {type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_plan_templates', 'gamePlanId')
  
  }
};
