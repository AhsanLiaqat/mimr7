'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [{
      id : '00000000-0000-0000-0000-200000000000',
      name : 'AC Bevolkingszorg',
      userAccountId : '00000000-0000-0000-0000-000000000001',
      createdAt : new Date(),
      updatedAt : new Date()
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('roles', [{
      name :'AC Bevolkingszorg'
    }])
  }
};
