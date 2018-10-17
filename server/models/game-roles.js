module.exports = function(sequelize, DataTypes) {
    var role = sequelize.define("game_role", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        order: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'game_roles',
        classMethods: {
            associate: function(models) {
                role.belongsTo(models.user_accounts);
                role.belongsTo(models.game_plan);
                role.belongsTo(models.game_plan_team);
                role.belongsToMany(models.assigned_game_message, {as: 'message', through: 'assigned_game_message_roles', foreignKey: 'gameRoleId'});
                role.hasMany(models.game_template_role);
            }
        }
    });
    return role;
};
