'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('articles', 'text', { type: Sequelize.TEXT})
    queryInterface.addColumn('articles', 'userAccountId', { type: Sequelize.UUID})
    queryInterface.removeColumn('articles', 'userId')
    
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('articles', 'text')
    queryInterface.removeColumn('articles', 'userAccountId')
    queryInterface.addColumn('articles', 'userId')
  }
};
