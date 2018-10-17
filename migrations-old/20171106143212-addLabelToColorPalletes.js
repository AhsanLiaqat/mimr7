'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('color_palettes', 'name', {type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('color_palettes', 'name')
  }
};
