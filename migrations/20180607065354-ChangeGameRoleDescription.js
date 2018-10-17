'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_roles', 'description')
    queryInterface.addColumn('game_roles', 'description', { type: Sequelize.TEXT  })

  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_roles', 'description')
    queryInterface.addColumn('game_roles', 'description', { type: Sequelize.STRING  })
  }
};