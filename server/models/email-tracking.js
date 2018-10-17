module.exports = function(sequelize, DataTypes) {
    var sub = sequelize.define("email_tracking", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        date: DataTypes.DATE,
        content: DataTypes.TEXT,
        sentTo: DataTypes.STRING,
        type: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'email_trackings',
        classMethods: {
            associate: function(models) {
                sub.belongsTo(models.user);
                sub.belongsTo(models.user_accounts);
                sub.belongsTo(models.status_report);
            }
        }
    });

    return sub;

}
