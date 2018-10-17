'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_roles', 'gamePlanId', {type: Sequelize.INTEGER})
    queryInterface.addColumn('game_libraries', 'gamePlanId', {type: Sequelize.INTEGER})
    queryInterface.removeColumn('game_messages', 'gamePlanId')
    queryInterface.addColumn('game_messages', 'gamePlanId', {type: Sequelize.INTEGER})
    
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_roles', 'gamePlanId')
    queryInterface.removeColumn('game_libraries', 'gamePlanId')
    queryInterface.changeColumn('game_messages','gamePlanId',{type: Sequelize.TEXT})
    
  }
};
