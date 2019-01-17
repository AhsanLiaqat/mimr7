'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('question_schedulings', 'userId', { type: Sequelize.UUID ,defaultValue: Sequelize.UUIDV4})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('question_schedulings', 'userId')
  }
};
