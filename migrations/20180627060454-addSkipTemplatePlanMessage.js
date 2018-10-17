'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('template_plan_messages', 'skip', { type: Sequelize.BOOLEAN, defaultValue: false})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('template_plan_messages', 'skip')
  }
};
