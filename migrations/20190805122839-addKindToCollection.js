'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('collections', 'kind', { type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
   return queryInterface.removeColumn('collections', 'kind')
  }
};
