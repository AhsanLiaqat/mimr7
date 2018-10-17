'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.addColumn('all_categories', 'position', {type: Sequelize.INTEGER})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('all_categories', 'position')

  }
};
