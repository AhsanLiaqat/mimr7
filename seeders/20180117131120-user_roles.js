'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user_roles', [{
      roleId : '00000000-0000-0000-0000-200000000000',
      userId : '00000000-0000-0000-0000-100000000000',      
      createdAt : new Date(),
      updatedAt : new Date()
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('user_roles', [{
      roleId : '00000000-0000-0000-0000-200000000000',
      userId : '00000000-0000-0000-0000-100000000000'
    }])
  }
};
