'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('user_colors', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          colorPaletteId: {
              type: Sequelize.INTEGER,
              model: 'color_palettes',
              key: 'id',
              index: true
          },
          userId: {
            type: Sequelize.INTEGER,
            model: 'users',
            key: 'id',
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
      queryInterface.dropTable('user_colors')
  }
};
