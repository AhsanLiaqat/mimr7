"use strict";

module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("submission", {
        id: {
            type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
		data: DataTypes.TEXT,
		tableId: DataTypes.UUID,
        tableName: DataTypes.STRING,
		isDelete : DataTypes.BOOLEAN
    }, {
        tableName: 'dynamic_form_data',
		classMethods: {
            associate: function (models) {
                obj.belongsTo(models.user_accounts);
                obj.belongsTo(models.user);
                obj.belongsTo(models.game_player);
                obj.belongsTo(models.dynamic_form);
                obj.hasOne(models.player_form_detail);
            }
        }
    });
    return obj;
}
