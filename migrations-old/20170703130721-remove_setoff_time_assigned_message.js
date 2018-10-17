'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.removeColumn('assigned_game_messages', 'setOffTime')
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.addColumn('assigned_game_messages', 'setOffTime', Sequelize.STRING)
  }
};
