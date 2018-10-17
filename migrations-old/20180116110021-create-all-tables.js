'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('ID_games', {
             id: {
                 type: Sequelize.UUID,
                 autoIncrement: true,
                 primaryKey: true
             },
             name: {
                 type: Sequelize.STRING
             },
             activated: {
                 type: Sequelize.BOOLEAN
             },
             played_At: {
                 type: Sequelize.DATE
             },
             userAccountId: {
               type: Sequelize.UUID,
               index: true
             },
             createdAt: {
                 type: Sequelize.DATE
             },
             updatedAt: {
                 type: Sequelize.DATE
             }
         })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
