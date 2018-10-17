'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('incident_activities', 'sectionId', {type: Sequelize.INTEGER})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('incident_activities', 'sectionId') 
  }
};
