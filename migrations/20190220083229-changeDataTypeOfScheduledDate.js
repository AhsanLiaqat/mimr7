'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('content_plan_templates', 'scheduled_date', { type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
   return queryInterface.changeColumn('content_plan_templates', 'scheduled_date',{type : Sequelize.STRING})
  }
};
