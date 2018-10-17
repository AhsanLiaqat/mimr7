module.exports = function (sequelize, DataTypes) {
    var obj = sequelize.define("game_plan", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        planDate: DataTypes.DATE,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'game_plans',
        classMethods: {
            associate: function (models) {
                obj.belongsTo(models.game_category);
                obj.hasMany(models.game_plan_template);
                obj.hasMany(models.game_message);
                obj.hasMany(models.game_role,{ as: 'roles'});
                obj.hasMany(models.game_library);
                // obj.belongsToMany(models.assigned_game_message, {through: 'game_plan_message'});
                // obj.hasMany(models.game_plan_message);
                obj.belongsTo(models.user_accounts);
            }
        }
    });
    return obj;
};
