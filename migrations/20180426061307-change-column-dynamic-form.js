'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('dynamic_forms', 'obj')
    queryInterface.addColumn('dynamic_forms', 'obj', { type: Sequelize.TEXT })

  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('dynamic_forms', 'obj')
    queryInterface.addColumn('dynamic_forms', 'obj', { type: Sequelize.STRING })
  }
};
