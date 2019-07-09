module.exports = function(sequelize, DataTypes) {
    var player_list = sequelize.define("player_list", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'player_lists',
        classMethods: {
            associate: function(models) {
                player_list.belongsTo(models.user_accounts);
                player_list.belongsTo(models.organization);
                player_list.hasMany(models.content_plan_template);
                player_list.belongsToMany(models.user, {through: 'player_lists_users'});
            }
        }
    });
    return player_list;
}
