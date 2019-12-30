'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('highlights',
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
      collectionId : {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('highlights');
  }
};
