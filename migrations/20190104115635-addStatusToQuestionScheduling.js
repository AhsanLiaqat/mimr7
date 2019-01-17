'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('question_schedulings', 'status', { type: Sequelize.BOOLEAN,defaultValue : false})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('question_schedulings', 'status')
  }
};
