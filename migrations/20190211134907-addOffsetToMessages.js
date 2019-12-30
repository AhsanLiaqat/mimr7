'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('messages', 'offset', { type: Sequelize.INTEGER})
  },

  down: function (queryInterface, Sequelize) {
   return queryInterface.removeColumn('messages', 'offset')
  }
};
