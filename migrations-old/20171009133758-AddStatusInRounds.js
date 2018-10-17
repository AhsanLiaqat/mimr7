'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_plan_template_rounds', 'status', {type: Sequelize.BOOLEAN, defaultValue: false})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_plan_template_rounds', 'status')
    
  }
};
