module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("auth_token", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        token: DataTypes.TEXT,
        valid_from: DataTypes.DATE,
        login_detail: DataTypes.TEXT
    }, {
        tableName: 'auth_tokens',
        classMethods: {
            associate: function(models) {
                obj.belongsTo(models.user);
            }
        }
    });
    return obj;
}
