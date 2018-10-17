'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.renameColumn('game_messages', 'description', 'links')
  },

  down: function (queryInterface, Sequelize) {

  }
};
