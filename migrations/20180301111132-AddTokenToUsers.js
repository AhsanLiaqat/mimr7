'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'auth_token', { type: Sequelize.TEXT  })
    queryInterface.addColumn('users', 'token_expiry', { type: Sequelize.DATE  })
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('users', 'auth_token')
   queryInterface.removeColumn('users', 'token_expiry')
    
  }
};
