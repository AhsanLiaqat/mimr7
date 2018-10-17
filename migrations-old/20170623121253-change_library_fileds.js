'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.renameColumn('game_libraries', 'link', 'links')
      queryInterface.renameColumn('game_libraries', 'fileUrl', 'url')
      queryInterface.renameColumn('game_libraries', 'fileType', 'type')
  },

  down: function (queryInterface, Sequelize) {

  }
};
