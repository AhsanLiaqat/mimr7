'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('highlights', 'order', { type: Sequelize.INTEGER, defaultValue : 0 })
    
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('highlights', 'order')
  }
};
