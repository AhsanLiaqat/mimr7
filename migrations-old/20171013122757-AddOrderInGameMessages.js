'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_messages', 'order', {type: Sequelize.INTEGER})
    queryInterface.addColumn('game_roles', 'order', {type: Sequelize.INTEGER})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_messages', 'order')
    queryInterface.removeColumn('game_roles', 'order')
  }
};
