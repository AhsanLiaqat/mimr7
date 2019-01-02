'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('question_schedulings', 'total_time', { type: Sequelize.INTEGER})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('question_schedulings', 'total_time')
  }
};
