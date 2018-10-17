'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('libraries',
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
      link : {
        type : Sequelize.STRING
      },
      filename : {
        type : Sequelize.STRING
      },
      url : {
        type : Sequelize.STRING
      },
      type : {
        type : Sequelize.STRING
      },
      mimetype : {
        type : Sequelize.STRING
      },
      tags : {
        type : Sequelize.STRING
      },
      parentId : {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      parentType : {
        type : Sequelize.STRING
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
      }
    })
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('libraries');
  }
};
