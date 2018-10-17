'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('incident_checkList_copies','status',{type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('incident_checkList_copies','status',{type: Sequelize.BOOLEAN,defaultValue: false})
    
  }
};
