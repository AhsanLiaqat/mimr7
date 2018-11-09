'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('messages', 'order', { type: Sequelize.INTEGER, defaultValue : 0 })
    
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('messages', 'order')
  }
};
