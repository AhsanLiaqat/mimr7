'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('messages', 'gamePlayerId', { type: Sequelize.UUID})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('messages', 'gamePlayerId')
  }
};
