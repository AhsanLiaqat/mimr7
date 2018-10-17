module.exports = function(sequelize, DataTypes) {
    var sub = sequelize.define("sub_class", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'sub_classes',
        classMethods: {
            associate: function(models) {
                sub.belongsTo(models.class);
            }
        }
    });
    return sub;

}
