'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('agenda_activities', 'index', { type: Sequelize.INTEGER,defaultValue: 0})
    queryInterface.addColumn('agenda_activities', 'tindex', { type: Sequelize.INTEGER,defaultValue: 0})
    queryInterface.addColumn('agenda_activities', 'default', { type: Sequelize.BOOLEAN,defaultValue: false})
    queryInterface.addColumn('agenda_activities', 'isDeleted', { type: Sequelize.BOOLEAN, defaultValue: false })
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('agenda_activities', 'index')
   queryInterface.removeColumn('agenda_activities', 'tindex')
   queryInterface.removeColumn('agenda_activities', 'default')
   queryInterface.removeColumn('agenda_activities', 'isDeleted')
  }
};