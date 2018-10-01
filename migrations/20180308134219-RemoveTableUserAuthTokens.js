'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   queryInterface.dropTable('auth_tokens');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.createTable('auth_tokens', {
      id: {
        "primaryKey": true,
        "type": "UUID",
        "defaultValue": Sequelize.UUIDv4
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      token: {
          type: Sequelize.TEXT
      },
      valid_from: {
          type: Sequelize.DATE
      },
      login_detail: {
          type: Sequelize.TEXT
      },
      userId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'users',
              key: 'id'
          }
      }
    })
  }
};
