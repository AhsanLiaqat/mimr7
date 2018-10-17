'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.dropTable('game_incidents')
  },

  down: function (queryInterface, Sequelize) {

  }
};
