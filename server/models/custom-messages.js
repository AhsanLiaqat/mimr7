module.exports = function (sequelize, DataTypes) {
    var obj = sequelize.define("custom_message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        subject: DataTypes.STRING,
        content: DataTypes.STRING,
        msgType: DataTypes.STRING,
        msgTemplateType: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'custom_messages',
        classMethods: {
            associate: function (models) {
                obj.belongsTo(models.user_accounts);
            }
        }
    });
    return obj;
}
