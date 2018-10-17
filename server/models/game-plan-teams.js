module.exports = function (sequelize, DataTypes) {
    var obj = sequelize.define("game_plan_team", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'game_plan_teams',
        classMethods: {
            associate: function (models) {
                obj.belongsTo(models.game_plan);
                obj.hasMany(models.game_role);
                obj.belongsTo(models.user_accounts);
            }
        }
    });
    return obj;
};
