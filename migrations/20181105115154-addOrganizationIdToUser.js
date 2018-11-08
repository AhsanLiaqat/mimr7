'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'organizationId', { type: Sequelize.UUID})
    
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'organizationId')
  }
};
