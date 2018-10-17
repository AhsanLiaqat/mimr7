'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('plan_activities', 'sectionId', {type: Sequelize.INTEGER})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('plan_activities', 'sectionId')
  }
};
