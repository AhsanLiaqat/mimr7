module.exports = function(sequelize, DataTypes) {
    var message = sequelize.define("message_history", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        content: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        modifiedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
        index: DataTypes.INTEGER,

        selectedColor : DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'message_histories',
        classMethods: {
            associate: function(models) {

                message.belongsTo(models.incident);

                message.belongsTo(models.user, {as: 'user'});
                message.belongsTo(models.user, {as: 'editor', foreignKey: 'editorId'});
                message.belongsTo(models.message);
                message.belongsTo(models.class);
                message.belongsTo(models.sub_class);
            }
        }
    });
    return message;
}
