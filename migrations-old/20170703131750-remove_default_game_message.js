'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.removeColumn('game_plan_messages', 'default')
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.addColumn('game_plan_messages', 'default', Sequelize.BOOLEAN)
  }
};
