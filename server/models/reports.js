module.exports = function(sequelize, DataTypes) {
    var sub = sequelize.define("status_report", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        date: DataTypes.DATE,
        content: DataTypes.TEXT,
        incidentName: DataTypes.STRING,
        version: DataTypes.STRING,
        sent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'status_reports',
        classMethods: {
            associate: function(models) {
                sub.belongsTo(models.incident);
                sub.belongsTo(models.user);
                sub.belongsTo(models.user_accounts);
                sub.hasMany(models.email_tracking);
            }
        }
    });

    return sub;
}
