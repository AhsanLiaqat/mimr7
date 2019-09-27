'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function (t) {
      queryInterface.addColumn('content_plan_templates', 'dynamicFormId', { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 })
    })
    },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function (t) {
      queryInterface.removeColumn('content_plan_templates', 'dynamicFormId')
    })
    }
};
