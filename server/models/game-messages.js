module.exports = function(sequelize, DataTypes) {
    var game_messages = sequelize.define("game_message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        author: DataTypes.STRING,
        links: DataTypes.STRING,
        context: DataTypes.TEXT,
        type: DataTypes.STRING,
        order: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },{
        tableName: 'game_messages',
        classMethods: {
            associate: function(models) {
                game_messages.belongsTo(models.game_plan);
                game_messages.belongsTo(models.user_accounts);
                game_messages.hasOne(models.assigned_game_message);
                // game_messages.hasMany(models.assigned_game_message);
                game_messages.belongsTo(models.game_library, {foreignKey: 'libId'});
            }
        }
    });

    return game_messages;
};
