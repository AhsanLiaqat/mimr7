'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    
    queryInterface.addColumn('game_plan_templates', 'start_time', {type: Sequelize.DATE})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_plan_templates', 'start_time')
  
  }
};
