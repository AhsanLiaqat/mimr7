'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('incident_agenda_activities', 'taskListId', { type: Sequelize.UUID})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('incident_agenda_activities', 'taskListId')
  }
};
