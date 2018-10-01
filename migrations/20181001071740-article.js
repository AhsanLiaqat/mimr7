'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('articles',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      title : {
        type : Sequelize.TEXT
      },
      description : {
        type : Sequelize.TEXT
      },
      private : {
        type : Sequelize.BOOLEAN
      },
      saleable : {
        type : Sequelize.BOOLEAN
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
      userId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
    })
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('articles');
  }
};
