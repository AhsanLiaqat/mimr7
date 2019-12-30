module.exports = function(sequelize, DataTypes) {
    var message = sequelize.define("message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        number: DataTypes.INTEGER,
        offset: DataTypes.INTEGER,
        type: DataTypes.STRING,
        hint: DataTypes.TEXT,
        solution: DataTypes.TEXT,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'messages',
        classMethods: {
            associate: function(models) {
                message.belongsTo(models.user_accounts);
                message.belongsTo(models.highlight);
                message.belongsTo(models.collection);
                message.hasOne(models.answer);
                message.hasOne(models.response);
            }
        }
    });
    return message;
}
