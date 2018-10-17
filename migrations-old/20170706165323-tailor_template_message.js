'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('template_plan_messages', 'name');
    queryInterface.removeColumn('template_plan_messages', 'description');
    queryInterface.removeColumn('template_plan_messages', 'default');
    queryInterface.removeColumn('template_plan_messages', 'responseActorId');
    queryInterface.removeColumn('template_plan_messages', 'gameMessageId');
    queryInterface.removeColumn('template_plan_messages', 'gamePlanId');
    queryInterface.removeColumn('template_plan_messages', 'userAccountId');
    queryInterface.removeColumn('template_plan_messages', 'gameIncidentId');
  },

  down: function (queryInterface, Sequelize) {
  }
};
