'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('users', 'auth_token')
   queryInterface.removeColumn('users', 'token_expiry')

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

  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'auth_token', { type: Sequelize.TEXT  })
    queryInterface.addColumn('users', 'token_expiry', { type: Sequelize.DATE  })
    queryInterface.dropTable('auth_tokens');
  }
};
