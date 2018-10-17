'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('activities', 'incidentsTeamId')
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.addColumn('activities', 'incidentsTeamId', Sequelize.INTEGER)
  }
};