'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      id : '00000000-0000-0000-0000-100000000000',
      email : 'admin@crisisplan.nl',
      firstName : 'Admin',
      lastName : 'user',
      password : 'crisis123',
      role : 'superadmin',
      enabled : true,
      available : true,

      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      id : '00000000-0000-0000-0000-100000000001',
      email : 'broek@crisisplan.nl',
      firstName : 'Adinda',
      lastName : 'van den Broek',
      password : '12345678',
      role : 'admin',
      enabled : true,
      available : true,
      userAccountId : '00000000-0000-0000-0000-000000000001',

      createdAt : new Date(),
      updatedAt : new Date()
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', [{
      organizationName :'broek@crisisplan.nl'
    }])
  }
};
