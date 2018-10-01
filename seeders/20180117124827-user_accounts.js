'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user_accounts', [{
      id: '00000000-0000-0000-0000-000000000001',
      organizationName : 'CrisisPlan',
      status : true,
      createdAt : new Date(),
      updatedAt : new Date()
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('user_accounts', [{
      organizationName :'CrisisPlan'
    }])
  }
};
