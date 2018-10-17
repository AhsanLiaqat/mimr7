'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('incident_activities', 'plan_activity_id', 'planActivityId')
  },

  down: function (queryInterface, Sequelize) {
  
  }
};
