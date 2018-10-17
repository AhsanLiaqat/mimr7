'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('classes', 'summary')
    queryInterface.addColumn('classes', 'summary', { type: Sequelize.TEXT,defaultValue: 'Summary'  })

  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('classes', 'summary')
    queryInterface.addColumn('classes', 'summary', { type: Sequelize.STRING,defaultValue: 'Summary'  })
  }
};
