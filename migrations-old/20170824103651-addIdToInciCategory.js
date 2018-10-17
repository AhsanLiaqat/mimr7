'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('incident_types_default_categories', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('incident_types_default_categories', 'id')

  }
};
