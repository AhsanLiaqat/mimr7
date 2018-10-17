'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_messages', 'context', {type: Sequelize.TEXT})
    queryInterface.addColumn('game_messages', 'type', {type: Sequelize.STRING})
    queryInterface.addColumn('game_messages', 'gamePlanId', {type: Sequelize.TEXT})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_messages', 'context')
    queryInterface.removeColumn('game_messages', 'type')
    queryInterface.removeColumn('game_messages', 'gamePlanId')

  }
};
