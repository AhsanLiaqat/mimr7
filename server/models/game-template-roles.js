module.exports = function(sequelize, DataTypes) {
    var role = sequelize.define("game_template_role", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'game_template_roles',
        classMethods: {
            associate: function(models) {
                role.belongsTo(models.user);
                role.belongsTo(models.game_role);
                role.belongsTo(models.game_plan_template);
            }
        }
    });
    return role;
};
