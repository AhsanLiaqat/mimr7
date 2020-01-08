'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function (t) {
       return queryInterface.addColumn('content_plan_templates', 'schedule_type', { type: Sequelize.STRING })
    })
    },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function (t) {
      return queryInterface.removeColumn('content_plan_templates', 'schedule_type')
    })
    }
};
