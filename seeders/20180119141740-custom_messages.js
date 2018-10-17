'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('custom_messages', [{
      id : '00000000-0000-0000-0000-400000000001',
      subject : 'Edit a Plan',
      content : 'Edit a plan or use existing plan as a template for a new plan.', 
      msgType : 'Type 4',      
      msgTemplateType : 'Button',      
      userAccountId : '00000000-0000-0000-0000-000000000001',      

      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      id : '00000000-0000-0000-0000-400000000002',
      subject : 'Create Planning Outline',
      content : 'This option combines different menus, allowing you to select items from existing plans and create new ones.', 
      msgType : 'Type 2',      
      msgTemplateType : 'Button',      
      userAccountId : '00000000-0000-0000-0000-000000000001',      

      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      id : '00000000-0000-0000-0000-400000000003',
      subject : 'Enter a Plan',
      content : 'Do you have a plan on paper? Here you can enter it into the CrisisHub.', 
      msgType : 'Type 3',      
      msgTemplateType : 'Button',      
      userAccountId : '00000000-0000-0000-0000-000000000001',      

      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      id : '00000000-0000-0000-0000-400000000004',
      subject : 'Quick Decision Outline',
      content : 'Do you need a quick list of strategic action lists? This option offers a simple way to select items that are always relevant in a crisis.', 
      msgType : 'Type 1',      
      msgTemplateType : 'Button',      
      userAccountId : '00000000-0000-0000-0000-000000000001',      

      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      id : '00000000-0000-0000-0000-400000000005',
      subject : 'Attentie!',
      content : 'Klik op de onderstaande link om uw takenlijst te bekijken. Log in met uw email adres en password.', 
      msgType : 'Activate Team',      
      msgTemplateType : 'Email',      
      userAccountId : '00000000-0000-0000-0000-000000000001',      

      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      id : '00000000-0000-0000-0000-400000000006',
      subject : 'Attentie!',
      content : 'Klik op de onderstaande link om uw takenlijst te bekijken. Log in met uw email adres en password.', 
      msgType : 'Activate Team',      
      msgTemplateType : 'SMS',      
      userAccountId : '00000000-0000-0000-0000-000000000001',      

      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      id : '00000000-0000-0000-0000-400000000007',
      subject : 'Attentie!',
      content : 'Klik op de onderstaande link om uw takenlijst te bekijken. Log in met uw email adres en password.', 
      msgType : 'Action Plan',      
      msgTemplateType : 'Email',      
      userAccountId : '00000000-0000-0000-0000-000000000001',      

      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      id : '00000000-0000-0000-0000-400000000008',
      subject : 'Attentie!',
      content : 'Klik op de onderstaande link om uw takenlijst te bekijken. Log in met uw email adres en password.', 
      msgType : 'Action Plan',      
      msgTemplateType : 'SMS',      
      userAccountId : '00000000-0000-0000-0000-000000000001',      

      createdAt : new Date(),
      updatedAt : new Date()
    },
        {
      id : '00000000-0000-0000-0000-400000000009',
      subject : 'Attentie!',
      content : '', 
      msgType : 'Summary Report',      
      msgTemplateType : 'Header',      
      userAccountId : '00000000-0000-0000-0000-000000000001',      

      createdAt : new Date(),
      updatedAt : new Date()
    },
        {
      id : '00000000-0000-0000-0000-400000000010',
      subject : 'Attentie!',
      content : '', 
      msgType : 'Summary Report',      
      msgTemplateType : 'Footer',      
      userAccountId : '00000000-0000-0000-0000-000000000001',      

      createdAt : new Date(),
      updatedAt : new Date()
    }
    ], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('custom_messages', [{
      roleId : '00000000-0000-0000-0000-200000000000',
      userId : '00000000-0000-0000-0000-100000000000'
    }])
  }
};
