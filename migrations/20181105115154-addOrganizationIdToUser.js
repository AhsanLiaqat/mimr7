'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'organizationId', { type: Sequelize.UUID})
    
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'organizationId')
  }
};
