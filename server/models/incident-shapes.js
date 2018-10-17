module.exports = function(sequelize, DataTypes) {
    var shapes = sequelize.define("incident_shape", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        shapes: DataTypes.JSON,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'incident_shapes',
        classMethods: {
            associate: function(models) {

                shapes.belongsTo(models.incident);
                shapes.belongsTo(models.user_accounts);
            }
        }
    });

    return shapes;
};
