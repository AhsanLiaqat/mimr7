'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('incident_activities', 'deaprtmentId', 'departmentId')
  },

  down: function (queryInterface, Sequelize) {
  }
};
