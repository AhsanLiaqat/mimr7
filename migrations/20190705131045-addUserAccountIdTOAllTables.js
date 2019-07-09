'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function (t) {
      queryInterface.addColumn('messages', 'userAccountId', { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 })
      queryInterface.addColumn('questions', 'userAccountId', { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 })
      queryInterface.addColumn('player_lists', 'userAccountId', { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 })
      queryInterface.addColumn('content_plan_templates', 'userAccountId', { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 })
      queryInterface.addColumn('chapters', 'userAccountId', { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 })
      queryInterface.addColumn('dynamic_forms', 'userAccountId', { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 })
      queryInterface.addColumn('responses', 'userAccountId', { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 })
    })
    },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function (t) {
      queryInterface.removeColumn('messages', 'userAccountId')
      queryInterface.removeColumn('questions', 'userAccountId')
      queryInterface.removeColumn('player_lists', 'userAccountId')
      queryInterface.removeColumn('content_plan_templates', 'userAccountId')
      queryInterface.removeColumn('chapters', 'userAccountId')
      queryInterface.removeColumn('dynamic_forms', 'userAccountId')
      queryInterface.removeColumn('responses', 'userAccountId')
    })
    }
};
