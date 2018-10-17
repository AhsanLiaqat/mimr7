'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		queryInterface.createTable('dynamic_form_data',
		{
			id: {
				type: Sequelize.UUID,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4
			},
			tableName: {
				type: Sequelize.STRING,
			},
			tableId: {
				type: Sequelize.UUID,
			},
			dynamicFormId: {
				type: Sequelize.UUID,
				index: true,
				references: {
					model: 'dynamic_forms',
					key: 'id'
				}
			},
			data: {
				type: Sequelize.TEXT
			},
			userId: {
				type: Sequelize.UUID,
				index: true,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			userAccountId: {
				type: Sequelize.UUID,
				index: true,
				references: {
					model: 'user_accounts',
					key: 'id'
				}
			},
			isDelete : {
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
		queryInterface.dropTable('dynamic_form_data');
	}
};
