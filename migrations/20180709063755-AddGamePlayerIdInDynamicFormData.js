'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('dynamic_form_data', 'gamePlayerId', { type: Sequelize.UUID })
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('dynamic_form_data', 'gamePlayerId')
  }
};
