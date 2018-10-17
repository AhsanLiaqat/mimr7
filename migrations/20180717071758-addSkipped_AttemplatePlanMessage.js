'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('template_plan_messages', 'skipped_At', { type: Sequelize.DATE})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('template_plan_messages', 'skipped_At')
  }
};
