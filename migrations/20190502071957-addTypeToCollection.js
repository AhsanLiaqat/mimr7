'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('collections', 'type', { type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
   return queryInterface.removeColumn('collections', 'type')
  }
};
