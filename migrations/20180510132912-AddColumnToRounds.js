'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_plan_template_rounds', 'resume_date', { type: Sequelize.DATE})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('game_plan_template_rounds', 'resume_date')
  }
};
