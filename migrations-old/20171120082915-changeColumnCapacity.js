'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('capacities', 'availableOnRequest') 
    queryInterface.removeColumn('capacities', 'available') 
    queryInterface.addColumn('capacities', 'availableOnRequest', {type: Sequelize.INTEGER}) 
    queryInterface.addColumn('capacities', 'available', {type: Sequelize.INTEGER}) 
   
  },

  down: function (queryInterface, Sequelize) {
    // queryInterface.changeColumn('capacities', 'availableOnRequest', {type: Sequelize.STRING}) 
    // queryInterface.changeColumn('capacities', 'available', {type: Sequelize.STRING}) 
   
  }
};
