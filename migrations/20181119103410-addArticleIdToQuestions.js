'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('questions', 'articleId', { type: Sequelize.UUID ,defaultValue: Sequelize.UUIDV4})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('questions', 'articleId')
  }
};
