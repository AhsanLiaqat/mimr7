'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('capacities', 'used', {type: Sequelize.BOOLEAN}) 
   
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('capacities', 'used') 
  }
};
