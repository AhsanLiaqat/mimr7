'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('class_lists_users', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      userId: {
          type: Sequelize.UUID,
          index: true,
          references: {
              model: 'users',
              key: 'id'
          }
      },
      classListId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'class_lists',
              key: 'id'
          }
      }
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('class_lists_users');
  }
};
