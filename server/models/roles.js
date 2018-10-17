module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("role", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'roles',
        classMethods: {
            associate: function(models) {
                obj.belongsToMany(models.user, {through: 'user_roles',foreignKey: 'roleId'});
                obj.hasMany(models.activity);
                obj.hasMany(models.agenda_activity);
                obj.hasMany(models.incident_agenda_activity);
                obj.hasMany(models.incident_activity);
                obj.belongsTo(models.user_accounts);

            }
        }
    });
    return obj;
}
