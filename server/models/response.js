module.exports = function(sequelize, DataTypes) {
    var response = sequelize.define("response", {
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
    },{
        tableName: 'responses',
        classMethods: {
            associate: function(models) {
                response.belongsTo(models.message);
                response.belongsTo(models.collection);
            }
        }
    });
    return response;
}
