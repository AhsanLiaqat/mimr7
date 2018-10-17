'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.addColumn('template_plan_messages', 'userAccountId', {type: Sequelize.INTEGER, index: true});
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.removeColumn('template_plan_messages', 'userAccountId');
  }
};
