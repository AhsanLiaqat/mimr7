module.exports = function(sequelize, DataTypes) {
    var assigned_game_message = sequelize.define("assigned_game_message",{
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
        tableName: 'assigned_game_messages',
        classMethods: {
            associate: function(models) {
                assigned_game_message.belongsTo(models.user, {as: 'response_actor', foreignKey: 'responseActorId'});
                assigned_game_message.belongsTo(models.game_message);
                assigned_game_message.belongsTo(models.user_accounts);
                // assigned_game_message.hasMany(models.game_plan_message);
                // assigned_game_message.belongsTo(models.game_plan, {foreignKey: 'gamePlanId'});
                assigned_game_message.hasOne(models.template_plan_message);
                assigned_game_message.belongsToMany(models.game_role, {as: 'roles', through: 'assigned_game_message_roles', foreignKey: 'assignedGameMessageId'});
            }
        }
    });
    return assigned_game_message;
};
