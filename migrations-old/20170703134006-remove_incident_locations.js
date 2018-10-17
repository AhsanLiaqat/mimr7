'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.dropTable('game_incident_locations')
  },

  down: function (queryInterface, Sequelize) {

  }
};
