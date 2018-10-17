'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('messages',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      content : {
        type : Sequelize.TEXT
      },
      description : {
        type : Sequelize.TEXT
      },
      isDeleted : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: "TIMESTAMP WITH TIME ZONE",
        allowNull: false
      },
      updatedAt: {
        type: "TIMESTAMP WITH TIME ZONE",
        allowNull: false
      },
      articleId : {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
    })
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('messages');
  }
};
