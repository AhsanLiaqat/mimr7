'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_messages', 'gamePlanId', {type: Sequelize.INTEGER})   
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_messages', 'gamePlanId')
    
  }
};
