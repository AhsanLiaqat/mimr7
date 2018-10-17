'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('default_categories', 'position', {type: Sequelize.INTEGER})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('default_categories', 'position')

  }
};
