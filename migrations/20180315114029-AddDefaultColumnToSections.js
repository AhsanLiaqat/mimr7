'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('sections', 'default', { type: Sequelize.BOOLEAN  ,defaultValue: false})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('sections', 'default')
  }
};
