module.exports = function(sequelize, DataTypes) {
    var message = sequelize.define("message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        content: DataTypes.STRING,
        description: DataTypes.STRING,
        order: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'messages',
        classMethods: {
            associate: function(models) {
                message.belongsTo(models.user_accounts);
                message.belongsTo(models.article);
                message.hasMany(models.message_library , {foreignKey: 'parentId'});
                message.hasMany(models.question);
            }
        }
    });
    return message;
}
