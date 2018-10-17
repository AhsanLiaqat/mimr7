module.exports = function(sequelize, DataTypes) {
    var detail = sequelize.define("player_form_detail", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        submitted: DataTypes.BOOLEAN,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'player_form_details',
        classMethods: {
            associate: function(models) {
                detail.belongsTo(models.submission);
                
                detail.belongsTo(models.game_player);
                detail.belongsTo(models.dynamic_form);
                detail.belongsTo(models.game_plan_template);
            }
        }
    });
    return detail;
};
