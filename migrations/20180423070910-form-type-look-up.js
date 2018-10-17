'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		queryInterface.createTable('form_types',
		{
			id: {
				type: Sequelize.UUID,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4
			},
			name: {
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.TEXT
			},
			createdAt: {
				"type": "TIMESTAMP WITH TIME ZONE",
				allowNull: false
			},
			updatedAt: {
				"type": "TIMESTAMP WITH TIME ZONE",
				allowNull: false
			}
		})
	},
	down: function(queryInterface, Sequelize) {
		queryInterface.dropTable('form_types');
	}
};
