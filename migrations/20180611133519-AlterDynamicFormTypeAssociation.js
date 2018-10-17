'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('dynamic_forms', 'name', { type: Sequelize.STRING})
    queryInterface.addColumn('dynamic_forms', 'heading', { type: Sequelize.TEXT})
    queryInterface.removeColumn('dynamic_forms', 'formType')
    queryInterface.addColumn('dynamic_forms', 'formTypeId', { type: Sequelize.UUID})
    queryInterface.removeColumn('dynamic_forms', 'obj')
    queryInterface.addColumn('dynamic_forms', 'fields', { type: Sequelize.JSON})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('dynamic_forms', 'name')
    queryInterface.removeColumn('dynamic_forms', 'heading')
    queryInterface.removeColumn('dynamic_forms', 'formTypeId')
    queryInterface.addColumn('dynamic_forms', 'formType', { type: Sequelize.STRING})
    queryInterface.removeColumn('dynamic_forms', 'fields')
    queryInterface.addColumn('dynamic_forms', 'obj', { type: Sequelize.JSON})
  }
};
