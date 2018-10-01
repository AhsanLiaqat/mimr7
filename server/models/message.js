module.exports = function(sequelize, DataTypes) {
    var message = sequelize.define("message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        content: DataTypes.STRING,
        description: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'messages',
        classMethods: {
            associate: function(models) {
                message.hasMany(models.message_library);
            }
        }
    });
    return message;
}
