'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('status_reports', 'incidentId', { type: Sequelize.UUID })
    queryInterface.addColumn('status_reports', 'version', { type: Sequelize.STRING, defaultValue: 1.0 })

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('status_reports', 'incidentId')
    queryInterface.removeColumn('status_reports', 'versionId')
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
