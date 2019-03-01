'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('answers', 'questionSchedulingId', { type: Sequelize.UUID ,defaultValue: Sequelize.UUIDV4})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('answers', 'questionSchedulingId')
  }
};
